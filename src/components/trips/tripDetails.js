/* eslint-disable react/prop-types */
import React, { useState, useEffect} from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import Loader from "../loader";
import Map from "../maps/singleTripMap";



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
        const endLat = parseFloat(asset.t_end_lat);
        const endLong = parseFloat(asset.t_end_long);

        const start = { lat: startLat, lng: startLong };
        const end = { lat: endLat, lng: endLong };

        console.log("center Coordinates:", start);

        return (
          <div key={asset.id}>
           <Map
           startpoint= {start}
            endpoint={end}
            key={asset.id}
           />

            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>start coordinates: {JSON.stringify(start)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>end: {JSON.stringify(end)}</Typography>
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
  );
};

export default PropCard;
