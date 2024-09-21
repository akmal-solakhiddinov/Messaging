const tokenService = require('../services/token.service')
function authorization(req, res, next) {
    try {


        const authorization = req.headers.authorization
        if (!authorization) {
            return next(new Error('Authorization header is missing '))
        }

        const accessToken = authorization.split(' ')[1]
        if (!accessToken) {
            return next(new Error('Authorization header is missing '))
        }

        const tokenResult = tokenService.verifyAccessToken(accessToken)
        if (tokenResult === null) {
            return res.status(400).json({ message: 'Authorization header is not valid' })
        }

        const { user } = tokenResult;

        req.user = user;
        next()
    } catch (error) {
        return next()
    }
}

module.exports = authorization;