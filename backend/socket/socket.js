const { Server } = require('socket.io');
const userServise = require('../services/user.service')

let io;

function initIO(server) {
    io = new Server(server, { cors: { origin: "*" } });

    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            // console.log('A user connected:', socket.id, 'UserID:', userId);
            const now = new Date()
            await userServise.update(userId, { status: 'online', lastLogin: now });

            // console.log(socket.)

            socket.on('joinRoom', (roomId) => {
                // console.log(roomId);
                socket.join(roomId);
                // console.log(`User ${socket.id} joined room ${roomId}`);
            });

            socket.on('sendMessage', (roomId, message) => {
                console.log('sending message started')
                console.log(`room: ${roomId} message: ${JSON.stringify(message)}`);
                io.to(roomId).emit('message', message);
            });

            socket.on('offer', (data) => {
                const { offer, roomId, myId } = data;
                socket.broadcast.to(roomId).emit('offer', { offer, roomId, myId });
            });

            socket.on('answer', (data) => {
                const { answer, roomId, myId } = data;
                socket.broadcast.to(myId).emit('answer', { answer, roomId, myId });
            });

            socket.on('candidate', (data) => {
                const { candidate, roomId, myId } = data;
                console.log(candidate, roomId, myId, 'ice candidates');

                // Ensure we're not sending the candidate to the sender (myself)
                if (userId !== myId) {
                    socket.to(myId).emit('candidate', { candidate, roomId, myId });
                } else {
                    socket.to(roomId).emit('candidate', { candidate, roomId, myId });
                }
            });


            socket.on('endCall', ({ roomId }) => {
                console.log('End call!!!!');
                console.log('Room ID:', roomId);

                io.to(roomId).emit('endCall');
            });


            socket.on('disconnect', async () => {
                console.log('User disconnected:', socket.id);
                await userServise.update(userId, { status: 'offline', lastLogin: now });
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