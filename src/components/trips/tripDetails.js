/* eslint-disable react/prop-types */
import { React, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Loader from '../loader';
import {APIProvider} from '@vis.gl/react-google-maps';
import Reorder from "@mui/icons-material/Reorder";

const mapContainerStyle = {
  height: '400px',
  width: '100%'
};

const PropCard = ({ selectedAsset }) => {
  const REACT_APP_GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedAsset) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [selectedAsset]);

  const defaultCenter = { lat: 5.6037, lng: -0.1870 };


  const infoWindowStyle = {
    padding: '10px',
    fontSize: '14px',
    color: 'red'
  };

  return (
    <>
      {!loading && (

<APIProvider apiKey={REACT_APP_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>


        <div>
          {selectedAsset.map((asset) => {
            const startLat = parseFloat(asset.t_start_lat) || defaultCenter.lat;
            const startLong = parseFloat(asset.t_start_long) || defaultCenter.lng;
            const endLat = parseFloat(asset.t_end_lat) || defaultCenter.lat;
            const endLong = parseFloat(asset.t_end_long) || defaultCenter.lng;
            // const startLat = asset.t_start_lat;
            // const startLong = asset.t_start_long;
            // const endLat = asset.t_end_lat;
            // const endLong = asset.t_end_long;
            const isValidLatLng = (latLng) => {
              return isFinite(latLng.lat) && isFinite(latLng.lng) && -90 <= latLng.lat && latLng.lat <= 90 && -180 <= latLng.lng && latLng.lng <= 180;
            };
            const center = isValidLatLng({ lat: startLat, lng: startLong })
        ? { lat: startLat, lng: startLong }
        : defaultCenter;

          // Utility function to check for valid latitude and longitude values



            console.log('center Coordinates:', center);

            const pathCoordinates = [
              { lat: startLat, lng: startLong },
              { lat: endLat, lng: endLong }
            ];

            return (
              <div key={asset.id}>



<LoadScript googleMapsApiKey={REACT_APP_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                      center={{ lat: startLat, lng: startLong }}
                    zoom={13}
                  >
                    <Marker position={{ lat: startLat, lng: startLong }} icon={Reorder}>
                      <InfoWindow position={{ lat: startLat, lng: startLong }}>
                        <div style={infoWindowStyle}>Start: {asset.a_license_plate}</div>
                      </InfoWindow>
                    </Marker>
                    <Marker position={{ lat: endLat, lng: endLong }} icon={Reorder}>
                      <InfoWindow position={{ lat: endLat, lng: endLong }}>
                        <div style={infoWindowStyle}>End: {asset.a_license_plate}</div>
                      </InfoWindow>
                    </Marker>
                    <Polyline path={pathCoordinates} options={{ strokeColor: 'blue', strokeOpacity: 1.0, strokeWeight: 2 }} />
                  </GoogleMap>
                </LoadScript>

                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography>startLat: {startLat}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>startLong: {startLong}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>endLat: {endLat}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>endLong: {endLong}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Status: {asset.a_status}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Make & Model: {asset.a_make}:{asset.a_model}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Engine: {asset.a_engine_size}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Value: {asset.a_value}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Acc Dep: {asset.a_accumulated_dep}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        </APIProvider>
      )}

      {loading && <Loader />}
    </>
  );
};

export default PropCard;
