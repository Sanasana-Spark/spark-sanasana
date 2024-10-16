/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import DragIndicator from "@mui/icons-material/DragIndicator";
import Reorder from "@mui/icons-material/Reorder";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ActionNav from "../components/assets/actionAssetNav";
import AssetsTable from "../components/assets/assetsTable"
import AddAssetForm from "../components/assets/addAsset";
import BulkUploadForm from "../components/assets/upload";
import AssetDetails from "../components/assets/assetDetails";
import Loader from "../components/loader";
import { useAuthContext } from '../components/onboarding/authProvider';

const Assets = () => {
  
  const baseURL = process.env.REACT_APP_BASE_URL
  const { user_id} = useAuthContext();
  const { org_id } = useAuthContext();
  const [currentView, setCurrentView] = useState("TableView"); // Initial view state
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [showBulkUploadForm, setShowBulkUploadForm] = useState(false);

  
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  useEffect(() => {
    if (org_id && user_id) {
    const apiUrl = `${baseURL}/assets/${org_id}/${user_id}`;
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
  }}, [baseURL, org_id, user_id, showAddPropertyForm]); // Empty dependency array ensures this effect runs only once when the component mounts




  const handleSubmit = (assetData) => {
    // Define the URL for the POST request
    const url = `${baseURL}/assets/create`;
    const data = {
      a_created_by: user_id,
      a_organisation_id:org_id,
      a_name: assetData.a_name,
      a_make: assetData.a_make,
      a_model: assetData.a_model,
      a_year: assetData.a_year,
      a_license_plate: assetData.a_license_plate,
      a_type: assetData.a_type,
      a_chasis_no: assetData.a_chasis_no,
      a_msrp: assetData.a_msrp,
      a_engine_size: assetData.a_engine_size,
      a_tank_size: assetData.a_tank_size,
      a_efficiency_rate: assetData.a_efficiency_rate,
      a_fuel_type: assetData.a_fuel_type,
      a_cost: assetData.a_cost,
      a_value: assetData.a_value,
      a_depreciation_rate: assetData.a_depreciation_rate,
      a_apreciation_rate: assetData.a_aprecition_rate,
      a_accumulated_dep: assetData.a_accumulated_dep,
      a_status: assetData.a_status,
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
    setShowBulkUploadForm(false);
  };

  const handleAddPropertyClick = () => {
    setShowAddPropertyForm(true);
  };

  const handleBulkUploadClick = () => {
    setShowBulkUploadForm(true);
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
              icontitle="Add Asset"

              onSecondClick= {handleBulkUploadClick}
              bulktitle="Bulk Upload"
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

<BulkUploadForm
                open={showBulkUploadForm}
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


              onSecondClick= {handleAddPropertyClick}
              bulktitle="Bulk Upload"
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
  console.log(currentView, selectedTicket);

  return (
    <>{setAssets.length > 0 ? <>{renderView()}</> : <p> add Assets </p>}</>
  );
};

export default Assets;
