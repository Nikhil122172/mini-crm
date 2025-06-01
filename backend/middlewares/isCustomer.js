// middleware/isCustomer.js
const Customer = require('../models/Customer');

const isCustomer = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const customer = await Customer.findOne({ googleId: req.user.googleId });

    if (!customer) {
      return res.status(403).json({ message: 'Forbidden: Not a valid customer' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = isCustomer;
