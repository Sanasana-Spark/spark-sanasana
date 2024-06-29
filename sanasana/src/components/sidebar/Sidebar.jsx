// src/components/Sidebar.js
import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faToolbox, faRoute, faGasPump, faFile, faCog, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/assets/logo.png" alt="Sana Sana" className="logo" />
        <h1>Sana Sana</h1>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item"><FontAwesomeIcon icon={faHome} /> Dashboard</li>
        <li className="sidebar-item"><FontAwesomeIcon icon={faToolbox} /> Assets</li>
        <li className="sidebar-item"><FontAwesomeIcon icon={faWrench} /> Maintenance</li>
        <li className="sidebar-item"><FontAwesomeIcon icon={faRoute} /> Routes</li>
        <li className="sidebar-item"><FontAwesomeIcon icon={faGasPump} /> Fuel</li>
        <li className="sidebar-item"><FontAwesomeIcon icon={faFile} /> Reports</li>
      </ul>
      <ul className="sidebar-menu general">
        <li className="sidebar-item"><FontAwesomeIcon icon={faCog} /> Settings</li>
        <li className="sidebar-item"><FontAwesomeIcon icon={faQuestionCircle} /> Help Center</li>
        <li className="sidebar-item logout"><FontAwesomeIcon icon={faSignOutAlt} /> Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;
