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
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
const baseURL = process.env.REACT_APP_BASE_URL

const AddTripForm = ({ onSubmit, onCancel, open }) => {
  // const [trip, setTrip] = useState({ a_status: "" });
  const [statusOptions, setStatusOptions] = useState([]);
  const [assetOptions, setTripOptions] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);

  useEffect(() => {
    // Fetch status options from the backend
    const fetchStatusOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/trips/status`); // Adjust the URL as needed
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

  useEffect(() => {
    // Fetch status options from the backend
    const fetchTripOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/assets`); // Adjust the URL as needed
        if (response.ok) {
          const data = await response.json();
          setTripOptions(data);
        } else {
          console.error("Error fetching Trip options:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching Trip options:", error);
      }
    };

    fetchTripOptions();
  }, []);

  useEffect(() => {
    // Fetch status options from the backend
    const fetchOperatorOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/operators`); // Adjust the URL as needed
        if (response.ok) {
          const data = await response.json();
          setOperatorOptions(data);
        } else {
          console.error("Error fetching operator options:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching operator options:", error);
      }
    };

    fetchOperatorOptions();
  }, []);

  //   const classes = useStyles();
  const [trip, setTrip] = useState({
    t_status: "Pending",
    t_load:0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip((prevTrip) => ({
      ...prevTrip,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(trip);
    // Optionally, you can reset the form after submission
    setTrip({
      t_status: "Pending",

    });
  };



  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Trip</DialogTitle>
      <DialogContent>
        <Paper className={"classes.paper"}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Type"
                  name="t_type"
                  value={trip.t_type}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="start_lat"
                  name="t_start_lat"
                  type="number"
                  value={trip.t_start_lat}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="t_start_long"
                  name="t_start_long"
                  type="number"
                  value={trip.t_start_long}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="t_end_lat"
                  name="t_end_lat"
                  type="number"
                  value={trip.t_end_lat}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="t_end_long "
                  name="t_end_long"
                  type="number"
                  value={trip.t_end_long}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                 fullWidth
                  label="Load(Tonnes)"
                  name="t_load"
                  type="number"
                  value={trip.t_load}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                 fullWidth
                  label="start_date"
                  name="t_start_date"
                  type="date"
                  value={trip.t_start_date}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                 fullWidth
                  label="t_end_date"
                  name="t_end_date"
                  type="date"
                  value={trip.t_end_date}
                  onChange={handleChange}
                />
              </Grid>
              
           
            

              <Grid item xs={12} sm={6}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                fullWidth
                  labelId="status-label"
                  label="Status"
                  name="t_status"
                  value={trip.t_status}
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
                <InputLabel id="operator-label">Assign Driver</InputLabel>
                <Select
                fullWidth
                  labelId="operator-label"
                  label="Operator"
                  name="t_operator_id"
                  value={trip.t_operator_id}
                  onChange={handleChange}
                >
                  {operatorOptions.map((operator) => (
            <MenuItem key={operator.id} value={operator.id}>
              {operator.o_name} - {operator.o_status}
            </MenuItem>
          ))}
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputLabel id="trip-label">Assign Vehicle</InputLabel>
                <Select
                fullWidth
                  labelId="trip-label"
                  label="t_asset_id"
                  name="t_asset_id"
                  value={trip.t_asset_id}
                  onChange={handleChange}
                >
                  {assetOptions.map((trip) => (
            <MenuItem key={trip.id} value={trip.id}>
              {trip.a_license_plate}: {trip.a_make}-{trip.a_model}
            </MenuItem>
          ))}
                </Select>
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

AddTripForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddTripForm;
