const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const isAuthor = async (req, res, next) => {
    try {
        const { roomId, messageId } = req.params;
        const userId = req.user.id;

        if (roomId) {
            const room = await prisma.chatRoom.findFirst({
                where: {
                    id: roomId,
                    OR: [
                        { userOneId: userId },
                        { userTwoId: userId }
                    ]
                }
            });

            if (!room) {
                return res.status(403).json({ message: 'You are not authorized to perform this action on this room.' });
            }

            return next();
        }

        if (messageId) {
            const message = await prisma.message.findFirst({
                where: {
                    id: messageId,
                    senderId: userId
                }
            });

            if (!message) {
                return res.status(403).json({ message: 'You are not authorized to perform this action on this message.' });
            }

            return next();
        }

        return res.status(400).json({ message: 'Invalid request parameters.' });

    } catch (error) {
        console.error('Error in isAuthor middleware:', error.message);
        return res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

module.exports = isAuthor;
