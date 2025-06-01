const express = require('express');
const router = express.Router();
// const { createOrder, getAllOrders } = require('../controllers/orderController');
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get orders by customerId
router.get('/customer/:customerId', orderController.getOrdersByCustomer);

router.delete('/:id', orderController.deleteOrder);  // DELETE order
router.put('/:id', orderController.updateOrder);  

module.exports = router;
