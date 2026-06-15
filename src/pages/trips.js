import React, { useState } from "react";
import New from "../components/trips/trips_main";
import Requested from "../components/trips/trips_cashflow";
import History from "../components/trips/trips_history";
import Summary from "../components/trips/trips_summary";
import AddTripForm from "../components/trips/addTripMap";
import { useAuthContext } from '../components/onboarding/authProvider';
const TABS = [
  ['Summary', 'Summary'],
  ['New', 'New/In-Progress'],
  ['Fuel_Requests', 'Income/Expenses'],
  ['History', 'History']
];

const Trips = () => {
   const baseURL = process.env.REACT_APP_BASE_URL
  const { apiFetch } = useAuthContext();
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [activeTab, setActiveTab] = useState("Summary");
  const handleSubmit = (assetData) => {
    // Define the URL for the POST request
    const url = `${baseURL}/trips/`;
    const data = {
      stops: assetData.stops,
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
      t_duration:assetData.t_duration,
      t_client_id: assetData.t_client_id,
    };

    apiFetch(url, { method: "POST", body: JSON.stringify(data) })
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

  const handleCancel = () => {
    setShowAddPropertyForm(false);
  };

  const handleAddPropertyClick = () => {
    setShowAddPropertyForm(true);
  };
  
const TAB_PAGES = {
    Summary: <Summary onNavigateTab={setActiveTab} />,
    New: <New />,
    Fuel_Requests: <Requested />,
    History: <History />
  };
const activeTabPage = TAB_PAGES[activeTab];

  return (
  <div className="page">
    
  <div className="page-header">
    <div className="page-title">Trips</div>
      <div className="page-actions">
          <button className="btn btn-primary" onClick={handleAddPropertyClick}>+ Add Trip</button>
    </div>

  </div>

  <div className="card">

      <div className="card-header">
      <div className="card-title">
      </div>

     <div className="tab-bar" style={{ border: 'none', padding: 0, marginLeft: 8 }}>
        {TABS.map(([key, label]) => (
          <div 
            key={key} 
            className={`tab-item${activeTab === key ? ' active' : ''}`} 
            onClick={() => setActiveTab(key)}
          >
            {label}
          </div>
        ))}
      </div>
    </div>

      <div className="tab-content" style={{ flexGrow: 1 }}>
        {activeTabPage}
      </div>
        
</div>





        {/* <Tabs
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
          {activeTab === "History" && <History />} */}


  <AddTripForm
  open={showAddPropertyForm}
  onSubmit={handleSubmit}
  onCancel={handleCancel}

/>
          
    </div>
  );
};

export default Trips;
