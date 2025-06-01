// controllers/customerController.js
const Customer = require('../models/Customer');

// Add new customer
exports.addCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  // const page = parseInt(req.query.page) || 1;     // default page = 1
  // const limit = parseInt(req.query.limit) || 10;  // default limit = 10

  // const skip = (page - 1) * limit;

  // try {
  //   const customers = await Customer.find().skip(skip).limit(limit);
  //   const total = await Customer.countDocuments();

  //   res.json({
  //     customers,
  //     total,
  //     page,
  //     totalPages: Math.ceil(total / limit),
  //   });
  // } catch (err) {
  //   res.status(500).json({ error: 'Server error' });
  // }
  
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one customer by email
exports.getCustomerByEmail = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete customer by ID
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};