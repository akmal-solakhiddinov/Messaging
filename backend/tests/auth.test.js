// authService.test.js
const AuthService = require('../services/auth.service');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Mock the Prisma client and its methods
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('bcrypt');

describe('AuthService', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient(); // Get the mocked instance
        jest.clearAllMocks();  // Clear mocks before each test
    });

    describe('login', () => {
        it('should login successfully with correct credentials', async () => {
            const mockUser = { id: '1', email: 'test@example.com', password: 'hashedpassword' };
            prisma.user.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            const result = await AuthService.login('test@example.com', 'correctpassword');

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
            expect(result).toEqual({ user: mockUser });
        });

        it('should throw error if user is not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(AuthService.login('notfound@example.com', 'anyPassword'))
                .rejects.toThrow('User not found');
        });

        it('should throw error if password is invalid', async () => {
            const mockUser = { id: '1', email: 'test@example.com', password: 'hashedpassword' };
            prisma.user.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(AuthService.login('test@example.com', 'wrongpassword'))
                .rejects.toThrow('Invalid password');
        });
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = { id: '1', email: 'test@example.com', fullName: 'Test User', password: 'hashedpassword' };
            bcrypt.hash.mockResolvedValue('hashedpassword');
            prisma.user.create.mockResolvedValue(mockUser);

            const result = await AuthService.register('Test User', 'test@example.com', 'password123');

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@example.com',
                    fullName: 'Test User',
                    password: 'hashedpassword'
                }
            });
            expect(result).toEqual({ user: mockUser });
        });

        it('should throw error if email is already in use', async () => {
            const error = { code: 'P2002', meta: { target: ['email'] } };
            prisma.user.create.mockRejectedValue(error);

            await expect(AuthService.register('Test User', 'test@example.com', 'password123'))
                .rejects.toThrow('Email already in use');
        });

        it('should throw an error if user creation fails for other reasons', async () => {
            prisma.user.create.mockRejectedValue(new Error('Some other error'));

            await expect(AuthService.register('Test User', 'test@example.com', 'password123'))
                .rejects.toThrow('Some other error');
        });
    });

    describe('logout', () => {
        it('should return a successful logout message', async () => {
            const result = await AuthService.logout('test@example.com');

            expect(result).toEqual({ message: 'Logout successful' });
        });
    });
});
