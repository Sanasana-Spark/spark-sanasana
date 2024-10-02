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


const AddAssetForm = ({ onSubmit, onCancel, open }) => {
  const baseURL = process.env.REACT_APP_BASE_URL
  const [loading, setLoading] = useState(true);
  const [statusOptions, setStatusOptions] = useState([]);


  useEffect(() => {
    const apiUrl = `${baseURL}/assets/status`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setStatusOptions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  },[baseURL]);




  //   const classes = useStyles();
  const [asset, setAsset] = useState({
    a_status: "Active",
    a_fuel_type:"Petrol",
    a_accumulated_dep:0,
    a_apreciation_rate:0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset((prevAsset) => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(asset);
    // Optionally, you can reset the form after submission
    setAsset({
      a_status: "Active",
      a_fuel_type:"Petrol"

    });
  };

  const handleFileChange = (e) => {
    setAsset({
      ...asset,
      [e.target.name]: e.target.files[0],
    });
  };

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Asset</DialogTitle>
      <DialogContent>
        <Paper className={"classes.paper"}>
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
                  value={asset.a_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Make"
                  name="a_make"
                  value={asset.a_make}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Model"
                  name="a_model"
                  value={asset.a_model}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Year"
                  name="a_year"
                  type="number"
                  value={asset.a_year}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="License Plate"
                  name="a_license_plate"
                  value={asset.a_license_plate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Type"
                  name="a_type"
                  value={asset.a_type}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="MSRP"
                  name="a_msrp"
                  type="number"
                  value={asset.a_msrp}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Chassis Number"
                  name="a_chasis_no"
                  value={asset.a_chasis_no}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Engine Size"
                  name="a_engine_size"
                  type="number"
                  value={asset.a_engine_size}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Tank Size"
                  name="a_tank_size"
                  type="number"
                  value={asset.a_tank_size}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Efficiency Rate"
                  name="a_efficiency_rate"
                  type="number"
                  value={asset.a_efficiency_rate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="a_fuel_type">Fuel Type</InputLabel>
                <Select
                  labelId="a_fuel_type"
                  label="Fuel Type"
                  name="a_fuel_type"
                  value={asset.a_fuel_type}
                  onChange={handleChange}
                >
                  <MenuItem value="Petrol">Petrol</MenuItem>
                  <MenuItem value="Diesel">Diesel</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Cost"
                  name="a_cost"
                  type="number"
                  value={asset.a_cost}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Value"
                  name="a_value"
                  type="number"
                  value={asset.a_value}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Depreciation Rate"
                  name="a_depreciation_rate"
                  type="number"
                  value={asset.a_depreciation_rate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Appreciation Rate"
                  name="a_apreciation_rate"
                  type="number"
                  value={asset.a_apreciation_rate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Accumulated Depreciation"
                  name="a_accumulated_dep"
                  type="number"
                  value={asset.a_accumulated_dep}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  name="a_status"
                  value={asset.a_status}
                  onChange={handleChange}
                >

{!loading && (
<>



                  {statusOptions.map((status) => (
            <MenuItem key={status.id} value={status.s_name}>
              {status.s_name}
            </MenuItem>
          ))}

</> )}
                </Select>
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
