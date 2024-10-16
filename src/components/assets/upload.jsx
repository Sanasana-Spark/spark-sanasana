import React, {  useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,

  Grid,
  Paper,
  FormControl,
  FormLabel,
} from "@mui/material";


const AddAssetForm = ({ onSubmit, onCancel, open }) => {
  // const baseURL = process.env.REACT_APP_BASE_URL
  // const [loading, setLoading] = useState(true);
  // const [statusOptions, setStatusOptions] = useState([]);


  // useEffect(() => {
  //   const apiUrl = `${baseURL}/assets/status`;
  //   fetch(apiUrl)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setStatusOptions(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     });
  // },[baseURL]);




  //   const classes = useStyles();
  const [asset, setAsset] = useState({
    a_status: "Active",
    a_fuel_type:"Petrol",
    a_accumulated_dep:0,
    a_apreciation_rate:0
  });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setAsset((prevAsset) => ({
  //     ...prevAsset,
  //     [name]: value,
  //   }));
  // };

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
      <DialogTitle id="form-dialog-title">Upload bulk records</DialogTitle>
      <DialogContent>
        <Paper className={"classes.paper"}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>Upload CSV</FormLabel>
                  <input
                    accept="csv/*"
                    type="file"
                    onChange={handleFileChange}
                    name="a_image"
                  />
                </FormControl>
              </Grid>

      
            </Grid>
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Process
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
