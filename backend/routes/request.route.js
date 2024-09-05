const router = require("express").Router();
const requestController = require("../controllers/request.controller");
const authorization = require('../middlewares/authorization')


router.post('/friend/:friendId', authorization, requestController.friend)
router.put('/friend/:requestId/', authorization, requestController.friendRequestStatus)
// router.post('/friend/:requestId/reject', authorization, requestController.friendReject)
router.get('/friend/get-all', authorization, requestController.friendRequestAll)


module.exports = router