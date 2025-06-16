const express = require('express');
const router = express.Router();

const exclusiveDealsController = require('../app/controller/ExclusiveDealsController');

router.get('/create', exclusiveDealsController.create);
router.post('/store', exclusiveDealsController.store);
router.get('/edit/:id', exclusiveDealsController.edit);
router.put('/:id', exclusiveDealsController.update);
router.delete('/:id', exclusiveDealsController.deleteItem);





module.exports = router;