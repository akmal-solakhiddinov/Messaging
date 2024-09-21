const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const tokenService = require('./token.service');
const mailService = require('./email.service');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;  // Use a constant for bcrypt salt rounds

class AuthService {
    async register(fullName, email, password) {
        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });

            if (existingUser) throw new Error('Email already in use');

            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const user = await prisma.user.create({
                data: {
                    email,
                    fullName,
                    password: hashedPassword,
                },
            });

            if (!user) {
                throw new Error('User could not be created');
            }

            // Optionally send an activation email
            const tokens = tokenService.generate({
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            });

            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/v-1/auth/activation/${tokens.activationToken}`);
            // console.log(tokens.activationToken);


            await tokenService.saveToken(user.id, tokens.refreshToken);

            return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
        } catch (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    }

    async login(email, password) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            const tokens = tokenService.generate({
                id: user.id,
                email: user.email,
            });

            await tokenService.saveToken(user.id, tokens.refreshToken);

            return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    async logout(userId) {
        try {
            await tokenService.deleteToken(userId);
            return { message: 'Logout successful' };
        } catch (error) {
            throw new Error(`Logout failed: ${error.message}`);
        }
    }

    async activation(token) {
        try {
            const userPayload = tokenService.verifyActivationToken(token)
            if (!userPayload) throw new Error('Token is invalid or has expired');

            const { user } = userPayload;

            const prismaUser = await prisma.user.findUnique({ where: { id: user.id } });
            console.log(prismaUser);
            if (!prismaUser) throw new Error('User not found');

            if (prismaUser.isActivated) throw new Error('User is already activated');

            await prisma.user.update({
                where: { id: user.id },
                data: { isActivated: true },
            });

            return { message: 'Account activated successfully' };
        } catch (error) {
            throw new Error(`Activation failed: ${error.message}`);
        }
    }

    async forgotPassword(email) {
        try {
            if (!email) throw new Error('Email is required');

            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) throw new Error(`No user found with this email: ${email}`);

            const { token } = tokenService.generatePasswordToken({
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            });

            // Optionally send a password recovery email
            await mailService.sendForgotPasswordMail(email, `${process.env.CLIENT_URL}/recovery-account/${token}`);

            return { message: 'Password reset email sent' };
        } catch (error) {
            throw new Error(`Forgot password failed: ${error.message}`);
        }
    }

    async recoverAccount(token, newPassword) {
        try {
            if (!token) throw new Error('Invalid token');

            const { user } = tokenService.verifyPasswordToken(token);

            if (!user || !user.id) throw new Error('Token is invalid or has expired');

            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            return { message: 'Password has been reset successfully' };
        } catch (error) {
            throw new Error(`Password recovery failed: ${error.message}`);
        }
    }

    async resendLink(email) {
        try {
            if (!email) throw new Error('Missing fields! (email)')
            const user = await prisma.user.findUnique({ where: { email } })
            const tokens = tokenService.generate({ id: user.id, email: user.email, fullName: user.fullName })
            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/v-1/auth/activation/${tokens.activationToken}`);
            // console.log(tokens.activationToken);
            return { success: true }
        } catch (error) {
            throw error
        }
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error('Bad authorization')
        }

        const userPayload = tokenService.verifyRefreshToken(refreshToken)
        const tokenDb = await tokenService.findToken(refreshToken)
        if (!userPayload || !tokenDb) {
            throw new Error('Bad authorization')
        }

        const user = await prisma.user.findUnique({ where: { id: userPayload.id } })

        const tokens = tokenService.generateToken({ id: user.id, email: user.email, fullName: user.fullName })

        await tokenService.saveToken(user.id, tokens.refreshToken)

        return { user: user, ...tokens }
    }
}

module.exports = new AuthService();
