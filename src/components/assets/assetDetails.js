/* eslint-disable react/prop-types */
import { React, useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Loader from '../loader'

const PropCard = ({ selectedAsset }) => {
  // Fix for marker icons not showing up in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
});
// const startLat = parseFloat(asset.t_start_lat) || 5.6037; 
// const startLong = parseFloat(asset.t_start_long) || -0.1870;
// const endLat = parseFloat(asset.t_end_lat) || 5.6037; 
// const endLong = parseFloat(asset.t_end_long) || -0.1870;
const startLat =  5.6037; 
const startLong =  -0.1870;
const endLat =  5.9037; 
const endLong = -0.1170;

const pathCoordinates = [
  [startLat, startLong],
  [endLat, endLong]
];

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
                  
              <MapContainer center={[5.6037, -0.1870]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
               <Marker position={[startLat, startLong]}>
          <Popup>Start: {asset.a_license_plate}</Popup>
        </Marker>
        <Marker position={[endLat, endLong]}>
          <Popup>End: {asset.a_license_plate}</Popup>
        </Marker>
        <Polyline positions={pathCoordinates} color="blue" />
              </MapContainer>
             
        
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
