const router = require('express').Router();
const roomController = require('../controllers/room.controller');
const authorization = require('../middlewares/authorization');
const isAuthor = require('../middlewares/isAuthor');
const verifyFriendship = require('../middlewares/verifyFriendship');


router.post('/create/:friendId', authorization, verifyFriendship, roomController.create)
router.get('/get-all', authorization, roomController.getAll)
router.get('/room-messages/:roomId', authorization, roomController.roomMessages)
router.delete('/delete/:roomId', authorization, isAuthor, roomController.delete)




module.exports = router;