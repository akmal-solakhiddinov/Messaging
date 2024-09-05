const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const requestService = require('./request.service');

class UserService {
    async profile(userId) {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error('User not found');
            return { user };
        } catch (error) {
            throw new Error(`Error retrieving profile for user ID ${userId}: ${error.message}`);
        }
    }

    async update(userId, updatedFields) {
        try {
            // Handle account status changes
            if (updatedFields.account) {
                if (updatedFields.account === 'public') {
                    await requestService.deleteRequest(userId);
                }
                // You can extend this for other account-related updates if needed
            }

            const user = await prisma.user.update({
                where: { id: userId },
                data: updatedFields,
            });

            if (!user) {
                throw new Error(`Error updating user with ID ${userId}`);
            }

            return { user };
        } catch (error) {
            throw new Error(`Error updating user with ID ${userId}: ${error.message}`);
        }
    }

    async delete(userId) {
        try {
            const user = await prisma.user.delete({ where: { id: userId } });
            if (!user) throw new Error('Error occurred while deleting the account');
            return { user };
        } catch (error) {
            throw new Error(`Error deleting user with ID ${userId}: ${error.message}`);
        }
    }

    async userSearch(value) {
        try {
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: value } },
                        { email: { contains: value } },
                        { fullName: { contains: value } },
                    ],
                },
            });

            return { users };
        } catch (error) {
            throw new Error(`Error searching for users with value "${value}": ${error.message}`);
        }
    }

    async getOneProfile(userId, id) {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                include: {
                    chatRooms1: { where: { userTwoId: userId }, select: { id: true } },
                    chatRooms2: { where: { userOneId: userId }, select: { id: true } },
                    RequestFriend: {
                        where: { senderId: userId, status: 'approved' },
                        select: { id: true },
                    },
                },
            });

            if (!user) throw new Error('User not found');

            const chatRoomId =
                user.chatRooms1?.[0]?.id || user.chatRooms2?.[0]?.id || null;

            // Adjust account type based on friendship status
            const accountType =
                user.account === 'private' && user.RequestFriend.length > 0
                    ? 'public'
                    : user.account;

            const response = {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                status: user.status,
                lastLogin: user.lastLogin,
                account: accountType,
                chatRoomId,
                image: user.image,
                created: user.created,
                updated: user.updated,
            };

            return { user: response };
        } catch (error) {
            throw new Error(`Error retrieving profile for user ID ${id}: ${error.message}`);
        }
    }
}

module.exports = new UserService();
