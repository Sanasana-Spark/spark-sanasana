import React, { useEffect, useState } from "react";
import {Container, Box, IconButton,TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import UpcomingMaintenanceTable from "./upcomingTable";
import AddAssetForm from "./schedulemaintenance";
import { useAuthContext } from '../onboarding/authProvider';
import AddIcon from "@mui/icons-material/Add";
import { Search } from "@mui/icons-material";

const Upcoming = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const baseURL = process.env.REACT_APP_BASE_URL
  const { user_id, org_id } = useAuthContext();
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [, setLoading] = useState(true);
  const [showAddMaintenanceForm, setShowAddMaintenanceForm] = useState(false);

  const icons = [
    <IconButton key="icon1">.</IconButton>,
    <IconButton key="icon2">.</IconButton>,
    <IconButton key="icon3">.</IconButton>,
  ];

  useEffect(() => {
    if (org_id && user_id) {
    fetch(`${baseURL}/maintenances/${org_id}/${user_id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUpcomingMaintenance(data.maintenance_list || []); // Ensure we set an empty array if maintenance_list is undefined
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }},[baseURL,org_id, user_id, showAddMaintenanceForm] ); // Empty dependency array ensures this effect runs only once when the component mounts

  const handleSubmit = (maintenance) => {
    // Define the URL for the POST request
    const url = `${baseURL}/maintenances/${org_id}/${user_id}/`;
    const data = {
      m_asset_id: maintenance.m_asset_id,
      m_description: maintenance.m_description,
      m_status: maintenance.m_status,
      m_date: maintenance.m_date,
      m_expected_cost: maintenance.m_total_cost,
      m_insurance_coverage: maintenance.m_insurance_coverage,
      m_total_cost: maintenance.m_total_cost,
      m_estimated_cost: maintenance.m_estimated_cost,
      m_type: maintenance.m_type,
      m_attachment: maintenance.m_attachment, // Assuming this is a base64 string
    };


    console.log("Payload Data:", data); // Log the payload

    const options = {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Specify the content type of the request body
      },
      body: JSON.stringify(data), // Convert data to JSON string for the request body
    };
    console.log(data)
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to schedule maintenance");
        }
        console.log("maintenance scheduled successfully");
        setShowAddMaintenanceForm(false);
      })
      .catch((error) => {
        console.error("Error scheduling maintenance:", error);
      });
  };

  const handleViewDetailsClick = (rowIndex) => {

  };

  const handleCancel = () => {
    setShowAddMaintenanceForm(false);
  };

  const handleAddPropertyClick = () => {
    setShowAddMaintenanceForm(true);
  };


  return (
    <Box
      sx={{
        margin: isMobile ? 0 : 0,
        padding: isMobile ? 0 : 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
        height: "100%",
        overflow: "scroll",
        boxShadow: isMobile ? 1 : 3,
      }}
    >
      <Container maxWidth="xl" disableGutters sx={{ 
height: "100%",
width: "100%",
display: "flex",
flexDirection: "column",
overflow: "scroll",
flex: 1,
 }}>



      <Box
        sx={{

          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          paddingBottom: { xs: 1, sm: 2 },
          gap: 2

        }}
      >
      
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        gap: 1,
        width: "100%"

      }}>
        {/* Search Box */}
       
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              border: "1px solid var(--primary-color) ",
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#047A9A",
            padding: "8px",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
          }}
        >
          <Search sx={{ color: "white" }} />
        </Box>
        {/* Icons */}
        <Box>
          {icons.map((icon, index) => (
            <IconButton key={index}>{icon}</IconButton>
          ))}
        </Box>
        </Box>
       
        
       {/* Add button  */}
       <IconButton
            onClick={handleAddPropertyClick}
            sx={{
              border: "1px solid #047A9A",
              borderRadius: " 4px",
              padding: "4.5px",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 32,
                backgroundColor: "#047A9A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AddIcon sx={{ fontSize: 20, color: "white" }} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                paddingLeft: "3px",
                color: "var(--primary-text-color)",
              }}
            >
              Schedule Maintenance
            </Typography>
          </IconButton>

      </Box>

   
      <UpcomingMaintenanceTable
        maintenance={upcomingMaintenance}
        onViewUnitsClick={handleViewDetailsClick}
      />
    



<AddAssetForm
  open={showAddMaintenanceForm}
  onSubmit={handleSubmit}
  onCancel={handleCancel}

/>


</Container>

    </Box>
  );
}
export default Upcoming;