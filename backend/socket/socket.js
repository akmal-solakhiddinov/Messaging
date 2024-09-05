const { Server } = require('socket.io');
const userServise = require('../services/user.service')

let io;

function initIO(server) {
    io = new Server(server, { cors: { origin: "*" } });

    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            // console.log('A user connected:', socket.id, 'UserID:', userId);
            await userServise.update(userId, { status: 'online' });

            socket.on('joinRoom', (roomId) => {
                socket.join(roomId);
                // console.log(`User ${socket.id} joined room ${roomId}`);
            });

            socket.on('sendMessage', (roomId, message) => {
                console.log('sending message started')
                console.log(`room: ${roomId} message: ${JSON.stringify(message)}`);
                io.to(roomId).emit('message', message);
            });

            socket.on('offer', (data) => {
                const { offer, roomId } = data;
                socket.broadcast.to(roomId).emit('offer', { offer, roomId });
            });

            socket.on('answer', (data) => {
                const { answer, roomId } = data;
                socket.broadcast.to(roomId).emit('answer', { answer, roomId });
            });

            socket.on('candidate', (data) => {
                const { candidate, roomId } = data;
                socket.broadcast.to(roomId).emit('candidate', { candidate, roomId });
            });

            socket.on('disconnect', async () => {
                console.log('User disconnected:', socket.id);
                await userServise.update(userId, { status: 'offline' });
            });
        } else {
            console.log('User connected without userId:', socket.id);
        }
    });

    console.log('Socket.io initialized');
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

module.exports = { initIO, getIO };