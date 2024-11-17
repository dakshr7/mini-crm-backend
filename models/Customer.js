const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  totalSpending: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  lastVisitDate: { type: Date },
});

module.exports = mongoose.model('Customer', CustomerSchema);
