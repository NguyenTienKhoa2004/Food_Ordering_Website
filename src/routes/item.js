const express = require('express');
const router = express.Router();

const itemController = require('../app/controller/ItemController');

router.get('/create', itemController.create);
router.get('/exclusiveDeals', itemController.create);
router.post('/store', itemController.store);
router.get('/edit/:slug', itemController.edit);
router.put('/:id', itemController.update);





module.exports = router; 