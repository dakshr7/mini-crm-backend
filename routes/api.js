const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const CommunicationLog = require('../models/CommunicationLog');

// POST /api/audience-size
router.post('/audience-size', async (req, res) => {
  try {
    const { conditions } = req.body;

    // Build MongoDB query
    const query = conditions.reduce((acc, condition) => {
      const { field, operator, value } = condition;
      const mongoOperator = {
        '>': '$gt',
        '<': '$lt',
        '=': '$eq',
        '>=': '$gte',
        '<=': '$lte',
      }[operator];

      if (mongoOperator) {
        acc[field] = { [mongoOperator]: isNaN(value) ? value : parseFloat(value) };
      }

      return acc;
    }, {});

    // Query the database
    const audienceSize = await Customer.countDocuments(query);

    // Return the audience size
    res.status(200).json({ audienceSize });
  } catch (error) {
    console.error('Error calculating audience size:', error);
    res.status(500).json({ error: 'Failed to calculate audience size.' });
  }
});
// Send messages to audience
router.post('/sendMessages', async (req, res) => {
  try {
    const { campaignId } = req.body;
    const campaign = await campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const query = buildMongoQuery(campaign.audienceConditions);
    const customers = await Customer.find(query);

    // Loop through customers to send messages
    for (const customer of customers) {
      // Create a personalized message
      const message = `Hi ${customer.name}, here’s 10% off on your next order!`;

      // Simulate sending the message
      const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

      // Log the communication
      const log = new CommunicationLog({
        campaignId,
        customerId: customer._id,
        status,
      });
      await log.save();
    }

    res.status(200).json({ message: 'Messages sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function buildMongoQuery(conditions) {
  const query = {};
  const andConditions = conditions.map(condition => {
    let conditionObj = {};
    const field = condition.field;
    const operator = condition.operator;
    const value = condition.value;

    switch (operator) {
      case '>':
        conditionObj[field] = { $gt: value };
        break;
      case '<':
        conditionObj[field] = { $lt: value };
        break;
      case '=':
        conditionObj[field] = value;
        break;
      case '>=':
        conditionObj[field] = { $gte: value };
        break;
      case '<=':
        conditionObj[field] = { $lte: value };
        break;
    }

    return conditionObj;
  });

  if (andConditions.length > 0) {
    query['$and'] = andConditions;
  }

  return query;
}
// Update communication status
router.post('/deliveryReceipt', async (req, res) => {
    try {
      const { campaignId, customerId, status } = req.body;
  
      const log = new CommunicationLog({
        campaignId,
        customerId,
        status,
      });
  
      await log.save();
      res.status(200).json({ message: 'Status updated' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
// Get campaign statistics
router.get('/campaigns/:id/stats', async (req, res) => {
    try {
      const campaignId = req.params.id;
  
      const sent = await CommunicationLog.countDocuments({ campaignId, status: 'SENT' });
      const failed = await CommunicationLog.countDocuments({ campaignId, status: 'FAILED' });
  
      res.status(200).json({ sent, failed });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    try {
      const { tokens } = await oauth2Client.getToken(code); // Exchange code for tokens
      oauth2Client.setCredentials(tokens); // Set tokens to client
      res.json(tokens); // Return tokens to Postman or frontend
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      res.status(500).send('Authentication failed');
    }
  });
  module.exports = router;
