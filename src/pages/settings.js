import React, { useState } from "react";
import  "../App.css";
import Generalview from "../components/general_settings/main";
import Userpermissions from "../components/users_settings/main";
// import { useAuthContext } from '../components/onboarding/authProvider';

const Settings = () => {
  // const { user_id, org_id } = useAuthContext();
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
        Settings
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
          onClick={() => handleTabClick("Users")}
          style={tabButtonStyle(activeTab === "Users")}
        >
          Users 
        </button>
        <button
          onClick={() => handleTabClick("Billing")}
          style={tabButtonStyle(activeTab === "Billing")}
        >
          Billing
        </button>
        <button
          onClick={() => handleTabClick("Notification")}
          style={tabButtonStyle(activeTab === "Notification")}
        >
          Notification
        </button>
        <button
          onClick={() => handleTabClick("Security")}
          style={tabButtonStyle(activeTab === "Security")}
        >
          Security
        </button>

    

      </div>

      <div style={{ padding: "20px", height:"70vh" }}>
        {activeTab === "General" &&  <Generalview/>}
        {activeTab === "Users" && <Userpermissions/>}
        {activeTab === "Billing" && <div>This is the content of Billing </div>}
        {activeTab === "Notification" && <div>This is the content of Notification </div>}
        {activeTab === "Security" && <div>This is the content of Security </div>}
      </div>

      </div>

    </div>
  );
};

export default Settings;
