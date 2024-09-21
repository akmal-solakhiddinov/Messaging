const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const requestService = require('./request.service');

class UserService {
    async profile(userId) {
        // console.log(userId, '<use rid');
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
            if (updatedFields.account) {
                if (updatedFields.account === 'public') {
                    await requestService.deleteRequest(userId);
                }
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

    async getOneProfile(myUserId, userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    chatRooms1: { where: { userTwoId: myUserId }, select: { id: true } },
                    chatRooms2: { where: { userOneId: myUserId }, select: { id: true } },
                    RequestFriend: {
                        where: { senderId: myUserId, status: 'approved' },
                        select: { id: true },
                    },
                },
            });

            // console.log(user);
            if (!user) throw new Error('User not found');

            const chatRoomId =
                user.chatRooms1?.[0]?.id || user.chatRooms2?.[0]?.id || null;

            // Adjust account type based on friendship status
            console.log('start')
            const accountType =
                user.account === 'private' && user.RequestFriend.length > 0 || (chatRoomId !== null && chatRoomId.length) > 0
                    ? 'public'
                    : user.account;
            console.log(accountType, 'account type')

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

            // console.log('my id: ', myUserId, 'user id: ', userId)
            return { user: response };
        } catch (error) {
            throw new Error(`Error retrieving profile for user ID ${id}: ${error.message}`);
        }
    }
}

module.exports = new UserService();
