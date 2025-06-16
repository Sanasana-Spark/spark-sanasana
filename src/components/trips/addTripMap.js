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
  const { user_id } = useAuthContext();
  const { org_id } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [, setAutocomplete] = useState(null);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [origin_place_id,setOriginPlaceId] = useState("")
  const [origin_place_query,setOriginPlaceQuery] = useState("")
  const [destination_place_id,setDestinationPlaceId] = useState("")
  const [destination_place_query,setDestinationPlaceQuery] = useState("")

  const [origin_lat,setOriginLat] = useState()
  const [destination_lat,setDestinationLat] = useState()
  const [origin_lng,setOriginLng] = useState()
  const [destination_lng,setDestinationLng] = useState()
  const originRef = useRef();
  const destiantionRef = useRef();
  const [trip, setTrip] = useState({
    t_load: 0,
    t_status: "Pending",
    t_type: "N/A",
    t_start_date: null,
    t_end_date: null,
    t_client_id: null,
  },[]);

  useEffect(() => {
    if (org_id && user_id) {
    const apiUrl = `${baseURL}/operators/${org_id}/${user_id}`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setOperatorOptions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }}, [ baseURL, org_id, user_id, open]);

  useEffect(() => {
    if (org_id && user_id) {
    const apiUrl = `${baseURL}/clients/${org_id}/${user_id}`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setClientOptions(data.clients || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }}, [ baseURL, org_id, user_id, open]);



  const handleChange = (e) => {
    const { name, value } = e.target;

    setTrip((prevTrip) => ({
      ...prevTrip,
      [name]: value,
    }));

    if (name === "t_operator_id") {
      const operator = operatorOptions.find((op) => op.id === value);
      // setSelectedOperator(operator);
      if (operator && operator.o_assigned_asset) {
        setTrip((prevTrip) => ({
          ...prevTrip,
          t_asset_id: operator.o_assigned_asset,
        }));
      }
    }


  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTrip((prevTrip) => ({
      ...prevTrip,
      t_origin_place_id:origin_place_id,
      t_origin_place_query:origin_place_query,
      t_destination_place_id:destination_place_id,
      t_destination_place_query:destination_place_query,
      t_directionsResponse:directionsResponse,
      t_distance:distance,
      t_duration:duration,
      t_start_lat:origin_lat,
      t_end_lat:destination_lat,
      t_start_long:origin_lng,
      t_end_long:destination_lng,
      t_type:trip.t_type,
      t_client_id:trip.t_client_id

    }));
console.log(directionsResponse)
  onSubmit({
    ...trip, // this includes previous trip values
    t_origin_place_id:origin_place_id,
    t_origin_place_query:origin_place_query,
    t_destination_place_id:destination_place_id,
    t_destination_place_query:destination_place_query,
    t_directionsResponse:directionsResponse,
    t_distance:distance,
    t_duration:duration,
    t_start_lat:origin_lat,
    t_end_lat:destination_lat,
    t_start_long:origin_lng,
    t_end_long:destination_lng,
    t_type:trip.t_type,
    t_client_id:trip.t_client_id
  });
    // Optionally, you can reset the form after submission
    setTrip({
      t_status: "Pending",
      t_operator_id: "",
      t_asset_id: "",
      t_type: "N/A",
    });
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  
  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );





  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };
  const onPlaceChanged = () => {};


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
    console.log('ref is ', originRef)

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    setOriginPlaceId(results.geocoded_waypoints[0].place_id);
    setOriginPlaceQuery(originRef.current.value);
    setDestinationPlaceId(results.geocoded_waypoints[1].place_id);
    setDestinationPlaceQuery(destiantionRef.current.value);

    const route = results.routes[0];
    const leg = route.legs[0];
    setOriginLat(leg.start_location.lat());
    setOriginLng(leg.start_location.lng());
    setDestinationLat(leg.end_location.lat());
    setDestinationLng(leg.end_location.lng());
  }


  function clearRoute() {
    // setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }


  if (directionsResponse) {
    console.log(
     "origin", origin_place_id,origin_place_query,
     "Dest", destination_place_id,destination_place_query,
     "distance", distance,
     "time", duration,
     "cordi", origin_lat, destination_lat, origin_lng, destination_lng,
     "directionsResponse",directionsResponse
    );
  }




  const renderForm = () => (
    <form onSubmit={handleSubmit}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <TextField
            fullWidth
            type="text"
            label="Origin"
            inputRef={originRef}
            autoComplete="on"
            margin="normal"
          />
        </Autocomplete>
        <Autocomplete>
          <TextField
            fullWidth
            type="text"
            label="Destination"
            inputRef={destiantionRef}
            autoComplete="off"
            margin="normal"
          />
        </Autocomplete>
        <Button
          variant="outlined"
          color="primary"
          onClick={calculateRoute}
          sx={{ marginTop: '16px', marginRight: '8px',
            backgroundColor: "var(--secondary-color)",
            "&:hover": {
              backgroundColor: "var(--secondary-hover-color)",
            },
            color: "white",
           }}
        >
          Calculate Route
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={clearRoute}
          sx={{
             marginTop: '16px',
            backgroundColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "var(--primary-hover-color)",
            },
            color: "white",
           }}
          
        >
          Clear Route
        </Button>
        <Typography style={{ marginTop: '16px' }}>Distance: {distance} </Typography>
        <Typography>Duration: {duration} </Typography>
      </Grid>


      <Grid item xs={12} sm={6}>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "400px", height: "300px" }}
          options={options}
          onLoad={onLoad}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        </Grid>



      <Divider></Divider>

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
          label="LPO/Description"
          name="t_type"
          type="text"
          value={trip.t_type}
          onChange={handleChange}
        />
      </Grid>


      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Start Date"
          name="t_start_date"
          type="date"
          value={trip.t_start_date}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="End Date"
          name="t_end_date"
          type="date"
          value={trip.t_end_date}
          onChange={handleChange}
        />
      </Grid>


      <Grid item xs={12} sm={6} style={{ display: 'none' }}>
        <TextField
          fullWidth
          hidden 
          type="text"
          label="Distance"
          name="t_distance"
          value={distance}
          onChange={handleChange} 
        />
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
        {operatorOptions && operatorOptions.length > 0 ? (
          operatorOptions.map((operator) => (
            <MenuItem key={operator.id} value={operator.id}>
              {operator.o_name} - {operator.a_license_plate} -{operator.o_status}
            </MenuItem>
          ))
        ) : ( loading &&
          <MenuItem disabled>
            Loading operators...
          </MenuItem>
        )}
        </Select>
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel id="asset-label">Assign client</InputLabel>
        <Select
          fullWidth
          labelId="cliient-label"
          label="Client"
          name="t_client_id"
          value={trip.t_client_id}
          onChange={handleChange}
        >
          {clientOptions && clientOptions.length > 0 ? (
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
      <Button type="submit" variant="contained"
      sx={{

        backgroundColor: "var(--secondary-color)",
        "&:hover": {
          backgroundColor: "var(--secondary-hover-color)",
        },
        color: "white",
      }
      } >
        Submit
      </Button>
      <Button variant="contained"
      sx={{

        backgroundColor: "var(--primary-color)",
        "&:hover": {
          backgroundColor: "var(--primary-hover-color)",
        },
        color: "white",
      }
      } 
      
      onClick={onCancel}>
        Cancel
      </Button>
    </DialogActions>
 
  </form>
  );


  return (
    <>
    {isMobile ? (
  // 🔹 MOBILE MODAL
  <Modal open={open} onClose={onCancel} sx={{ zIndex: 1300 }}>
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100vw",
        height: "95vh",
        bgcolor: "background.paper",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        p: 2,
        overflowY: "auto",
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
        <Typography variant="h6">Add Trip</Typography>
        <IconButton onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </Box>

      {renderForm()}
    </Box>
  </Modal>
) : (
  // 🔹 DESKTOP MODAL
  <Modal open={open} onClose={onCancel} sx={{ zIndex: 100 }}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 700,
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
        <Typography variant="h6">Add Trip</Typography>
        <IconButton onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </Box>

      {renderForm()}
    </Box>
  </Modal>
)}

    </>
    
  );
};
export default AddTripMapForm;
