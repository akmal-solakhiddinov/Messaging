const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const roomService = require('../services/room.service')

async function verifyFriendship(req, res, next) {
    try {
        const userId = req.user.id;
        const { friendId } = req.params;
        // const friendId = friendId || receiverId;

        if (!friendId) {
            return res.status(400).json({ message: 'Friend ID is required' });
        }


        const friend = await prisma.user.findUnique({ where: { id: friendId } });
        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (friend.account !== 'private') {
            return next();
        }

        const friendRequest = await prisma.request.findFirst({
            where: {
                OR: [
                    { friendId: friendId, senderId: userId },
                    { senderId: friendId, friendId: userId }
                ],
                status: 'approved'
            }
        });


        const { room } = await roomService.getSingleRoom(userId, friendId);

        // console.log(room, '<----room service ');
        // console.log(friendRequest, '<---- friend request');

        if (!friendRequest && !room) {
            return res.status(403).json({ message: 'You are not a friend of this user' });
        }

        return next();

    } catch (error) {
        console.error('Error verifying friendship:', error.message);
        return res.status(500).json({ message: 'An error occurred while verifying friendship' });
    }
}

module.exports = verifyFriendship;
