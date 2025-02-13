/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  Grid,
  Typography,
  Box,
  Container,
} from "@mui/material";
import Loader from "../loader";
import Map from "../maps/singleTripMap";

const PropCard = ({ selectedAsset }) => {
  // const startLat = parseFloat(asset.t_start_lat) || 5.6037;
  // const startLong = parseFloat(asset.t_start_long) || -0.1870;
  // const endLat = parseFloat(asset.t_end_lat) || 5.6037;
  // const endLong = parseFloat(asset.t_end_long) || -0.1870;
  const startLat = 5.6037;
  const startLong = -0.187;
  const endLat = 5.9037;
  const endLong = -0.117;

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
    <Container sx={{ maxHeight: 'inherit' }}>
      {!loading && (
        <Box>
          {selectedAsset.map((asset) => (
            <>
              <Box>
                <Grid item xs={12} sm={12} sx={{ padding: 2, textAlign: "center" }}>
                 
                   
                    Most Recent Trip
                </Grid>
              </Box>
              <Box sx={{ maxHeight: '20vh', overflow: "hidden" }} >
                <Map
                  origin={start}
                  destination={end}
                  key={asset.id}
                  center={start}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>

              <Box>
                <Grid container spacing={2} paddingBottom={3} paddingTop={3} >
                  <Grid item xs={12} sm={4}  >
                  
                      {asset.a_license_plate}{" "}
                   
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    
                      set current Driver
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    
                      {asset.a_status}
                    
                  </Grid>
                </Grid>
              </Box>

              <Box
      sx={{
        p: 3,
        borderRadius: 2,
        width: "320px",
       
        backgroundColor: "inherit",
      }}
    >
      <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
        Mileage covered vs fuel expense in last:
      </Typography>

      {/* Styled Vertical List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Daily Mileage */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            borderRadius: 1,
            // backgroundColor: "white",
            // boxShadow: 1,
            // border: "1px solid #ddd",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#555" }}>
            24 Hours:
          </Typography>
          <Typography variant="body1" sx={{ color: "#1976D2", fontWeight: "bold" }}>
            {asset?.daily_mileage ?? "N/A"} KM - {asset?.daily_cost ?? "N/A Ksh"}
          </Typography>
        </Box>

        {/* Weekly Mileage */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#555" }}>
            Week:
          </Typography>
          <Typography variant="body1" sx={{ color: "#1976D2", fontWeight: "bold" }}>
            {asset?.weekly_mileage ?? "N/A"} KM - {asset?.weekly_cost ?? "N/A Ksh"}
          </Typography>
        </Box>

        {/* Monthly Mileage */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#555" }}>
            Month:
          </Typography>
          <Typography variant="body1" sx={{ color: "#1976D2", fontWeight: "bold" }}>
            {asset?.monthly_mileage ?? "N/A"} KM - {asset?.monthly_cost ?? "N/A Ksh"}
          </Typography>
        </Box>
      </Box>
    </Box>


  


            </>
          ))}
        </Box>
      )}

      {loading && <Loader />}
    </Container>
  );
};

export default PropCard;
