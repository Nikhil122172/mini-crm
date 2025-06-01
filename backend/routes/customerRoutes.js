// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Add a new customer
router.post('/', customerController.addCustomer);

// Get all customers
router.get('/', customerController.getAllCustomers);

// Get customer by email
router.get('/:email', customerController.getCustomerByEmail);

router.delete('/:id', customerController.deleteCustomer);
router.put('/:id', customerController.updateCustomer);

module.exports = router;
