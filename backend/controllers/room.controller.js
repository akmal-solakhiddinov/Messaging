const roomService = require('../services/room.service')
const { getIO } = require('../socket/socket')
const io = getIO()


class RoomController {
    async create(req, res, next) {
        try {
            const userOneId = req.user.id;
            const userTwoId = req.params.friendId;

            const { room } = await roomService.create(userOneId, userTwoId)
            io.on('joinRoom', (room) => {
                io.join(userOneId);
                io.join(userTwoId);
                console.log(`User ${socket.id} joined room ${room}`);
            });
            return res.status(201).json(room)
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            if (!userId) throw new Error('Authorization failure');

            const { rooms } = await roomService.getAll(userId)
            return res.status(201).json(rooms)
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async roomMessages(req, res, next) {
        try {
            const roomId = req.params.roomId;
            const pagination = req.query;
            const { messages } = await roomService.getMessages(roomId, req.user.id, pagination)

            return res.status(201).json(messages)
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res, next) {
        try {
            const { roomId } = req.params;
            const { room } = await roomService.delete(roomId)

            return res.status(201).json(room)
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

}


module.exports = new RoomController()