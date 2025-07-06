const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const homeController = require('../app/controller/homeController');
const loginController = require('../app/controller/LoginController');
router.get('/', (req, res) => {
    res.redirect('/public');
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per window
  message: 'Too many login attempts, please try again later'
});
router.get('/public', homeController.publicHome);
router.get('/user', homeController.userHome);
router.get('/login', loginController.login);
router.post('/login',loginLimiter, loginController.authentication);
router.post('/signup', loginController.signup);
router.get('/logout', loginController.logout);




module.exports = router;