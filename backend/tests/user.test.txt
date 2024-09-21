// user.test.js
const { PrismaClient } = require('@prisma/client');
const UserService = require('../services/user.service'); // Adjust path as necessary
const requestService = require('../services/request.service'); // Adjust path as necessary

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('../services/request.service'); // Mock request service

describe('UserService', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('profile', () => {
        it('should return user profile if user exists', async () => {
            const mockUser = { id: 1, username: 'user1', fullName: 'User 1' };
            prisma.user.findUnique.mockResolvedValue(mockUser);

            const result = await UserService.profile(1);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ user: mockUser });
        });

        it('should throw error if user does not exist', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(UserService.profile(1)).rejects.toThrow('User not found');
        });
    });

    describe('update', () => {
        it('should update user and return updated user', async () => {
            const updatedFields = { username: 'updatedUser' };
            const mockUser = { id: 1, username: 'updatedUser' };
            prisma.user.update.mockResolvedValue(mockUser);

            const result = await UserService.update(1, updatedFields);

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: updatedFields,
            });
            expect(result).toEqual({ user: mockUser });
        });

        it('should delete friend requests when changing account status to public', async () => {
            const updatedFields = { account: 'public' };
            const mockUser = { id: 1, account: 'public' };
            prisma.user.update.mockResolvedValue(mockUser);

            const result = await UserService.update(1, updatedFields);

            expect(requestService.deleteRequest).toHaveBeenCalledWith(1);
            expect(result).toEqual({ user: mockUser });
        });

        it('should throw an error if update fails', async () => {
            prisma.user.update.mockRejectedValue(new Error('Update error'));

            await expect(UserService.update(1, { username: 'test' })).rejects.toThrow('Error updating user with ID 1: Update error');
        });
    });

    describe('delete', () => {
        it('should delete a user and return the deleted user', async () => {
            const mockUser = { id: 1, username: 'deletedUser' };
            prisma.user.delete.mockResolvedValue(mockUser);

            const result = await UserService.delete(1);

            expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ user: mockUser });
        });

        it('should throw an error if delete fails', async () => {
            prisma.user.delete.mockRejectedValue(new Error('Delete error'));

            await expect(UserService.delete(1)).rejects.toThrow('Error deleting user with ID 1: Delete error');
        });
    });

    describe('userSearch', () => {
        it('should return a list of users matching the search criteria', async () => {
            const mockUsers = [
                { id: 1, username: 'user1', email: 'user1@example.com' },
                { id: 2, username: 'user2', email: 'user2@example.com' },
            ];
            prisma.user.findMany.mockResolvedValue(mockUsers);

            const result = await UserService.userSearch('user');

            expect(prisma.user.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { username: { contains: 'user' } },
                        { email: { contains: 'user' } },
                        { fullName: { contains: 'user' } },
                    ],
                },
            });
            expect(result).toEqual({ users: mockUsers });
        });

        it('should throw an error if search fails', async () => {
            prisma.user.findMany.mockRejectedValue(new Error('Search error'));

            await expect(UserService.userSearch('user')).rejects.toThrow('Error searching for users with value "user": Search error');
        });
    });

    describe('getOneProfile', () => {
        it('should retrieve user profile with chat rooms and request status', async () => {
            const mockUser = {
                id: 1,
                username: 'user1',
                account: 'private',
                chatRooms1: [{ id: 101 }],
                chatRooms2: [],
                RequestFriend: [{ id: 201 }],
            };
            prisma.user.findUnique.mockResolvedValue(mockUser);

            const result = await UserService.getOneProfile(2, 1);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    chatRooms1: { where: { userTwoId: 2 }, select: { id: true } },
                    chatRooms2: { where: { userOneId: 2 }, select: { id: true } },
                    RequestFriend: { where: { senderId: 2, status: 'approved' }, select: { id: true } },
                },
            });

            expect(result).toEqual({
                user: {
                    id: 1,
                    username: 'user1',
                    account: 'public', // Converted to public because of approved friend request
                    chatRoomId: 101,
                    email: undefined,
                    fullName: undefined,
                    status: undefined,
                    lastLogin: undefined,
                    image: undefined,
                    created: undefined,
                    updated: undefined,
                },
            });
        });

        it('should throw error if user is not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(UserService.getOneProfile(2, 1)).rejects.toThrow('User not found');
        });
    });
});
