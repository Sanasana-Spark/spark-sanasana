import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import New from "../components/trips/trips_main";
import Requested from "../components/trips/trips_cashflow";
import History from "../components/trips/trips_history";

const Trips = () => {
  const [activeTab, setActiveTab] = useState("New");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Trips</Typography>

      {/* Tabs Container */}
      <Paper sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="New/In-Progress" value="New" />
          <Tab label="Income/Expenses" value="Fuel_Requests" />
          <Tab label="History" value="History" />
        </Tabs>

        {/* Content Display */}
        <Box sx={{ p: 3, minHeight: "70vh" }}>
          {activeTab === "New" && <New />}
          {activeTab === "Fuel_Requests" && <Requested />}
          {activeTab === "History" && <History/> }
        </Box>
      </Paper>
    </Box>
  );
};

export default Trips;
