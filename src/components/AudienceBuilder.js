import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import axios from 'axios';

const AudienceBuilder = () => {
  const [conditions, setConditions] = useState([
    { field: '', operator: '', value: '' },
  ]);
  const [audienceSize, setAudienceSize] = useState(null);

  const handleConditionChange = (index, key, value) => {
    const newConditions = [...conditions];
    newConditions[index][key] = value;
    setConditions(newConditions);
  };

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '' }]);
  };

  const calculateAudienceSize = async () => {
    try {
      const response = await axios.post('http://localhost:999/api/audience-size', {
        conditions,
      });
      setAudienceSize(response.data.audienceSize);
    } catch (error) {
      console.error('Error calculating audience size:', error);
    }
  };

  return (
    <div>
      <Typography variant="h5">Build Audience Segment</Typography>
      {conditions.map((condition, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
          <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: '150px' }}>
            <InputLabel>Field</InputLabel>
            <Select
              value={condition.field}
              onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
              label="Field"
            >
              <MenuItem value="totalSpending">Total Spending</MenuItem>
              <MenuItem value="visits">Visits</MenuItem>
              <MenuItem value="lastVisitDate">Last Visit Date</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: '100px' }}>
            <InputLabel>Operator</InputLabel>
            <Select
              value={condition.operator}
              onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
              label="Operator"
            >
              <MenuItem value=">">{'>'}</MenuItem>
              <MenuItem value="<">{'<'}</MenuItem>
              <MenuItem value="=">{'='}</MenuItem>
              <MenuItem value=">=">{'>='}</MenuItem>
              <MenuItem value="<=">{'<='}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Value"
            variant="outlined"
            value={condition.value}
            onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
            style={{ marginRight: '10px', minWidth: '150px' }}
          />
        </div>
      ))}
      <Button variant="contained" onClick={addCondition} style={{ marginRight: '10px' }}>
        Add Condition
      </Button>
      <Button variant="contained" color="primary" onClick={calculateAudienceSize}>
        Calculate Audience Size
      </Button>
      {audienceSize !== null && (
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Audience Size: {audienceSize}
        </Typography>
      )}
    </div>
  );
};

export default AudienceBuilder;
