const tokenService = require('../services/token.service')

function authorization(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || typeof authorization !== 'string') {
            return res.status(400).json({ message: 'Authorization header is missing or invalid' });
        }

        const parts = authorization.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(400).json({ message: 'Authorization format is invalid' });
        }

        const accessToken = parts[1];
        if (accessToken == null) {
            return res.status(400).json({ message: 'Authorization token is missing' });
        }

        const tokenResult = tokenService.verifyAccessToken(accessToken);
        if (!tokenResult) {
            return res.status(401).json({ message: 'Authorization token is not valid' });
        }

        const { user } = tokenResult;
        req.user = user;

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An internal error occurred' });
    }
}

module.exports = authorization;
