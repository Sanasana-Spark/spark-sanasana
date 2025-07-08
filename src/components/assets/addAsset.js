import React, { useState } from "react";
// import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";

const AddAssetForm = ({ onSubmit, onCancel, open }) => {
  const [saving, setSaving] = useState(false);

  const years = Array.from(
    new Array(50),
    (val, index) => new Date().getFullYear() - index
  );


  //   const classes = useStyles();
  const [formData, setFormData] = useState({
    a_make: null,
    a_model: null,
    a_year: null,
    a_fuel_type: null,
    a_tank_size: null,
    a_displacement: null,
    a_mileage: null,
    a_horsepower: null,
    a_acceleration: 2,
    a_insurance_expiry: null,
    a_license_plate: null,
    a_status: "Active",
    a_cost: null,
    a_value: null,
    a_attachment1: null,
    a_attachment2: null,
    a_attachment3: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevAsset) => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Optionally, you can reset the form after submission
    setFormData({
      a_status: "Active",
      a_fuel_type: "Diesel",
    });
  };

  //   const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFormData({
  //         ...formData,
  //           "a_attachment1": {
  //               name: file.name,
  //               type: file.type,
  //               size: file.size,
  //               data: reader.result.split(",")[1], // Extract the base64 string
  //         }, // base64 string
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };


  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Vehicle</DialogTitle>
      <DialogContent >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} paddingTop={1} >
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Make(eg: Toyota)"
                  name="a_make"
                  value={formData.a_make}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Model(eg: Corolla)"
                  name="a_model"
                  value={formData.a_model}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl required fullWidth>
                  <InputLabel id="asset-label">Year</InputLabel>
                  <Select
                    required
                    fullWidth
                    labelId="asset-label"
                    id="a_year"
                    label="a_year"
                    name="a_year"
                    value={formData.a_year}
                    onChange={handleChange}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>{" "}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl required fullWidth>
                  <InputLabel id="a_fuel_type">Fuel Type</InputLabel>
                  <Select
                    required
                    labelId="a_fuel_type"
                    id="a_fuel_type"
                    label="a_fuel_type"
                    name="a_fuel_type"
                    value={formData.a_fuel_type}
                    onChange={handleChange}
                  >
                    <MenuItem value="Petrol">Petrol</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                  </Select>{" "}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Tank Size(in litres)"
                  name="a_tank_size"
                  value={formData.a_tank_size}
                  onChange={handleChange}
                />
              </Grid>

               <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Mileage(in KM)"
                  name="a_mileage"
                  value={formData.a_mileage}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Displacement(2500cc)"
                  name="a_displacement"
                  value={formData.a_displacement}
                  onChange={handleChange}
                />
              </Grid>

             

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Acceleration((m/s²)"
                  name="a_acceleration"
                  value={formData.a_acceleration}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Reg No/ Plate No"
                  name="a_license_plate"
                  value={formData.a_license_plate}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  id="status-label"
                  label="Insurance Expiry Date"
                  name="a_insurance_expiry"
                  type="date"
                  value={formData.a_insurance_expiry}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {/* 
             onChange={(date) =>
                  setFormData({ ...formData, insuranceExpiryDate: date })
                } */}

              {/* Section 2 */}

              <Grid item xs={12} sm={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, fontWeight: "bold" }}
                >
                  Valuation
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "10px" }}>
                  This is to help calculate depreciation of your vehicles
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Acquisition Cost"
                  name="a_cost"
                  value={formData.a_cost}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="current Valuation"
                  name="a_value"
                  value={formData.a_value}
                  onChange={handleChange}
                />
              </Grid>
{/* 
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>
                    Attachments{" "}
                    <Typography variant="body2" sx={{ fontSize: "10px" }}>
                      Upload is necessary attachment for reference
                    </Typography>{" "}
                  </FormLabel>
                  <input
                    accept="application/pdf, image/*"
                    type="file"
                    onChange={handleFileChange}
                    name="a_attachment1"
                  />
                  {/* <input
                    accept="application/pdf, image/*"
                    type="file"
                    name="a_attachment2"
                    onChange={handleFileChange}
                  />
                  <input
                    accept="application/pdf, image/*"
                    type="file"
                    name="a_attachment3"
                    onChange={handleFileChange}
                  /> 
                </FormControl>
              </Grid> */}

            </Grid>

            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  onCancel();
                  setSaving(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "var(--secondary-color)",
                  color: "white",
                }}
                disabled={saving}
              >
                {saving ? "submitting..." : "Submit"}
              </Button>
            </DialogActions>
          </form>
       
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetForm;
