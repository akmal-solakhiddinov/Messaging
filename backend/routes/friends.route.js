const router = require('express').Router();
const friendsController = require('../controllers/friends.controller');
const authorization = require('../middlewares/authorization');

router.post('create', authorization, friendsController.friendCreate)
router.post('block', authorization, friendsController.friendBlock)
router.put('update', authorization, friendsController.friendUpdate)


module.exports = router;