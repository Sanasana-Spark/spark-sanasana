import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  DialogActions,
  Grid,
  Select,
  InputLabel,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useAuthContext } from "../onboarding/authProvider";

const libraries = ["places", "marker"];
const center = { lat: 0.00075, lng: 36.0098 };

const AddTripMapForm = ({ onSubmit, onCancel, open }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { apiFetch } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [, setAutocomplete] = useState(null);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [origin_place_id, setOriginPlaceId] = useState("");
  const [origin_place_query, setOriginPlaceQuery] = useState("");
  const [destination_place_id, setDestinationPlaceId] = useState("");
  const [destination_place_query, setDestinationPlaceQuery] = useState("");

  const [origin_lat, setOriginLat] = useState();
  const [destination_lat, setDestinationLat] = useState();
  const [origin_lng, setOriginLng] = useState();
  const [destination_lng, setDestinationLng] = useState();
  const originRef = useRef();
  const destiantionRef = useRef();

  // ⭐ ADDED: multiple stops state
  const [stops, setStops] = useState([]);
  const stopsRefs = useRef([]);

  const [trip, setTrip] = useState(
    {
      t_load: 0,
      t_status: "Pending",
      t_type: "N/A",
      t_start_date: null,
      t_end_date: null,
      t_client_id: null,
    },
    []
  );

  useEffect(() => {
    const apiUrl = `${baseURL}/operators/`;
    apiFetch(apiUrl, { method: "GET" })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setOperatorOptions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching operators:", error);
        setLoading(false);
      });
  }, [baseURL, apiFetch, open]);

  useEffect(() => {
    const apiUrl = `${baseURL}/clients/`;
    apiFetch(apiUrl, { method: "GET" })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setClientOptions(data.clients || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
        setLoading(false);
      });
  }, [baseURL, apiFetch, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip((prevTrip) => ({ ...prevTrip, [name]: value }));

    if (name === "t_operator_id") {
      const operator = operatorOptions.find((op) => op.id === value);
      if (operator && operator.o_assigned_asset) {
        setTrip((prevTrip) => ({ ...prevTrip, t_asset_id: operator.o_assigned_asset }));
      }
    }
  };

  const addStop = () => {
    setStops((prev) => [
      ...prev,
      {
        s_client_id: null,
        s_place_id: null,
        s_place_query: null,
        s_lat: null,
        s_long: null,
      },
    ]);
  };
  // Remove stop by index
  const removeStop = (index) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
    stopsRefs.current.splice(index, 1); // keep refs array in sync
  };

  // Update stop fields (like s_client_id) safely
