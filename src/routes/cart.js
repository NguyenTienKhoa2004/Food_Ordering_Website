const express = require('express');
const router = express.Router();

const cartController = require('../app/controller/CartController');


router.get('/', cartController.showcart);
// router.delete('/:id', cartController.deleteItem);




module.exports = router;