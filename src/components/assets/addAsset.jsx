import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper,
  FormControl,
  FormLabel,
} from '@mui/material';

const AddAssetForm = ({ onSubmit, onCancel, open }) => {
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

  const handleFileChange = (e) => {
    setProperty({
      ...property,
      [e.target.name]: e.target.files[0]
    });
  };


  return (
<Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Asset</DialogTitle>
      <DialogContent>
        <Paper className={'classes.paper'}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                  <FormLabel>Image</FormLabel>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                  name="a_image"
                />
                 </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Asset Name"
                  name="a_name"
                  value={property.a_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Make"
                  name="a_make"
                  value={property.a_make}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Model"
                  name="a_model"
                  value={property.a_model}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Year"
                  name="a_year"
                  type="number"
                  value={property.a_year}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="License Plate"
                  name="a_license_plate"
                  value={property.a_license_plate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Type"
                  name="a_type"
                  value={property.a_type}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="MSRP"
                  name="a_msrp"
                  type="number"
                  value={property.a_msrp}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Chassis Number"
                  name="a_chasis_no"
                  value={property.a_chasis_no}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Engine Size"
                  name="a_engine_size"
                  type="number"
                  value={property.a_engine_size}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Tank Size"
                  name="a_tank_size"
                  type="number"
                  value={property.a_tank_size}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Efficiency Rate"
                  name="a_efficiency_rate"
                  type="number"
                  value={property.a_efficiency_rate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Fuel Type"
                  name="a_fuel_type"
                  value={property.a_fuel_type}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Cost"
                  name="a_cost"
                  type="number"
                  value={property.a_cost}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Value"
                  name="a_value"
                  type="number"
                  value={property.a_value}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Depreciation Rate"
                  name="a_depreciation_rate"
                  type="number"
                  value={property.a_depreciation_rate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Appreciation Rate"
                  name="a_apreciation_rate"
                  type="number"
                  value={property.a_apreciation_rate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Accumulated Depreciation"
                  name="a_accumulated_dep"
                  type="number"
                  value={property.a_accumulated_dep}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Status"
                  name="a_status"
                  value={property.a_status}
                  onChange={handleChange}
                />
              </Grid>

              



              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>Attachment 1</FormLabel>
                  <input
                    accept="application/pdf"
                    type="file"
                    onChange={handleFileChange}
                    name="a_attachment1"
                  />
                </FormControl>
              </Grid>
                   

            <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>Attachment 2</FormLabel>
                  <input
                    accept="application/pdf"
                    type="file"
                    onChange={handleFileChange}
                    name="a_attachment2"
                  />
                </FormControl>
              </Grid>
              

              
            </Grid>
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button variant="contained" color="primary" onClick={onCancel}>
                Cancel
              </Button>
            </DialogActions>
          </form>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

AddAssetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddAssetForm;