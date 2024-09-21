const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authorization = require('../middlewares/authorization');
const isActivated = require('../middlewares/isActivated');
const upload = require('../services/upload.service')

router.get('/profile', userController.profile)
router.get('/profile/:userId', isActivated, userController.getOneProfile)
router.put('/update', isActivated, upload.single('image'), userController.update)
router.delete('/delete', isActivated, userController.delete)
router.post('/search', isActivated, userController.userSearch)


module.exports = router
