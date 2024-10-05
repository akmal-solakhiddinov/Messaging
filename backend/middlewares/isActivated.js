const userService = require('../services/user.service')

async function isActivated(req, res, next) {
    const userId = req.user.id
    const { user } = await userService.profile(userId)
    console.log(user);
    if (!user.isActivated) return res.status(400).json({ message: 'User has not been activated, Please activate your account' })

    req.user = user
    next()
}

module.exports = isActivated