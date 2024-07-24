import React, { useEffect, useState, useRef,useCallback, useMemo } from "react";
import {
  DialogActions,
  Button,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
const libraries = ["places"];

const center = { lat: 0.00075, lng: 36.0098 };
//   const center = { lat: 48.8584, lng: 2.2945 }

const AddTripMapForm = ({ onSubmit, onCancel, open }) => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const [statusOptions, setStatusOptions] = useState([]);
  const [assetOptions, setTripOptions] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);

  const [trip, setTrip] = useState({
    t_load: 0,
    t_status: "Pending",
  });

  useEffect(() => {
    // Fetch status options from the backend
    const fetchStatusOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/trips/status`); // Adjust the URL as needed
        if (response.ok) {
          const data = await response.json();
          setStatusOptions(data);
          if (data.length > 0 && !trip.t_status) {
            setTrip((prevTrip) => ({
              ...prevTrip,
              t_status: data[0].s_name,
            }));
          }
        } else {
          console.error("Error fetching status options:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching status options:", error);
      }
    };

    fetchStatusOptions();
  }, [trip.t_status, baseURL]);

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
  });

  useEffect(() => {
    // Fetch status options from the backend
    const fetchOperatorOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/operators`); // Adjust the URL as needed
        if (response.ok) {
          const data = await response.json();
          setOperatorOptions(data);
        } else {
          console.error(
            "Error fetching operator options:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching operator options:", error);
      }
    };

    fetchOperatorOptions();
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
      t_operator_id: "",
      t_asset_id: "",
    });
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  // const onLoad = useCallback((map) => (mapRef.current = map), []);
  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  const [autocomplete, setAutocomplete] = useState(null);



  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      console.log(autocomplete.getPlace());
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };


  if (!isLoaded) return <div>Loading...</div>;

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }
  if (directionsResponse) {
    console.log("originRef", directionsResponse,"destiantionRef",directionsResponse.destination)
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Trip</DialogTitle>
      <DialogContent>

        <Paper className={"classes.paper"}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
             
               
                  {/* Google Map Box */}
                  <GoogleMap
                    center={center}
                    zoom={15}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={options}
                    onLoad={onLoad}
                  >
                    <Marker position={center} />
                    {directionsResponse && (
                      <DirectionsRenderer directions={directionsResponse} />
                    )}
                  </GoogleMap>




                  <Grid item xs={12} sm={6}>
                      <Autocomplete
                       onLoad={onLoad}
                       onPlaceChanged={onPlaceChanged}>
                        <TextField
                          fullWidth
                          type="text"
                          label="originRef"
                          inputRef={originRef}
                          autoComplete="off"
                        />
                      </Autocomplete>
                   </Grid>
                   <Grid item xs={12} sm={6}>
                      <Autocomplete>
                        <TextField
                          fullWidth
                          type="text"
                          label="Destination"
                          inputRef={destiantionRef}
                        />
                      </Autocomplete>
                      </Grid>
             
                      <Grid item xs={12} sm={4}>
                     
              <Button  variant="outlined" color="primary" onClick={calculateRoute}>
              Calculate Route
              </Button>
              {/* <Button  variant="contained" color="primary" onClick={clearRoute}>
              center back
              </Button> */}
            
             
</Grid>
<Grid item xs={12} sm={4}><Typography>Distance: {distance} </Typography></Grid>
<Grid item xs={12} sm={4}><Typography>Duration: {duration} </Typography></Grid>
              
                    
                    
                   
               

        
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
                          <MenuItem key={status.id} value={status.t_name}>
                            {status.t_name}
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

export default AddTripMapForm;
