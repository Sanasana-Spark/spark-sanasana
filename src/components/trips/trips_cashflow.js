/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import DragIndicator from "@mui/icons-material/DragIndicator";
import Reorder from "@mui/icons-material/Reorder";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import AssetsTable from "./trips_cashflow_table";
import AddAssetForm from "./addTripMap";
import AssetDetails from "./trip_cashflow_details";
import { useAuthContext } from '../onboarding/authProvider';
import {
  Container,
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Search } from "@mui/icons-material";

const Trips = () => {
  
  const baseURL = process.env.REACT_APP_BASE_URL
  const { user_id, org_id } = useAuthContext();
  const [currentView, setCurrentView] = useState("TableView"); // Initial view state
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  console.log(loading)
  useEffect(() => {
    if (org_id && user_id) {
    fetch(`${baseURL}/trips/${org_id}/${user_id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAssets(data.filter((trip) => ["Requested", "In-Progress", "Completed"].includes(trip.t_status) && trip.t_actual_cost === null));
       


        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }},[baseURL,org_id, user_id, showAddPropertyForm] ); // Empty dependency array ensures this effect runs only once when the component mounts


  const handleSubmit = (assetData) => {
    // Define the URL for the POST request
    const url = `${baseURL}/trips/${org_id}/${user_id}/`;
    const data = {
      t_type: assetData.t_type,
      t_start_lat: assetData.t_start_lat,
      t_start_long: assetData.t_start_long,
      t_start_elavation: assetData.t_start_elavation,
      t_end_lat: assetData.t_end_lat,
      t_end_long: assetData.t_end_long,
      t_end_elavation: assetData.t_end_elavation,
      t_start_date: assetData.t_start_date,
      t_end_date: assetData.t_end_date,
      t_operator_id: assetData.t_operator_id,
      t_asset_id: assetData.t_asset_id,
      t_status: assetData.t_status,
      t_load: assetData.t_load,
      t_origin_place_id:assetData.t_origin_place_id,
      t_origin_place_query:assetData.t_origin_place_query,
      t_destination_place_id:assetData.t_destination_place_id,
      t_destination_place_query:assetData.t_destination_place_query,
      t_directionsResponse:assetData.t_directionsResponse,
      t_distance:assetData.t_distance,
      t_duration:assetData.t_duration
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
          throw new Error("Failed to add trip");
        }
        console.log("trip added successfully");
        setShowAddPropertyForm(false);
      })
      .catch((error) => {
        console.error("Error adding trip:", error);
      });
  };
  const selectedAsset = assets.filter(
    (asset) => asset["id"] === selectedTicket
  );

  const handleCancel = () => {
    setShowAddPropertyForm(false);
  };

  const handleAddPropertyClick = () => {
    setShowAddPropertyForm(true);
  };



  const AssetView = () => (

<Container width="100%" sx={{ fontFamily: "var(--font-family)", padding:1 }}>
<Box  >


    <Grid item xs={12}  >

      <Box
        sx={{

          display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Pushes elements apart
    padding: "15px 25px",
    gap: 2, // Adds spacing between elements

        }}
      >
      
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Search Box */}
       
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
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
       


      </Box>

    <Box>
      <AssetsTable
        assets={assets}
        onViewUnitsClick={handleViewDetailsClick}
      />
      </Box>


    </Grid>


</Box>

<AddAssetForm
  open={showAddPropertyForm}
  onSubmit={handleSubmit}
  onCancel={handleCancel}

/>


</Container>

  );

  const DetailView = ({ selectedAsset, isOpen }) => (
    <Container width="100%"  sx={{ fontFamily: "var(--font-family)", padding: 1 }}>

      <Box>
        <Grid item xs={12} marginBottom={5}></Grid>
          <Box display="flex" justifyContent="space-between"></Box>
            <Typography variant="h6">Trips</Typography>
            <Box
              display="flex"
              justifyContent="flex-end"
              gap={2}
              color="var(--primary-text-color)"
            >
              {/* Add button */}
              <IconButton
                onClick={handleAddPropertyClick}
                sx={{
                  border: "1px solid #047A9A",
                  borderRadius: "4px",
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
                  Add Trip
                </Typography>
              </IconButton>
            </Box>
          </Box>
     
          <Box
            sx={{
              display: "flex",
              padding: '15px 25px'
            }}
          >
            {/* Search Box */}
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
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

          <Box>
            <AssetsTable
              assets={assets}
              onViewUnitsClick={handleViewDetailsClick}
            />
          </Box>

 

        <div className={`slider ${isOpen ? "open" : ""}`}>
          <Box sx={{ fontFamily: "var(--font-family)", padding: 1, position:"fixed", right:0, width:"40vw" }}>        
          <AssetDetails selectedAsset={selectedAsset} />
          </Box>
        </div>

    

      <AddAssetForm
        open={showAddPropertyForm}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  );

  const handleIconClick = (iconIndex) => {
    const newView = iconIndex === 0 ? "TableView" : "RequestDetails"; // Determine view based on index
    setCurrentView(newView);
    setIsSliderOpen(iconIndex !== 0); // Open slider if iconIndex is not 0
  };

  const icons = [
    currentView === "TableView" ? (
       <Reorder/>
      
    ) : (
      
        <DisabledByDefaultIcon onClick={() => handleIconClick(0)} />
      
    ),

    currentView === "RequestDetails" ? (
      <Reorder />
      
    ) : (
      <DragIndicator onClick={() => handleIconClick(1)} />
    ),
  ];

  const renderView = () => {
    switch (currentView) {
      case "TableView":
        return <AssetView />;
      case "RequestDetails":
        return (
          <>
         
          <DetailView
          selectedAsset={selectedAsset}
          isOpen={isSliderOpen}
          />
          </>
        
        ); // Replace with actual rendering logic for RequestDetails
      default:
        return null;
    }
  };

  const handleViewDetailsClick = (rowIndex) => {
    setCurrentView("RequestDetails");
    setSelectedTicket(rowIndex);
    setIsSliderOpen(true);
  };

  return (
    <>{setAssets.length > 0 ? <>{renderView()}</> : <p> add Assets </p>}</>
  );
};

export default Trips;
