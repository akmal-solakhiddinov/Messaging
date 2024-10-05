const authController = require('../controllers/auth.controller');
// const authorization = require('../middlewares/authorization');

const router = require('express').Router();


router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/refresh', authController.refresh)
router.get('/activation/:token', authController.activation)
router.post('/forget-password', authController.forgatPassword)
router.put('/recovery-account', authController.recoverAccount)
router.post('/resend-link', authController.resendLink)

module.exports = router;