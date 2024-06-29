import React from 'react';
import './DashboardMain.css';

const DashboardMain = () => {
  return (
    <div className="dashboard-main">
      <div className="overview">
        <div className="overview-card">
          <h3>Total Assets</h3>
          <p>1,283</p>
        </div>
        <div className="overview-card">
          <h3>Overall Assets Value</h3>
          <p>$25,000,000</p>
        </div>
        <div className="overview-card">
          <h3>Number of Clients</h3>
          <p>5</p>
        </div>
      </div>
      <div className="assets-overview">
        <h3>Assets Overview</h3>
        <div className="assets-overview-card">
          <h4>Vehicles</h4>
          <p>75 Total Number</p>
          <p>40 Active</p>
          <p>10 Parking</p>
          <p>10 Maintenance</p>
          <p>15 Inactive</p>
        </div>
        <button className="add-asset-btn">Add Asset</button>
      </div>
      <div className="fuel-spend">
        <h3>Fuel Spend</h3>
        <div className="fuel-spend-chart">
          {/* Placeholder for chart */}
          <p>$1,230</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;
