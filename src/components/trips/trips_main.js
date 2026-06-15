/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import DragIndicator from "@mui/icons-material/DragIndicator";
import Reorder from "@mui/icons-material/Reorder";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import AssetsTable from "./tripsTable"
import AssetDetails from "./tripDetails";
import { useAuthContext } from '../onboarding/authProvider';
import {
  Container,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const Trips = () => {
  
  const baseURL = process.env.REACT_APP_BASE_URL
  const { apiFetch } = useAuthContext();
  const [currentView, setCurrentView] = useState("TableView"); // Initial view state
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [trips, setTrips] = useState([]);
  const [, setLoading] = useState(true);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  useEffect(() => {
    apiFetch(`${baseURL}/trips/?state=new`, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  },[baseURL,apiFetch] ); // Empty dependency array ensures this effect runs only once when the component mounts



  const selectedTrip = trips.filter(
    (trip) => trip["id"] === selectedTicket
  );



  const AssetView = () => (

// <Container width="100%" sx={{ fontFamily: "var(--font-family)", padding:1 }}>
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
         
   
      </Box>

   
  <AssetsTable
        trips={trips}
        onViewUnitsClick={handleViewDetailsClick}
      />
    
  


</Container>

  );

  const DetailView = ({ selectedTrip, isOpen }) => (
    // <Container width="100%"  sx={{ fontFamily: "var(--font-family)", padding: 1 }}>
    <Container maxWidth="xl" disableGutters sx={{ padding: { xs: 1, sm: 2 } }}>

    
     
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
              trips={trips}
              onViewUnitsClick={handleViewDetailsClick}
            />
          </Box>

 

        <div className={`slider ${isOpen ? "open" : ""}`}>
          <Box sx={{ fontFamily: "var(--font-family)", padding: 1, position:"fixed", right:0, width:"40vw" }}>        
          <AssetDetails selectedTrip={selectedTrip} />
          </Box>
        </div>

    
    </Container>
  );

  const handleIconClick = (iconIndex) => {
    const newView = iconIndex === 0 ? "TableView" : "RequestDetails"; // Determine view based on index
    console.log("Icon clicked, switching to view:", newView);
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
          selectedTrip={selectedTrip}
          isOpen={isSliderOpen}
          />
          </>
        
        ); // Replace with actual rendering logic for RequestDetails
      default:
        return null;
    }
  };

  const handleViewDetailsClick = (rowIndex) => {
    console.log("View details clicked for row index:", rowIndex);
     setSelectedTicket(rowIndex);
     setCurrentView("RequestDetails");
     setIsSliderOpen(true);
  };

  return (
    <>{setTrips.length > 0 ? <>{renderView()}</> : <p> {renderView()} </p>}</>
  );
};

export default Trips;
