require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));



// OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,     // From GCP
  process.env.CLIENT_SECRET, // From GCP
  process.env.REDIRECT_URI,  // From GCP
);

// Generate OAuth URL
app.get('/auth/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/userinfo.profile'];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // For refresh token
    scope: scopes,
  });
  res.redirect(authUrl); // Redirect user to Google's consent screen
});

app.get('/auth/callback', async (req, res) => {
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

// Define Routes
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
