const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authorization = require('../middlewares/authorization')
const upload = require('../services/upload.service')

router.get('/profile', authorization, userController.profile)
router.get('/profile/:userId', authorization, userController.getOneProfile)
router.put('/update', authorization, upload.single('image'), userController.update)
router.delete('/delete', authorization, userController.delete)
router.post('/search', authorization, userController.userSearch)


module.exports = router
