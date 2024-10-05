const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "default-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default-secret-key";
const JWT_ACTIVATION_SECRET = process.env.JWT_ACTIVATION_SECRET || "default-secret-key";
const JWT_PASSWORD_SECRET = process.env.JWT_PASSWORD_SECRET || "default-secret-key";



class TokenService {
    generate(payload) {
        const accessToken = jwt.sign({ user: payload }, JWT_ACCESS_SECRET, { expiresIn: "15d" });
        const refreshToken = jwt.sign({ user: payload }, JWT_REFRESH_SECRET, { expiresIn: "30d" });
        const activationToken = jwt.sign({ user: payload }, JWT_ACTIVATION_SECRET, { expiresIn: "5m" });

        return { accessToken, refreshToken, activationToken };
    }

    /*     generateActivationToken(payload) {
            const token = jwt.sign({ user: payload }, JWT_ACTIVATION_SECRET, { expiresIn: "5m" });
    
            return { token };
        } */

    generatePasswordToken(payload) {
        const token = jwt.sign({ user: payload }, JWT_PASSWORD_SECRET, { expiresIn: "10m" });

        return { token };
    }


    async saveToken(userId, refreshToken) {
        try {
            const existingToken = await prisma.token.findUnique({
                where: { userId }
            });

            if (existingToken) {
                return await prisma.token.update({
                    where: { userId },
                    data: { token: refreshToken }
                });
            }

            return await prisma.token.create({
                data: { userId, token: refreshToken }
            });
        } catch (error) {
            throw new Error(`Failed to save token: ${error.message}`);
        }
    }


    async deleteToken(userId) {
        try {
            return await prisma.token.delete({
                where: { userId }
            });
        } catch (error) {
            throw new Error(`Failed to delete token: ${error.message}`);
        }
    }

    async findToken(refreshToken) {
        try {
            return await prisma.token.findUnique({
                where: { token: refreshToken }
            });
        } catch (error) {
            throw new Error(`Failed to find token: ${error.message}`);
        }
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, JWT_ACCESS_SECRET);
        } catch (error) {
            return null;
        }
    }

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET);
        } catch (error) {
            return null;
        }
    }


    verifyActivationToken(token) {
        try {
            return jwt.verify(token, JWT_ACTIVATION_SECRET);
        } catch (error) {
            return null;
        }
    }

    verifyPasswordToken(token) {
        try {
            return jwt.verify(token, JWT_PASSWORD_SECRET);
        } catch (error) {
            return null;
        }
    }
}

module.exports = new TokenService();
