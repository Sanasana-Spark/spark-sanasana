/* eslint-disable react/prop-types */
import React, { useState, useEffect} from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import Loader from "../loader";
import Map from "../maps/singleTripMarkedMap";
//  import Map1 from "../maps/newmap";



const PropCard = ({ selectedAsset }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedAsset) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [selectedAsset]);



  if (loading) {
    return <Loader />;
  }


  return (
    <div>
      {selectedAsset.map((asset) => {
        const startLat = parseFloat(asset.t_start_lat);
        const startLong = parseFloat(asset.t_start_long);
        // const endLat = parseFloat(asset.t_end_lat);
        // const endLong = parseFloat(asset.t_end_long);

        const start = { lat: startLat, lng: startLong };
        // const end = { lat: endLat, lng: endLong };
        const origin = asset.t_origin_place_query
        const destination = asset.t_destination_place_query
        console.log("origin",origin, "destination", destination )

        // const center = { lat:(startLat+endLat), lng:(startLong + endLong) };


        return (
          <Box
            key={asset.id}
            sx={{
              backgroundColor: "#F9FAFB", // Light gray background
              boxShadow: 2, // Adds a slight shadow
              borderRadius: 2, // Rounded corners
              padding: 2, // Adds spacing inside
              marginBottom: 2, // Adds spacing between sections
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {asset.a_license_plate} ({asset.a_make} - {asset.a_model})
            </Typography>

            <Box sx={{ marginBottom: 2 }}>
              <Map
                origin={origin}
                destination={destination}
                key={asset.id}
                center={start}
                tripid={asset.id}
              />
            </Box>

            <Card>
              <CardContent>
                <Grid container spacing={2}>
                

                 

                  <Grid item xs={12} sm={6}>
                    <Typography>start: {asset.t_origin_place_query}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography>
                      end: {asset.t_destination_place_query}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography>Status: {asset.t_status}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>Driver: {asset.o_name}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography>Distance: {asset.t_distance}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>Tonnage: {asset.t_load}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      Fuel: {asset.t_actual_fuel}(Ltrs)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      Fuel:Ksh{asset.t_actual_cost}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography>Desc: {asset.t_type}</Typography>
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
