const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class FriendsService {
    async friendCreate(myUserId, userId, relationshipType, status) {
        try {
            const existingFriend = await prisma.friends.findFirst({
                where: {
                    userId: myUserId,
                    relatedUserId: userId
                }
            });

            if (existingFriend) {
                // Update the existing friend relationship if the status or relationship type has changed
                if (existingFriend.relationshipType !== relationshipType || existingFriend.status !== status) {
                    return this.friendUpdate(myUserId, userId, { relationshipType, status });
                }
                // No need to create a new entry if already exists with the same values
                return { user: existingFriend };
            }

            // Create a new friendship entry if none exists
            const user = await prisma.friends.create({
                data: {
                    userId: myUserId,
                    relatedUserId: userId,
                    status,
                    relationshipType,
                },
            });

            if (!user) throw new Error(`Something went wrong while creating friendship: ${userId}`);

            return { user };
        } catch (error) {
            throw error;
        }
    }

    async friendBlock(myUserId, userId) {
        try {
            const existingFriend = await prisma.friends.findFirst({
                where: { userId: myUserId, relatedUserId: userId }
            });

            if (existingFriend) {
                // Update the existing friendship to 'blocked'
                return this.friendUpdate(myUserId, userId, { relationshipType: 'blocked', status: 'active' });
            }

            // Create a new blocked friendship entry
            const user = await prisma.friends.create({
                data: {
                    userId: myUserId,
                    relatedUserId: userId,
                    relationshipType: 'blocked',
                    status: 'active'
                }
            });

            if (!user) throw new Error(`Something went wrong while blocking user: ${userId}`);

            return { user };

        } catch (error) {
            throw error;
        }
    }

    async friendUpdate(myUserId, userId, updateData) {
        try {
            const friend = await prisma.friends.updateMany({
                where: {
                    userId: myUserId,
                    relatedUserId: userId,
                },
                data: updateData,
            });

            if (friend.count === 0) throw new Error(`No friendship found between ${myUserId} and ${userId} to update`);

            return { message: "Friendship updated successfully" };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new FriendsService();
