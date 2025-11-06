import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import New from "../components/trips/trips_main";
import Requested from "../components/trips/trips_cashflow";
import History from "../components/trips/trips_history";
import Summary from "../components/trips/trips_summary";

const Trips = () => {
  const [activeTab, setActiveTab] = useState("Summary");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ 
      // p: isMobile ? 1 : 3,
      margin : isMobile ? 0 : 0,
      padding: isMobile ? 0 : 2,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minWidth: 0,  
      height: "100%",
      overflow: "scroll",
      boxShadow: isMobile ? 1 : 3, }}>
    

<Typography
        variant={isMobile ? "subtitle1" : "h6"}
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        Trips
      </Typography>


        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor= "primary"
          indicatorColor= "primary"
          sx={{
            ".MuiTab-root": {
              fontSize: isMobile ? "0.75rem" : "1rem",
              minWidth: 100,
              
           
            "&.Mui-selected": {
              color: "var(--secondary-color)", // selected tab text color
              fontWeight: "bold",
            },
            "&:hover": {
              color: "var(--primary-color)", // hover tab text color
            },
          },
            ".MuiTabs-indicator": {
              backgroundColor: "var(--secondary-color)", // underline indicator color
            },
            // color: "var(--secondary-color)",
          }}
        >
          <Tab label="Summary" value="Summary" />
          <Tab label="New/In-Progress" value="New" />
          <Tab label="Income/Expenses" value="Fuel_Requests" />
          <Tab label="History" value="History" />
        </Tabs>

          {activeTab === "Summary" && <Summary onNavigateTab={setActiveTab} />}

          {activeTab === "New" && <New />}
          {activeTab === "Fuel_Requests" && <Requested />}
          {activeTab === "History" && <History />}
          
    </Box>
  );
};

export default Trips;
