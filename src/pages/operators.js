/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import DragIndicator from "@mui/icons-material/DragIndicator";
import Reorder from "@mui/icons-material/Reorder";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ActionNav from "../components/operators/actionOperatorNav";
import AssetsTable from "../components/operators/operatorTable"
import AddPropertyForm from "../components/operators/addOperator";
import AssetDetails from "../components/operators/operatorDetails";
import Loader from "../components/loader";

const Operators = () => {
  
  const baseURL = process.env.REACT_APP_BASE_URL
  const [currentView, setCurrentView] = useState("TableView"); // Initial view state
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const apiUrl = `${baseURL}/properties`;
    // to be corrected to dynamic
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL]); // Empty dependency array ensures this effect runs only once when the component mounts

  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);

  const handleSubmit = (propertyData) => {
    // Define the URL for the POST request
    const url = `${baseURL}/properties/create`;
    const data = {
      p_name: propertyData.p_name,
      p_num_units: propertyData.p_num_units,
      p_manager_id: propertyData.p_manager_id,
      p_country: propertyData.p_country,
      p_city: propertyData.p_city,
      p_address: propertyData.p_address,
      p_zipcode: propertyData.p_zipcode,
      p_state: propertyData.p_state,
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
          throw new Error("Failed to add property");
        }
        console.log("Property added successfully");
        console.log("Property added successfully", propertyData);
        setShowAddPropertyForm(false);
      })
      .catch((error) => {
        console.error("Error adding property:", error);
      });
  };

  const handleCancel = () => {
    setShowAddPropertyForm(false);
  };

  const handleAddPropertyClick = () => {
    setShowAddPropertyForm(true);
  };



  const PropertyView = () => (
    <>
      {!loading && (
        <div className="fluidGrid">
          <div>
            <ActionNav
              title="Properties"
              icons={icons}
              onAddClick={handleAddPropertyClick}
              icontitle="Add Operator"
            />
            {showAddPropertyForm && (
              <AddPropertyForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            )}
          </div>
          <AssetsTable
            properties={properties}
            onViewUnitsClick={handleViewDetailsClick}
          />
        </div>
      )}


{ loading && (<Loader/> )}
    </>
  );

  const DetailView = () => (
    <>
      {!loading && (
        <div className="fluidGrid">
          <AssetDetails
            selectedProperty={selectedTicket}
          />
        </div>
      )}

{ loading && (<Loader/> )}
    </>
  );

  const handleIconClick = (iconIndex) => {
    const newView = iconIndex === 0 ? "TableView" : "RequestDetails"; // Determine view based on index
    setCurrentView(newView);
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
        return <PropertyView />;
      case "RequestDetails":
        return (
          <DetailView/>
        ); // Replace with actual rendering logic for RequestDetails
      default:
        return null;
    }
  };

  const handleViewDetailsClick = (rowIndex) => {
    setCurrentView("RequestDetails");
    setSelectedTicket(rowIndex);
  };
  console.log(currentView, selectedTicket);

  return (
    <>{setProperties.length > 0 ? <>{renderView()}</> : <p> add Operator </p>}</>
  );
};

export default Operators;
