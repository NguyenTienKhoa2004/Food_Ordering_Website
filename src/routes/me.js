const express = require('express');
const router = express.Router();

const meController = require('../app/controller/MeController');


router.get('/stored/item', meController.storeditem);
router.get('/order/list', meController.OrderList);
router.get('/', meController.dashboard);
router.post('/:id/toggle-admin', meController.toggleAdmin);

module.exports = router;