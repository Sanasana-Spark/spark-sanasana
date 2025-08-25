/* eslint-disable react/prop-types */
import React, { useState, useEffect} from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import Loader from "../loader";
import Map from "../maps/singleTripMarkedMap";
//  import Map1 from "../maps/newmap";



const PropCard = ({ selectedTrip }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedTrip) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [selectedTrip]);



  if (loading) {
    return <Loader />;
  }


  return (
    <div>
      {selectedTrip.map((trip) => {
        const startLat = parseFloat(trip.t_start_lat);
        const startLong = parseFloat(trip.t_start_long);
        // const endLat = parseFloat(trip.t_end_lat);
        // const endLong = parseFloat(trip.t_end_long);

        const start = { lat: startLat, lng: startLong };
        // const end = { lat: endLat, lng: endLong };
        const origin = trip.t_origin_place_query
        const destination = trip.t_destination_place_query
        console.log("origin",origin, "destination", destination )

        // const center = { lat:(startLat+endLat), lng:(startLong + endLong) };


        return (
          <Box
            key={trip.id}
            sx={{
              backgroundColor: "#F9FAFB", // Light gray background
              boxShadow: 2, // Adds a slight shadow
              borderRadius: 2, // Rounded corners
              padding: 2, // Adds spacing inside
              marginBottom: 2, // Adds spacing between sections
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {trip.a_license_plate} ({trip.a_make} - {trip.a_model})
            </Typography>

            <Box sx={{ marginBottom: 2 }}>
              <Map
                origin={origin}
                destination={destination}
                key={trip.id}
                center={start}
                tripid={trip.id}
              />
            </Box>

            <Card>
              <CardContent>
                <Grid container spacing={2}>
                

                 

                  <Grid item xs={12} sm={6}>
                    <Typography>start: {trip.t_origin_place_query}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography>
                      end: {trip.t_destination_place_query}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography>Status: {trip.t_status}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>Driver: {trip.o_name}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography>Distance: {trip.t_distance}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>Tonnage: {trip.t_load}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      Fuel: {trip.t_actual_fuel}(Ltrs)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      Fuel:Ksh{trip.t_actual_cost}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography>Desc: {trip.t_type}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </div>
  );
};

export default PropCard;
