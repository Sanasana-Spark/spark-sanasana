/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Loader from '../loader';
import Map from "../maps/singleTripMap";

const PropCard = ({ selectedAsset }) => {
// const startLat = parseFloat(asset.t_start_lat) || 5.6037; 
// const startLong = parseFloat(asset.t_start_long) || -0.1870;
// const endLat = parseFloat(asset.t_end_lat) || 5.6037; 
// const endLong = parseFloat(asset.t_end_long) || -0.1870;
const startLat =  5.6037; 
const startLong =  -0.1870;
const endLat =  5.9037; 
const endLong = -0.1170;

const start = { lat: startLat, lng: startLong };
const end = { lat: endLat, lng: endLong };

// const pathCoordinates = [
//   [startLat, startLong],
//   [endLat, endLong]
// ];

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (selectedAsset) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [selectedAsset]);
  

  return (
    <>
  
        {!loading && (
          
              <div>
                 {selectedAsset.map((asset) => ( <>


              <Map
           startpoint= {start}
            endpoint={end}
            key={asset.id}
           />
             
        
              <Card variant="outlined" style={{ marginTop: '20px' }}>
             
              <CardContent>
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Typography >Asset Type:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{asset.a_type}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography>License Plate:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{asset.a_license_plate}</Typography>
    </Grid>


    <Grid item xs={6}>
      <Typography>Efficiency Rate:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{asset.a_efficiency_rate}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography>Make & Model:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{asset.a_make}:{asset.a_model}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography>Engine:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{asset.a_engine_size}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography>Value:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{asset.a_value}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography>Acc Dep:</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{asset.a_accumulated_dep}</Typography>
    </Grid>
  </Grid>
</CardContent>
                
              </Card></>

))}
            </div>
           
        )}
        
        { loading && ( <Loader/>
        )}
     
    </>
  );
};

export default PropCard;
