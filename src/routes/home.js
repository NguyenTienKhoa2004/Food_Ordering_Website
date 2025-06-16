const express = require('express');
const router = express.Router();
const homeController = require('../app/controller/homeController');
const loginController = require('../app/controller/LoginController');
router.get('/', (req, res) => {
    res.redirect('/public');
});
router.get('/public', homeController.publicHome);
router.get('/user', homeController.userHome);
router.get('/login', loginController.login);
router.post('/login', loginController.authentication);
router.post('/signup', loginController.signup);
router.get('/logout', loginController.logout);




module.exports = router;