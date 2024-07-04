import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
} from '@mui/material';

const AddAssetForm = ({ onSubmit, onCancel }) => {
//   const classes = useStyles();
  const [property, setProperty] = useState({
    p_name: '',
    p_num_units: '',
    p_manager_id: '',
    p_country: '',
    p_city: '',
    p_address: '',
    p_zipcode: '',
    p_state: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prevProperty) => ({
      ...prevProperty,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(property);
    // Optionally, you can reset the form after submission
    setProperty({
      p_name: '',
      p_num_units: '',
      p_manager_id: '',
      p_country: '',
      p_city: '',
      p_address: '',
      p_zipcode: '',
      p_state: '',
    });
  };

  return (
    <Paper className={'classes.paper'}>
      <Typography variant="h6" gutterBottom>
        Add Asset
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Property Name"
              name="p_name"
              value={property.p_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Number of Units"
              name="p_num_units"
              type="number"
              value={property.p_num_units}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Property Manager ID"
              name="p_manager_id"
              value={property.p_manager_id}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Country"
              name="p_country"
              value={property.p_country}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="City"
              name="p_city"
              value={property.p_city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Address"
              name="p_address"
              value={property.p_address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Zip Code"
              name="p_zipcode"
              value={property.p_zipcode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="State"
              name="p_state"
              value={property.p_state}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>

        <Button  variant="contained" color="primary" onClick={onCancel}>
          cancel
        </Button>

      </form>
    </Paper>
  );
};

AddAssetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddAssetForm;