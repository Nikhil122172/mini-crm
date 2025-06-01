// controllers/campaignController.js
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');

exports.createCampaign = async (req, res) => {
  try {
    const { title, message, segment, createdBy } = req.body;

    // Build filter based on "visits" acting as segment
    let filter = {};

    if (segment === 'VIP') {
      filter.visits = { $gt: 10 };
    } else if (segment === 'Loyal') {
      filter.visits = { $gte: 5, $lte: 10 };
    } else if (segment === 'New') {
      filter.visits = { $gte: 1, $lt: 5 };
    } else if (segment === 'Inactive') {
      filter.visits = { $eq: 0 };
    }

    // Get customers matching the segment
    const targetCustomers = await Customer.find(filter);

    // Extract customer IDs
    const customerIds = targetCustomers.map(c => c._id);

    // Create and save campaign
    const campaign = new Campaign({
      title,
      message,
      segment,
      customers: customerIds,
      createdBy
    });
    await campaign.save();

    // Simulate sending messages
    targetCustomers.forEach(c => {
      console.log(`📢 Sending campaign "${title}" to ${c.name} (${c.email}): ${message}`);
    });

    res.status(201).json({ message: 'Campaign created and messages sent!', campaign });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};
