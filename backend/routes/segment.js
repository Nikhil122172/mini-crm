const express = require('express');
const router = express.Router();
const Segment = require('../models/Segment');

// Get all segments
router.get('/', async (req, res) => {
  try {
    const segments = await Segment.find();
    res.json(segments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new segment
router.post('/', async (req, res) => {
  try {
    const { name, rules } = req.body;
    const segment = new Segment({ name, rules });
    await segment.save();
    res.status(201).json(segment);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// routes/segments.js
router.post('/preview', async (req, res) => {
  const { rules } = req.body;

  try {
    const query = rules.reduce((acc, rule) => {
      const { field, operator, value } = rule;
      let condition = {};
      switch (operator) {
        case '>':
          condition[field] = { $gt: value };
          break;
        case '<':
          condition[field] = { $lt: value };
          break;
        case '==':
          condition[field] = value;
          break;
      }
      acc.push(condition);
      return acc;
    }, []);

    const customers = await Customer.find({ $and: query });
    res.json({ count: customers.length });
  } catch (err) {
    res.status(500).json({ error: 'Error previewing segment' });
  }
});


module.exports = router;
