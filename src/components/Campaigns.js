import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:999/api/campaigns');
        const campaignsData = response.data;

        for (let campaign of campaignsData) {
          const statsResponse = await axios.get(
            `http://localhost:999/api/campaigns/${campaign._id}/stats`
          );
          campaign.stats = statsResponse.data;
        }

        setCampaigns(campaignsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div>
      <Typography variant="h5">Campaign History</Typography>
      <List>
        {campaigns.map((campaign) => (
          <ListItem key={campaign._id}>
            <ListItemText
              primary={campaign.name}
              secondary={
                <>
                  <div>Created At: {new Date(campaign.createdAt).toLocaleString()}</div>
                  <div>Messages Sent: {campaign.stats.sent}</div>
                  <div>Messages Failed: {campaign.stats.failed}</div>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Campaigns;
