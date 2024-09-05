const { prisma } = require('./prisma');
class RoomService {
    async create(user1, user2) {
        try {

            const { room } = await this.getSingleRoom(user1, user2)
            if (room) return { room }

            const newRoom = await prisma.chatRoom.create({
                data: {
                    userOneId: user1,
                    userTwoId: user2
                }
            });

            if (!newRoom) throw new Error('Room is not defined')

            return { room: newRoom }
        } catch (error) {
            throw error
        }
    }

    async getAll(userId) {
        try {
            const rooms = await prisma.chatRoom.findMany({
                where: {
                    OR: [
                        { userOneId: userId },
                        { userTwoId: userId }
                    ]
                },
                select: {
                    id: true,
                    userOne: { select: { username: true, email: true, id: true, image: true, fullName: true, status: true } },
                    userTwo: { select: { username: true, email: true, id: true, image: true, fullName: true, status: true } },
                    userOneId: true,
                    userTwoId: true
                }
            });

            if (!rooms) throw new Error('No room found')

            const data = rooms.map(room => {
                if (room.userOneId === userId) {
                    return {
                        id: room.id, user: room.userTwo
                    }
                }
                else if (room.userTwoId === userId) {
                    return {
                        id: room.id, user: room.userOne
                    }
                }

            })


            return { rooms: data }
        } catch (error) {
            throw error
        }
    }

    async delete(roomId) {
        try {
            const room = await prisma.chatRoom.delete({ where: { id: roomId } })

            if (!room) throw new Error('Something went wrong while deleting room')

            return { room }
        } catch (error) {
            throw error
        }
    }

    async getMessages(roomId, userId, pagination) {
        const { page = 1, pageSize = 100 } = pagination;

        try {
            const skip = (page - 1) * pageSize;
            const take = parseInt(pageSize);
            const messages = await prisma.chatRoom.findUnique({
                where: { id: roomId },
                include: {
                    userOne: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            status: true,
                            image: true,
                            lastLogin: true

                        }
                    },
                    userTwo: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            status: true,
                            image: true,
                            lastLogin: true
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

            if (!messages) {
                throw new Error('Chat room not found');
            }

            let data;

            if (messages.userOneId === userId) {
                data = {
                    id: messages.id, user: messages.userTwo, messages: messages.messages
                }
            }
            else if (messages.userTwoId === userId) {
                data = { id: messages.id, user: messages.userOne, messages: messages.messages }
            }


            return { messages: data };
        } catch (error) {
            console.error('Error retrieving messages:', error.message);
            throw new Error('Something went wrong while retrieving messages from the database');
        }
    }

    async getSingleRoom(user1, user2) {
        try {
            const room = await prisma.chatRoom.findFirst({
                where: {
                    OR: [
                        {
                            AND: [
                                { userOneId: user1 },
                                { userTwoId: user2 }
                            ]
                        },
                        {
                            AND: [
                                { userOneId: user2 },
                                { userTwoId: user1 }
                            ]
                        }
                    ]
                },
                include: {
                    userOne: { select: { username: true, email: true, id: true, image: true, fullName: true, status: true } },
                    userTwo: { select: { username: true, email: true, id: true, image: true, fullName: true, status: true } }
                }
            });

            return { room }
        } catch (error) {
            throw error
        }
    }

}


module.exports = new RoomService()


