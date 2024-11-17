import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:999/api/campaigns');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div>
      <Typography variant="h5">Campaign History</Typography>
      <List>
        {campaigns.map((campaign) => (
          <ListItem key={campaign.id}>
            <ListItemText
              primary={campaign.name}
              secondary={`Messages Sent: ${campaign.sent}, Failed: ${campaign.failed}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Campaigns;
