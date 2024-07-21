import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
const baseURL = process.env.REACT_APP_BASE_URL

const AddAssetForm = ({ onSubmit, onCancel, open }) => {
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    // Fetch status options from the backend
    const fetchStatusOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/operators/status`); // Adjust the URL as needed
        if (response.ok) {
          const data = await response.json();
          setStatusOptions(data);
        } else {
          console.error("Error fetching status options:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching status options:", error);
      }
    };

    fetchStatusOptions();
  }, []);

  //   const classes = useStyles();
  const [operator, setOperator] = useState({
    o_status: "Active",
    o_cum_mileage: 0,
    o_role: "Driver",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOperator((prevAsset) => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(operator);
    // Optionally, you can reset the form after submission
    setOperator({
      p_name: "",
      p_num_units: "",
      p_manager_id: "",
      p_country: "",
      p_city: "",
      p_address: "",
      p_zipcode: "",
      p_state: "",
    });
  };

  const handleFileChange = (e) => {
    setOperator({
      ...operator,
      [e.target.name]: e.target.files[0],
    });
  };

  return (
<Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Operator</DialogTitle>
      <DialogContent>
        <Paper className={'classes.paper'}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                  <FormLabel>Profile</FormLabel>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                  name="o_image"
                />
                 </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Operators Name"
                  name="o_name"
                  value={operator.o_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Email"
                  name="o_email"
                  type = "email"
                  value={operator.o_email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Phone"
                  name="o_phone"
                  value={operator.o_phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="National id"
                  name="o_national_id"
                  value={operator.o_national_id}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="License Id"
                  name="o_lincense_id"
                  value={operator.o_lincense_id}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Lincense Type"
                  name="o_lincense_type"
                  value={operator.o_lincense_type}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assiged card"
                  name="o_payment_card_id"
                  value={operator.o_payment_card_id}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Role"
                  name="o_role"
                  value={operator.o_role}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Experince(in years)"
                  name="o_expirence"
                  type="number"
                  value={operator.o_expirence}
                  onChange={handleChange}
                />
              </Grid>
              

              <Grid item xs={12} sm={6}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  name="o_status"
                  value={operator.o_status}
                  onChange={handleChange}
                >
                  {statusOptions.map((status) => (
            <MenuItem key={status.id} value={status.s_name}>
              {status.s_name}
            </MenuItem>
          ))}
                </Select>
              </Grid>
             
             

             
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Lincense Expiry"
                  name="o_lincense_expiry"
                  type="date"
                  value={operator.o_lincense_expiry}
                  onChange={handleChange}
                />
              </Grid>


              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>Attachment </FormLabel>
                  <input
                    accept="application/pdf"
                    type="file"
                    onChange={handleFileChange}
                    name="o_attachment1"
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