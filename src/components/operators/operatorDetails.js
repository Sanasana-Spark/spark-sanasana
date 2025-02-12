/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { Grid, Box, Container, Typography } from '@mui/material';
import Loader from '../loader';
import Map from "../maps/singleTripMap";

const PropCard = ({ selectedOperator }) => {

  const startLat = 5.6037;
  const startLong = -0.187;
  const endLat = 5.9037;
  const endLong = -0.117;

  const start = { lat: startLat, lng: startLong };
  const end = { lat: endLat, lng: endLong };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (selectedOperator) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [selectedOperator]);
  

  return (
    <Container>
  
        {!loading && (
          
              <Box>
                 {selectedOperator.map((Operator) => ( <>

                  <Box>
                <Grid item xs={12} sm={12} sx={{ padding: 2, textAlign: "center" }}>
                 
                   
                    Most Recent Trip
                </Grid>
              </Box>

              <Box sx={{ maxHeight: '20vh', overflow: "hidden" }} >
                <Map
                  origin={start}
                  destination={end}
                  key={Operator.id}
                  center={start}
                  style={{ width: "100%", height: "100%" }}
                />
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
        Mileage covered vs fuel requested in last:
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
            {Operator?.daily_mileage ?? "N/A"} KM - {Operator?.daily_cost ?? "N/A Ksh"}
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
            {Operator?.weekly_mileage ?? "N/A"} KM - {Operator?.weekly_cost ?? "N/A Ksh"}
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
            {Operator?.monthly_mileage ?? "N/A"} KM - {Operator?.monthly_cost ?? "N/A Ksh"}
          </Typography>
        </Box>
      </Box>
    </Box>

              </>

))}
            </Box>
           
        )}
        
        { loading && ( <Loader/>
        )}
     
    </ Container>
  );
};

export default PropCard;
