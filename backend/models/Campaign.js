// const mongoose = require('mongoose');

// const campaignSchema = new mongoose.Schema({
//   title: String,
//   message: String,
//   segment: String, // segment name to target customers
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // CRM user
// });

// module.exports = mongoose.model('Campaign', campaignSchema);


// models/Campaign.js
// const mongoose = require("mongoose");

// const CampaignSchema = new mongoose.Schema({
//   name: String,
//   message: String,
//   segmentId: mongoose.Schema.Types.ObjectId,
//   audienceSize: Number,
//   sent: { type: Number, default: 0 },
//   failed: { type: Number, default: 0 },
// }, { timestamps: true });

// module.exports = mongoose.model("Campaign", CampaignSchema);


const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment', required: true },
  audienceSize: { type: Number, default: 0 },
  sent: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  // createdBy: "68384a0eb4c722b8441a027c"
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
