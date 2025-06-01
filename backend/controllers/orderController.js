const Order = require('../models/Order');
const Customer = require('../models/Customer'); // ✅ Add this

// Add new order
exports.createOrder = async (req, res) => {
  try {
    const { customerId, amount, items } = req.body;

    // Save order
    const order = new Order({ customerId, amount, items });
    await order.save();

    // Update customer's totalSpend and visits
    await Customer.findByIdAndUpdate(customerId, {
      $inc: {
        totalSpend: amount,
        visits: 1
      }
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId', 'name email');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get orders by customer id
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Reduce customer's totalSpend and visits accordingly
    await Customer.findByIdAndUpdate(order.customerId, {
      $inc: {
        totalSpend: -order.amount,
        visits: -1
      }
    });

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { amount, items } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Calculate difference between old and new amount
    const amountDiff = amount - order.amount;

    // Update order fields
    order.amount = amount;
    order.items = items;
    await order.save();

    // Update customer's totalSpend with amount difference (visits stays same)
    await Customer.findByIdAndUpdate(order.customerId, {
      $inc: { totalSpend: amountDiff }
    });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
