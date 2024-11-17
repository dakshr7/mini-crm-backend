const mongoose = require('mongoose');

const CommunicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, enum: ['SENT', 'FAILED'], default: 'SENT' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunicationLog', CommunicationLogSchema);
