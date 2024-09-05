const router = require('express').Router();

router.use('/auth', require('./auth.route.js'));
router.use('/user', require('./user.route.js'));
router.use('/rooms', require('./room.route.js'));
router.use('/messages', require('./messages.route.js'));
router.use('/requests', require('./request.route.js'));
router.use('/friends', require('./friends.route.js'));

module.exports = router;


