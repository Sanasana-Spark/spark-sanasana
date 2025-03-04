import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


const AddAssetForm = ({ onSubmit, onCancel, open }) => {
  const baseURL = process.env.REACT_APP_BASE_URL
  const [loading, setLoading] = useState(true);
  const [statusOptions, setStatusOptions] = useState([]);

  const years = Array.from(new Array(50), (val, index) =>
    new Date().getFullYear() - index
  );

  useEffect(() => {
    if(open){
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
  }
},[baseURL, open]);




  //   const classes = useStyles();
  const [formData, setFormData] = useState({
    a_make: "",
    a_model: "",
    a_year: "",
    a_fuel_type: "Diesel",
    a_tank_size: 100,
    a_displacement: "",
    a_mileage: "",
    a_horsepower: null,
    a_acceleration: null,
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
      a_fuel_type:"Diesel"

    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  if (loading) {
    return <>Loading...</>;
  }


  return (
    <Modal open={open} onClose={onCancel} sx={{ zIndex: 100}} >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 10,
            pb: 1,
          }}
        >
          <Typography variant="h6">Add Vehicle</Typography>
          <IconButton onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>


        {/* Section 1 */}
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Vehicle Details</Typography>
        <TextField required label="Make(eg: mercedes)" name="a_make" fullWidth margin="dense" onChange={handleChange} />
        <TextField required label="Model(eg: zetros)" name="a_model" fullWidth margin="dense" onChange={handleChange} />
        <TextField  required select label="Year" name="a_year" fullWidth margin="dense" onChange={handleChange}>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
        <TextField required select label="Fuel Type" name="a_fuel_type" fullWidth margin="dense" onChange={handleChange}>
          <MenuItem value="Petrol">Petrol</MenuItem>
          <MenuItem value="Diesel">Diesel</MenuItem>
        </TextField>
        <TextField required label="Tank Size" name="a_tank_size" fullWidth margin="dense" onChange={handleChange} />
        <TextField required label="Displacement/cc" name="a_displacement" fullWidth margin="dense" onChange={handleChange} />
        <TextField required label="Mileage" name="a_mileage" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Horsepower" name="a_horsepower" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Acceleration" name="a_acceleration" fullWidth margin="dense" onChange={handleChange} />
        <TextField required label="Reg No" name="a_license_plate" fullWidth margin="dense" onChange={handleChange} />
        
        <TextField label="Status" name="a_status" fullWidth margin="dense" onChange={handleChange} > 
 {statusOptions.map((status) => (
                      <MenuItem key={status.id} value={status.s_name}>
                        {status.s_name}
                      </MenuItem>
                    ))} 

        </TextField>
        <TextField required label="Insurance Expiry Date"  name="a_insurance_expiry"
                          type="date"
                          onChange={(date) => setFormData({ ...formData, insuranceExpiryDate: date })}
          renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                        />


        {/* Section 2 */}
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
          Valuation
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "10px" }}>
          This is to help calculation depreciation of your vehicles
        </Typography>
        <TextField label="Cost" name="a_cost" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Valuation" name="a_value" fullWidth margin="dense" onChange={handleChange} />

        {/* Section 3 */}
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
          Attachments
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "10px" }} >
          Upload is necessary attachment for reference
        </Typography>
        <input type="file" name="a_attachment1" onChange={handleFileChange} />
        <input type="file" name="a_attachment2" onChange={handleFileChange} />
        <input type="file" name="a_attachment3" onChange={handleFileChange} />

        <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default AddAssetForm;
