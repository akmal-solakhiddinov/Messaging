const authService = require('../services/auth.service');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token.service');
const mailService = require('../services/email.service');
const { PrismaClient } = require('@prisma/client');

jest.mock('bcrypt');
jest.mock('../services/token.service');
jest.mock('../services/email.service');
jest.mock('@prisma/client', () => {
    const userMock = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => userMock) };
});

describe('AuthService - register', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    it('should register a user successfully', async () => {
        const mockUser = {
            id: 1,
            email: 'user@mail.com',
            fullName: 'User Name',
            password: 'hashedPassword',
        };

        const mockTokens = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            activationToken: 'activationToken',
        };

        bcrypt.hash.mockResolvedValue('hashedPassword');

        prisma.user.create.mockResolvedValue(mockUser);

        tokenService.generate.mockReturnValue(mockTokens);

        mailService.sendActivationMail.mockResolvedValue(true);

        const result = await authService.register('User Name', 'user@mail.com', 'password123');

        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                fullName: 'User Name',
                email: 'user@mail.com',
                password: 'hashedPassword',
            },
        });
        expect(tokenService.generate).toHaveBeenCalledWith({
            id: 1,
            email: 'user@mail.com',
            fullName: 'User Name',
        });
        expect(mailService.sendActivationMail).toHaveBeenCalledWith(
            'user@mail.com',
            `${process.env.API_URL}/api/v-1/auth/activation/${mockTokens.activationToken}`
        );
        expect(result).toEqual({
            user: mockUser,
            accessToken: mockTokens.accessToken,
            refreshToken: mockTokens.refreshToken,
        });
    });

    it('should throw an error if email is already in use', async () => {
        prisma.user.findUnique.mockResolvedValue({ email: 'user@mail.com' });

        await expect(
            authService.register('User Name', 'user@mail.com', 'password123')
        ).rejects.toThrow('Email already in use');

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'user@mail.com' },
        });
    });
});

describe('AuthService - login', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    it('should log in successfully with correct credentials', async () => {
        const mockUser = {
            id: 1,
            email: 'user@mail.com',
            fullName: 'User Name',
            password: 'hashedPassword',
        };

        const mockTokens = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
        };

        prisma.user.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        tokenService.generate.mockReturnValue(mockTokens);

        const result = await authService.login('user@mail.com', 'password123');

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'user@mail.com' },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        expect(tokenService.generate).toHaveBeenCalledWith({
            id: 1,
            email: 'user@mail.com',
        });
        expect(result).toEqual({
            user: mockUser,
            accessToken: mockTokens.accessToken,
            refreshToken: mockTokens.refreshToken,
        });
    });

    it('should throw an error if user is not found', async () => {
        prisma.user.findUnique.mockResolvedValue(null);

        await expect(
            authService.login('user@mail.com', 'password123')
        ).rejects.toThrow('User not found');

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: 'user@mail.com' },
        });
    });

    it('should throw an error if password is invalid', async () => {
        const mockUser = {
            id: 1,
            email: 'user@mail.com',
            fullName: 'User Name',
            password: 'hashedPassword',
        };

        prisma.user.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        await expect(
            authService.login('user@mail.com', 'password123')
        ).rejects.toThrow('Invalid password');

        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });
});
