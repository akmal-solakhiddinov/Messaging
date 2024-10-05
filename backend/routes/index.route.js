const authorization = require('../middlewares/authorization.js');
const isActivated = require('../middlewares/isActivated.js');

const router = require('express').Router();

router.use('/auth', require('./auth.route.js'));
router.use('/user', authorization, require('./user.route.js'));
router.use('/rooms', authorization, isActivated, require('./room.route.js'));
router.use('/messages', authorization, isActivated, ((req, res, next) => {
    const s = req.cookies
    console.log(s, 'cookie');

    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true, sameSite: 'none', secure: false });
    next()
}), require('./messages.route.js'));
router.use('/requests', authorization, isActivated, require('./request.route.js'));
router.use('/friends', authorization, isActivated, require('./friends.route.js'));

module.exports = router;


