const authService = require("../services/auth.service");
const tokenService = require("../services/token.service");


class AuthController {
    async register(req, res, next) {
        console.log('Regsiter route');
        try {
            const { fullName, email, password } = req.body;
            const { user } = await authService.register(fullName, email, password);
            console.log(user, '< user register');
            const token = tokenService.generate({ id: user.id, email: user.email, })
            return res.status(201).json({ user, token });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user } = await authService.login(email, password);
            const token = tokenService.generate({ id: user.id, email: user.email, })
            return res.status(201).json({ user, token });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async logout(req, res, next) {
        try {
            const { email } = req.body;
            const result = await authService.logout(email);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