const handleStopChange = (index, e) => {
  const { name, value } = e.target;
  setStops((prev) => {
    const updated = [...prev];
    updated[index] = { ...updated[index], [name]: value };
    return updated;
  });
};

  const handleSubmit = (e) => {
    setSaving(true);
    e.preventDefault();

    // Ensure we have structured stops
    const formattedStops = stops.map((stop, i) => ({
      ...stop,
      s_place_query: stopsRefs.current[i]?.value || stop.s_place_query || "",
    }));

    onSubmit({
      ...trip,
      stops: formattedStops,
      t_origin_place_id: origin_place_id,
      t_origin_place_query: origin_place_query,
      t_destination_place_id: destination_place_id,
      t_destination_place_query: destination_place_query,
      // t_directionsResponse: directionsResponse,
      t_distance: distance,
      t_duration: duration,
      t_start_lat: origin_lat,
      t_end_lat: destination_lat,
      t_start_long: origin_lng,
      t_end_long: destination_lng,
    });

    setTrip({ t_status: "Pending", t_operator_id: "", t_asset_id: "", t_type: "N/A" });
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const options = useMemo(
    () => ({ mapId: "9ebfa89edaafd2e", disableDefaultUI: true, clickableIcons: false }),
    []
  );

  const onLoad = (autocomplete) => setAutocomplete(autocomplete);
  const onPlaceChanged = () => {};

  if (!isLoaded) return <div>Loading...</div>;

  async function calculateRoute() {
    if (!originRef.current.value || !destiantionRef.current.value) return;

    const waypoints = stopsRefs.current
      .map((ref) => ref?.value)
      .filter(Boolean)
      .map((stop) => ({ location: stop, stopover: true }));
     // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      waypoints,
      optimizeWaypoints: false,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);

    const totalDistance = results.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0);
    const totalDuration = results.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0);
    setDistance((totalDistance / 1000).toFixed(1) + " km");
    setDuration(Math.round(totalDuration / 60) + " mins");

    setOriginPlaceId(results.geocoded_waypoints[0].place_id);
    setOriginPlaceQuery(originRef.current.value);
    setDestinationPlaceId(results.geocoded_waypoints.slice(-1)[0].place_id);
    setDestinationPlaceQuery(destiantionRef.current.value);

    const route = results.routes[0];
    const firstLeg = route.legs[0];
    setOriginLat(firstLeg.start_location.lat());
    setOriginLng(firstLeg.start_location.lng());
    const lastLeg = route.legs[route.legs.length - 1];
    setDestinationLat(lastLeg.end_location.lat());
    setDestinationLng(lastLeg.end_location.lng());


    // Process stops
    setStops((prevStops) => {
        const updatedStops = prevStops.map((stop, i) => {
          const leg = results.routes[0].legs[i];
          return {
            ...stop,
            s_place_query: stopsRefs.current[i]?.value || "",
            s_lat: leg?.end_location?.lat() || null,
            s_long: leg?.end_location?.lng() || null,
            s_place_id: results.geocoded_waypoints[i + 1]?.place_id || null,
          };
        });
        return updatedStops;
      });


  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
    setStops([{ place: "" }]);
  }



  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <Grid item xs={12} sm={6}>
          <Typography sx={{ marginTop: "16px" }}>Distance: {distance}  Duration: {duration}</Typography>
        </Grid>

      <Grid item xs={12} sm={6} sx={{ height: isMobile ? "300px" : "30vh", marginBottom: isMobile ? 2 : 0 }}>
          <GoogleMap center={center} zoom={15} mapContainerStyle={{ width: "inherit", height: "inherit" }} options={options}>
            <Marker position={center} />
            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
          </GoogleMap>
      </Grid>

      
        

        <Grid item xs={12} md={6}>
          
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <TextField fullWidth label="Origin" inputRef={originRef} margin="normal" />
          </Autocomplete>

          {/* ⭐ Dynamic Stops */}
         {stops.map((stop, index) => (
            <Grid container spacing={1} key={index} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Autocomplete>
                  <TextField
                    fullWidth
                    label={`Stop ${index + 1}`}
                    inputRef={(el) => (stopsRefs.current[index] = el)}
                    defaultValue={stop.place}
                    margin="normal"
                  />
                </Autocomplete>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Client"
                  labelId={`stop-client-label-${index}`}
                  name="s_client_id"
                  value={stop.s_client_id || ""}
                  onChange={(e) => handleStopChange(index, e)}
                >
                  {clientOptions.length > 0 ? (
                    clientOptions.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.c_name} - {client.c_status}
                      </MenuItem>
                    ))
                  ) : (
                    loading && <MenuItem disabled>Loading clients...</MenuItem>
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Button
                  onClick={() => removeStop(index)}
                  color="error"
                  size="small"
                  variant="outlined"
                  sx={{ marginTop: "8px" }}
                >
                  Remove
                </Button>
              </Grid>


            </Grid>
          ))}

          <Button variant="outlined" onClick={addStop} sx={{ marginTop: 1, marginBottom: 2 }}>
            + Add Stop
          </Button>

          <Autocomplete>
            <TextField fullWidth label="Destination" inputRef={destiantionRef} margin="normal" />
          </Autocomplete>

          <Button
            variant="outlined"
            color="primary"
            onClick={calculateRoute}
            sx={{ marginTop: "16px", marginRight: "8px", backgroundColor: "var(--secondary-color)", color: "white" }}
          >
            Calculate Route
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={clearRoute}
            sx={{ marginTop: "16px", backgroundColor: "var(--primary-color)", color: "white" }}
          >
            Clear Route
          </Button>

          
        </Grid>

        <Divider sx={{ margin: "16px 0", backgroundColor: "var(--secondary-color)" }} />

       <Grid container spacing={3}>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Load(Tonnes)" name="t_load" type="number" value={trip.t_load} onChange={handleChange} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="LPO/Description" name="t_type" type="text" value={trip.t_type} onChange={handleChange} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Start Date" name="t_start_date" type="date" InputLabelProps={{ shrink: true }} value={trip.t_start_date} onChange={handleChange} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="End Date" name="t_end_date" type="date" InputLabelProps={{ shrink: true }} value={trip.t_end_date} onChange={handleChange} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputLabel id="operator-label">Assign Driver</InputLabel>
          <Select fullWidth labelId="operator-label" name="t_operator_id" value={trip.t_operator_id} onChange={handleChange}>
            {operatorOptions.length > 0 ? (
              operatorOptions.map((operator) => (
                <MenuItem key={operator.id} value={operator.id}>
                  {operator.o_name} - {operator.a_license_plate} - {operator.o_status}
                </MenuItem>
              ))
            ) : (
              loading && <MenuItem disabled>Loading operators...</MenuItem>
            )}
          </Select>
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputLabel id="asset-label">Assign Client</InputLabel>
          <Select fullWidth labelId="client-label" name="t_client_id" value={trip.t_client_id} onChange={handleChange}>
            {clientOptions.length > 0 ? (
              clientOptions.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.c_name} - {client.c_status}
                </MenuItem>
              ))
            ) : (
              loading && <MenuItem disabled>Loading clients...</MenuItem>
            )}
          </Select>
        </Grid>

      </Grid>

      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          sx={{ backgroundColor: "var(--secondary-color)", color: "white" }}
        >
          {saving ? "Submitting..." : "Submit"}
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "var(--primary-color)", color: "white" }} onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </form>
  );

  return (
    <>
      {isMobile ? (
        <Modal open={open} onClose={onCancel} sx={{ zIndex: 1300 }}>
          <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100vw", height: "95vh", bgcolor: "background.paper", borderTopLeftRadius: 16, borderTopRightRadius: 16, p: 2, overflowY: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 10, pb: 1 }}>
              <Typography variant="h6">Add Trip</Typography>
              <IconButton onClick={onCancel}><CloseIcon /></IconButton>
            </Box>
            {renderForm()}
          </Box>
        </Modal>
      ) : (
        <Modal open={open} onClose={onCancel} sx={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100}}>
          <Box sx={{position: "relative", width: "90%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto", bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 10, pb: 1 }}>
              <Typography variant="h6">Add Trip</Typography>
              <IconButton onClick={onCancel}><CloseIcon /></IconButton>
            </Box>
            {renderForm()}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default AddTripMapForm;
