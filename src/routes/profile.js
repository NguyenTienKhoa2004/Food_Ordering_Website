const express = require('express');
const router = express.Router();

const profileController = require('../app/controller/ProfileController');

router.get('/', profileController.editProfile); // Route to edit profile
router.post('/update', profileController.update); // Route to update profile




module.exports = router;