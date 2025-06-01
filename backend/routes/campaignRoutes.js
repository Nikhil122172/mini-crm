
const express = require('express');
const router = express.Router();

const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const sendWhatsAppMessage = require('../utils/sendWhatsappMessage');
// const { sendWhatsAppWebMessage, initClient } = require('../utils/sendWhatsappMessage');
const sendEmail = require('../utils/emailSender');

// Helper: Build Mongo query from segment rules (without lastActive)
function buildCustomerQuery(rules) {
  const query = { $and: [] };
  
  rules.forEach(({ field, operator, value }) => {
    let condition = {};
    switch(operator) {
      case '>':
        condition[field] = { $gt: value };
        break;
      case '<':
        condition[field] = { $lt: value };
        break;
      case '==':
        condition[field] = value;
        break;
      default:
        break;
    }
    query.$and.push(condition);
  });

  // If no rules, return empty filter (all customers)
  return query.$and.length ? query : {};
}

// POST /api/campaigns - create and launch a campaign
// initClient();
router.post('/', async (req, res) => {
  try {
    const { name, message, segmentId, userId } = req.body;

    // Find segment
    const segment = await Segment.findById(segmentId);
    if (!segment) return res.status(404).json({ error: 'Segment not found' });

    // Build customer query from segment rules
    const customerQuery = buildCustomerQuery(segment.rules);

    // Find customers matching segment
    const customers = await Customer.find(customerQuery);

    // Create campaign record
    const campaign = await Campaign.create({
      name,
      message,
      segmentId,
      audienceSize: customers.length,
      createdBy: userId,
    });

    let sentCount = 0, failedCount = 0;

    // Simulate message sending and save communication logs
    console.log(customers);
    
    // for (const customer of customers) {
    //   const personalizedMessage = message.replace("{{name}}", customer.name);
    //   const success = Math.random() < 0.9;  // 90% success rate

    //   await CommunicationLog.create({
    //     campaignId: campaign._id,
    //     customerId: customer._id,
    //     message: personalizedMessage,
    //     status: success ? 'SENT' : 'FAILED'
    //   });

    //   if(success) sentCount++; else failedCount++;
    // }

    for (const customer of customers) {
      if (customer.phone) {
        await sendWhatsAppMessage(customer.phone, message);
      }
      // Send WhatsApp message via WhatsWeb
      // const personalizedMessage = message.replace('{{name}}', customer.name);
      // let status = 'FAILED';

      // // Send WhatsApp message via WhatsWeb
      // if (customer.phone) {
      //   try {
      //     await sendWhatsAppWebMessage(customer.phone, personalizedMessage);
      //     sentCount++;
      //     status = 'SENT';
      //   } catch (err) {
      //     console.error(`WhatsApp failed for ${customer.phone}:`, err.message);
      //     failedCount++;
      //   }
      // }
    }

    for (const customer of customers) {
  const email = customer.email;
  if (!email) continue; // skip if no email

  try {
    await sendEmail(email, `Campaign: ${campaign.name}`, campaign.message);
  } catch (err) {
    console.error(`Failed to send email to ${email}:`, err);
  }
}

    // Update campaign stats
    campaign.sent = sentCount;
    campaign.failed = failedCount;
    await campaign.save();

    res.json({ success: true, campaign });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/campaigns - list campaigns sorted by newest first
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
