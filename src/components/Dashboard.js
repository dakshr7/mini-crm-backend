import React from 'react';
import AudienceBuilder from './AudienceBuilder';
import Campaigns from './Campaigns';

const Dashboard = () => {
  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <AudienceBuilder />
      <Campaigns />
    </div>
  );
};

export default Dashboard;
