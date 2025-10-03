/* eslint-disable react/prop-types */
import React, { useState} from "react";
import { Grid, Card, CardContent, Typography, Box, Chip } from "@mui/material";
import Loader from "../loader";
import Map from "../maps/singleTripMarkedMap";

const PropCard = ({ selectedTrip }) => {
  const [loading, setLoading] = useState(true);

  if (selectedTrip) {
    setLoading(false);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {selectedTrip.map((trip) => {
        const startLat = parseFloat(trip.t_start_lat);
        const startLong = parseFloat(trip.t_start_long);

        const start = { lat: startLat, lng: startLong };
        const origin = trip.t_origin_place_query;
        const destination = trip.t_destination_place_query;
        const stops = trip.stops || [];

        console.log("origin", origin, "destination", destination, "stops", stops);

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
                stops={stops}
                key={trip.id}
                center={start}
                tripid={trip.id}
              />
            </Box>

            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>Start: {trip.t_origin_place_query}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography>
                      End: {trip.t_destination_place_query}
                    </Typography>
                  </Grid>

                  {/* Display stops if any */}
                  {stops.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Stops ({stops.length}):
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {stops.map((stop, index) => (
                          <Chip
                            key={index}
                            label={`${index + 1}. ${stop.s_place_query || 'Unknown Location'}`}
                            variant="outlined"
                            size="small"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}

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
                      Fuel: Ksh{trip.t_actual_cost}
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