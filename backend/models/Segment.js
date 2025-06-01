const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  field: { type: String, required: true },      // 'totalSpend' or 'visits'
  operator: { type: String, required: true },   // '>', '<', '=='
  value: { type: Number, required: true }       // number value for filtering
});

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: [ruleSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Segment', segmentSchema);
