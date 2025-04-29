/* eslint-disable react/prop-types */
import React, { useState, useEffect} from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import Loader from "../loader";
import Map from "../maps/singleTripMap";
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
          <div key={asset.id}>
{/* 
           <Map
           origin= {asset.t_origin_place_query}
           destination={asset.t_destination_place_query}
            key={asset.id}
            center = {start}
           /> */}

<Map
           origin= {origin}
           destination={destination}
            key={asset.id}
            center = {start}
           />

{/* <Map1
           origin= {start}
           destination={end}
           key={asset.id}
           center = {start}
           />  */}




            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  {/* <Grid item xs={12}>
                    <Typography>start coordinates: {JSON.stringify(start)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>end: {JSON.stringify(end)}</Typography>
                  </Grid> */}
                  <Grid item xs={12}>
                    <Typography> {asset.a_license_plate} ({asset.a_make}-{asset.a_model}) </Typography>
                  </Grid>
   
   <Grid item xs={12 } sm={6}>
                    <Typography>LPO: CL-{asset.id}</Typography>
                    
                  </Grid>

                  <Grid item xs={12} sm={6} >
                    <Typography>start: {asset.t_origin_place_query}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} >
                    <Typography>end: {asset.t_destination_place_query}</Typography>
                  </Grid>
                   
                  <Grid item xs={12} sm={6} >
                    <Typography>Status: {asset.t_status}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} >
                    <Typography>Driver: {asset.o_name}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} >
                    <Typography>Distance: {asset.t_distance}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} >
                    <Typography>Tonnage: {asset.t_load}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} >
                    <Typography>Fuel: {asset.t_actual_fuel}(Ltrs):Ksh{asset.t_actual_cost}</Typography>
                  </Grid>
               
                </Grid>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default PropCard;
