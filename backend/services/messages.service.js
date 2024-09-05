const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getIO } = require('../socket/socket')

const io = getIO()

class MessageService {
    async send(newMessage) {
        try {
            const message = await prisma.message.create({ data: newMessage })

            if (!message) throw new Error(`Message couldn't send please look at your sended fields`)

            io.to(newMessage.chatId).emit('message', { ...message, sender: { id: newMessage.senderId } });

            return { message }
        } catch (error) {
            throw error
        }
    }

    async getAll(chatId, pagination) {
        const { page = 1, pageSize = 100 } = pagination;

        try {
            const skip = (page - 1) * pageSize;
            const take = parseInt(pageSize);
            const chatRoom = await prisma.chatRoom.findUnique({
                where: { id: chatId },
                include: {
                    userOne: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            status: true
                        }
                    },
                    userTwo: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            status: true
                        }
                    },
                    messages: {
                        skip,
                        take,
                        include: {
                            sender: {
                                select: {
                                    id: true,
                                    username: true,
                                    fullName: true
                                }
                            }
                        },
                        orderBy: { created: 'asc' }
                    }
                }
            });

            if (!chatRoom) {
                return res.status(404).json({ error: 'Chat room not found' });
            }

            const formattedMessages = chatRoom.messages.map(message => ({
                id: message.id,
                content: message.content,
                file: message.file,
                fileType: message.fileType,
                created: message.created,
                updated: message.updated,
                type: message.type,
                sender: {
                    id: message.sender.id,
                    username: message.sender.username,
                    fullName: message.sender.fullName
                }
            }));

            const messages = {
                id: chatRoom.id,
                userOne: {
                    id: chatRoom.userOne.id,
                    username: chatRoom.userOne.username,
                    fullName: chatRoom.userOne.fullName,
                    status: chatRoom.userOne.status
                },
                userTwo: {
                    id: chatRoom.userTwo.id,
                    username: chatRoom.userTwo.username,
                    fullName: chatRoom.userTwo.fullName,
                    status: chatRoom.userTwo.status
                },
                lastMessageId: chatRoom.lastMessageId,
                messages: formattedMessages,
                pagination: {
                    page: parseInt(page),
                    pageSize: take,
                    totalMessages: chatRoom.messages.length
                }
            };

            return { messages }
        } catch (error) {
            throw error
        }

    }

    async update(messageId, updatedMessage) {
        console.log(updatedMessage, 'message');
        try {
            const message = await prisma.message.update({ where: { id: messageId }, data: updatedMessage })
            if (!message) throw new Error(`Something went wrong while updating message`)

            return { message }
        } catch (error) {
            throw error
        }
    }

    async delete(messageId) {
        try {
            const message = await prisma.message.delete({ where: { id: messageId } })
            if (!message) throw new Error(`Something went wrong while deleting message`)

            return { message }
        } catch (error) {
            throw error
        }
    }

}
module.exports = new MessageService()