// Mock setup in your tests/room.test.js
// const { PrismaClient } = require('@prisma/client');
const RoomService = require('../services/room.service');
const prisma = require('../services/prisma')

jest.mock('@prisma/client', () => ({
    chatRoom: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
    },
}));

describe('RoomService', () => {
    // let prisma;

    beforeEach(() => {
        // prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should find and return an existing chat room', async () => {
            prisma.chatRoom.findFirst.mockResolvedValue({
                id: 1,
                userOneId: 1,
                userTwoId: 2,
            });

            const room = await RoomService.create(1, 2);

            expect(room).toEqual({
                room: { id: 1, userOneId: 1, userTwoId: 2 },
            });
        });

        it('should create a new chat room if none exists', async () => {
            prisma.chatRoom.findFirst.mockResolvedValue(null);

            prisma.chatRoom.create.mockResolvedValue({
                id: 2,
                userOneId: 1,
                userTwoId: 3,
            });

            const room = await RoomService.create(1, 3);

            expect(room).toEqual({
                room: { id: 2, userOneId: 1, userTwoId: 3 },
            });
        });
    });

    describe('getAll', () => {
        it('should retrieve all chat rooms for a user', async () => {
            prisma.chatRoom.findMany.mockResolvedValue([
                { id: 1, userOneId: 1, userTwoId: 2, userOne: {}, userTwo: {} },
                { id: 2, userOneId: 2, userTwoId: 1, userOne: {}, userTwo: {} },
            ]);

            const rooms = await RoomService.getAll(1);

            expect(rooms.rooms).toEqual([
                { id: 1, user: {} },
                { id: 2, user: {} },
            ]);
        });

        it('should handle empty room lists', async () => {
            prisma.chatRoom.findMany.mockResolvedValue([]);

            const rooms = await RoomService.getAll(1);

            expect(rooms.rooms).toEqual([]);
        });
    });
});
