/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import DragIndicator from "@mui/icons-material/DragIndicator";
import Reorder from "@mui/icons-material/Reorder";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ActionNav from "../components/operators/actionOperatorNav";
import OperatorTable from "../components/operators/operatorTable"
import AddOperatorForm from "../components/operators/addOperator";
import OperatorDetails from "../components/operators/operatorDetails";
import Loader from "../components/loader";
import { useAuthContext } from '../components/onboarding/authProvider';

const Operators = () => {
  
  const baseURL = process.env.REACT_APP_BASE_URL
  const { user_id, org_id } = useAuthContext();
  const [currentView, setCurrentView] = useState("TableView"); // Initial view state
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  useEffect(() => {
    if (org_id && user_id) {
    const apiUrl = `${baseURL}/operators/${org_id}/${user_id}`;
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
  }}, [baseURL, org_id, user_id, showAddPropertyForm]); // Empty dependency array ensures this effect runs only once when the component mounts




  const handleSubmit = (operatorData) => {
    // Define the URL for the POST request
    const url = `${baseURL}/operators/create`;
    const data = {
      o_created_by: user_id,
      o_organisation_id:org_id,
      o_name: operatorData.o_name,
      o_email: operatorData.o_email,
      o_phone: operatorData.o_phone,
      o_national_id: operatorData.o_national_id,
      o_lincense_id: operatorData.o_lincense_id,
      o_lincense_type: operatorData.o_lincense_type,
      o_lincense_expiry: operatorData.o_lincense_expiry,
      o_payment_card_id: operatorData.o_payment_card_id,
      o_Payment_card_no: operatorData.o_Payment_card_no,
      o_role: operatorData.o_role,
      o_status: operatorData.o_status,
      o_cum_mileage: operatorData.o_cum_mileage,
      o_expirence: operatorData.o_expirence,
      o_assigned_asset: operatorData.o_assigned_asset
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
          throw new Error("Failed to add Operator");
        }
        console.log("Operator added successfully");
        setShowAddPropertyForm(false);
      })
      .catch((error) => {
        console.error("Error adding Operator:", error);
      });
  };
  const selectedOperator = assets.filter(
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
              icontitle="Add Operator"
            />
           
         
          <OperatorTable
            operators={assets}
            onViewUnitsClick={handleViewDetailsClick}
          />
           </div>


              <AddOperatorForm
                open={showAddPropertyForm}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
        

        </div>
      )}


{ loading && (<Loader/> )}
    </>
  );

  const DetailView = ({ selectedOperator, isOpen }) => (
    <>
      {!loading && (
         <div className="fluidGrid">

<ActionNav
              title="assets"
              icons={icons}
              onAddClick={handleAddPropertyClick}
              icontitle="Add Asset"
            />
           
         
          <OperatorTable
            operators={assets}
            onViewUnitsClick={handleViewDetailsClick}
          />

<AddOperatorForm
                open={showAddPropertyForm}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
        
        <div className={`slider ${isOpen ? 'open' : ''}`}>
          <OperatorDetails
            selectedOperator={selectedOperator}
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
          selectedOperator={selectedOperator}
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

export default Operators;
