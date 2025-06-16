const express = require('express');
const router = express.Router();
const orderController = require('../app/controller/OrderController');

router.post('/', orderController.placeOrder);
router.get('/track/:id', orderController.trackOrder);
router.post('/:id/status', orderController.updateOrderStatus);
router.post('/:id/cancel', orderController.CancelOrder);
router.get('/formOrder', orderController.showOrderForm);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;