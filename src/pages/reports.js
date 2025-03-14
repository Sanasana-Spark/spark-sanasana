import React, { useState } from "react";
import  "../App.css";
import General from "../components/reports/general";
import Operators from "../components/reports/operators";
import Assets from "../components/reports/assets";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("General");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabButtonStyle = (isActive) => ({
    padding: "10px 20px",
    margin: "10px 20px",
    fontWeight: "bold",
    fontSize: "0.75em",
    cursor: "pointer",
    borderRadius: "20px",
    background: isActive ? "var( --faded-primary-color)" : "transparent",
    border: "none",
    borderBottom: isActive ? "var(--primary-color)" : "none",
  });


  return (
    <div>
     
      <div style={{ display: "flex",fontWeight: "bold",fontSize: "1em",  }} >
        Reports
      </div>
      <div style={{ display: "grid", border: "1px solid gray", margin:"2em", overflow: "scroll" }} >

    

      <div style={{ display: "flex"}}>

        <button
          onClick={() => handleTabClick("General")}
          style={tabButtonStyle(activeTab === "General")}
        >
         General
        </button>
        <button
          onClick={() => handleTabClick("Operators")}
          style={tabButtonStyle(activeTab === "Operators")}
        >
          By-Operators
        </button>
        <button
          onClick={() => handleTabClick("Assets")}
          style={tabButtonStyle(activeTab === "Assets")}
        >
          By-Asset
        </button>
       
        

    

      </div>

      <div style={{ padding: "20px", height:"70vh" }}>
        {activeTab === "General" &&  <General/>}
        {activeTab === "Operators" && <Operators/>}
        {activeTab === "Assets" && <Assets/> }
      </div>

      </div>

    </div>
  );
};

export default Reports;
