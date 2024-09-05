const router = require('express').Router();
const messagesController = require('../controllers/messages.controller');
const authorization = require('../middlewares/authorization');
const isAuthor = require('../middlewares/isAuthor');
const verifyFriendship = require('../middlewares/verifyFriendship');
const upload = require('../services/upload.service');

router.post('/send/:roomId/:friendId', authorization, verifyFriendship, upload.single('file'), messagesController.send)
router.put('/update/:messageId', authorization, isAuthor, messagesController.update)
router.delete('/delete/:messageId', authorization, isAuthor, messagesController.delete)
router.get('/get-all/:roomId', authorization, messagesController.getAll)


module.exports = router;