const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

class AuthService {
    async login(email, password) {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            return { user };
        } catch (err) {
            throw err;
        }
    }

    async register(fullName, email, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);


            const user = await prisma.user.create({
                data: {
                    email,
                    fullName,
                    password: hashedPassword
                }
            });

            if (!user) {
                throw new Error('User could not be created');
            }

            return { user };
        } catch (err) {
            if (err.code === 'P2002' && err.meta.target.includes('email')) {
                throw new Error('Email already in use');
            }
            throw err;
        }
    }

    async logout(email) {
        return { message: 'Logout successful' };
    }
}

module.exports = new AuthService();