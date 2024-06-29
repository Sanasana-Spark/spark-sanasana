import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar'
import Sidebar from '../sidebar/Sidebar'
import './DashboardMain.css';

const DashboardMain = () => {
  const [assetsOverview, setAssetsOverview] = useState({
    total: 0,
    active: 0,
    parking: 0,
    maintenance: 0,
    inactive: 0,
  });
  const [fuelSpend, setFuelSpend] = useState(0);
  const [liveTracking, setLiveTracking] = useState({
    vehicle: 0,
    fuel: 0,
  });

  useEffect(() => {
    // Fetch assets overview data
    fetch('/api/assets-overview')
      .then(response => response.json())
      .then(data => setAssetsOverview({
        total: data.total || 0,
        active: data.active || 0,
        parking: data.parking || 0,
        maintenance: data.maintenance || 0,
        inactive: data.inactive || 0,
      }))
      .catch(() => setAssetsOverview({
        total: 0,
        active: 0,
        parking: 0,
        maintenance: 0,
        inactive: 0,
      }));

    // Fetch fuel spend data
    fetch('/api/fuel-spend')
      .then(response => response.json())
      .then(data => setFuelSpend(data.fuelSpend || 0))
      .catch(() => setFuelSpend(0));

    // Fetch live tracking data
    fetch('/api/live-tracking')
      .then(response => response.json())
      .then(data => setLiveTracking({
        vehicle: data.vehicle || 0,
        fuel: data.fuel || 0,
      }))
      .catch(() => setLiveTracking({
        vehicle: 0,
        fuel: 0,
      }));
  }, []);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <div className="assets-overview">
            <h3>Assets Overview</h3>
            <div className="assets-overview-card">
              <h4>Total Number</h4>
              <p>{assetsOverview.total}</p>
              <h4>Active</h4>
              <p>{assetsOverview.active}</p>
              <h4>Parking</h4>
              <p>{assetsOverview.parking}</p>
              <h4>Maintenance</h4>
              <p>{assetsOverview.maintenance}</p>
              <h4>Inactive</h4>
              <p>{assetsOverview.inactive}</p>
            </div>
            <button className="add-asset-btn">Add Asset</button>
          </div>
          <div className="fuel-spend">
            <h3>Fuel Spend</h3>
            <div className="fuel-spend-card">
              <p>${fuelSpend.toLocaleString()}</p>
            </div>
          </div>
          <div className="live-tracking">
            <h3>Live Tracking</h3>
            <div className="live-tracking-card">
              <h4>Vehicle</h4>
              <p>{liveTracking.vehicle}</p>
              <h4>Fuel</h4>
              <p>{liveTracking.fuel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;
