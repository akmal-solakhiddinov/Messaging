const tokenService = require('../services/token.service')
const userServise = require('../services/user.service')
const { getIO } = require('../socket/socket')

function system(req, res, next) {
    const io = getIO()

    const header = req.headers.authorization;
    if (!header) return next()

    const auth = header.split(' ')[1]
    const { user } = tokenService.verify(auth)

    if (user.id) {
        io.on('connection', async (socket) => {
            console.log('Socket is initialazied');
            const status = await userServise.update(user.id, { status: 'online' })
        })

        io.on('disconnection', async (socket) => {
            console.log('Socket is initialazied');
            const status = await userServise.update(user.id, { status: 'offline' })
        })
    }

    return next()
}


module.exports = system;