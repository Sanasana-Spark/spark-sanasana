/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import DragIndicator from "@mui/icons-material/DragIndicator";
import Reorder from "@mui/icons-material/Reorder";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ActionNav from "../components/trips/actionTripNav";
import AssetsTable from "../components/trips/tripsTable"
// import AddAssetForm1 from "../components/trips/addTrip";
import AddAssetForm from "../components/trips/addTripMap";
import AssetDetails from "../components/trips/tripDetails";
import Loader from "../components/loader";
import { useAuthContext } from '../components/onboarding/authProvider';

const Trips = () => {
  
  const baseURL = process.env.REACT_APP_BASE_URL
  const { userId, org_id } = useAuthContext();
  const [currentView, setCurrentView] = useState("TableView"); // Initial view state
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  useEffect(() => {
    const apiUrl = `${baseURL}/trips`;
    // to be corrected to dynamic
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAssets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL]); // Empty dependency array ensures this effect runs only once when the component mounts


  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);

  const handleSubmit = (assetData) => {
    // Define the URL for the POST request
    const url = `${baseURL}/trips/create`;
    const data = {
      t_created_by: userId,
      t_organization_id:org_id,
      t_type: assetData.t_type,
      t_start_lat: assetData.t_start_lat,
      t_start_long: assetData.t_start_long,
      t_start_elavation: assetData.t_start_elavation,
      t_end_lat: assetData.t_end_lat,
      t_end_long: assetData.t_end_long,
      t_end_elavation: assetData.t_end_elavation,
      t_distance: assetData.t_distance,
      t_start_date: assetData.t_start_date,
      t_end_date: assetData.t_end_date,
      t_operator_id: assetData.t_operator_id,
      t_asset_id: assetData.t_asset_id,
      t_status: assetData.t_status,
      t_load: assetData.t_load,
    };
    const options = {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Specify the content type of the request body
      },
      body: JSON.stringify(data), // Convert data to JSON string for the request body
    };
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add asset");
        }
        console.log("Property added successfully");
        setShowAddPropertyForm(false);
      })
      .catch((error) => {
        console.error("Error adding asset:", error);
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
    <>
      {!loading && (
        <div className="fluidGrid">
          <div>

<ActionNav
              title="assets"
              icons={icons}
              onAddClick={handleAddPropertyClick}
              icontitle="Add Trip"
            />
           
         
          <AssetsTable
            assets={assets}
            onViewUnitsClick={handleViewDetailsClick}
          />
           </div>


              <AddAssetForm
                open={showAddPropertyForm}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
        

        </div>
      )}


{ loading && (<Loader/> )}
    </>
  );

  const DetailView = ({ selectedAsset, isOpen }) => (
    <>
      {!loading && (
         <div className="fluidGrid">

<ActionNav
              title="assets"
              icons={icons}
              onAddClick={handleAddPropertyClick}
              icontitle="Add Asset"
            />
           
         
          <AssetsTable
            assets={assets}
            onViewUnitsClick={handleViewDetailsClick}
          />

<AddAssetForm
                open={showAddPropertyForm}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
        
        <div className={`slider ${isOpen ? 'open' : ''}`}>
          <AssetDetails
            selectedAsset={selectedAsset}
          />
        </div>
        </div>
      )}

{ loading && ( <div className="loader-container">
        <Loader />
      </div> )}
    </>
  );

  const handleIconClick = (iconIndex) => {
    const newView = iconIndex === 0 ? "TableView" : "RequestDetails"; // Determine view based on index
    setCurrentView(newView);
    setIsSliderOpen(iconIndex !== 0); // Open slider if iconIndex is not 0
  };

  const icons = [
    currentView === "TableView" ? (
      <DisabledByDefaultIcon />
    ) : (
      <>
        <Reorder onClick={() => handleIconClick(0)} />
      </>
    ),

    currentView === "RequestDetails" ? (
      <DisabledByDefaultIcon />
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
