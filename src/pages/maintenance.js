import React, { useState } from "react";
import Upcoming from "../components/maintenance/upcoming";
import Summaries from "../components/maintenance/maintenance_summary";
import History from "../components/maintenance/history";
const TABS = [
    ['Upcoming', 'Upcoming'],
    ['History', 'History'],
    ['Summaries', 'Summaries']
];
const Maintenance = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const TAB_PAGES = {
    Upcoming: <Upcoming onNavigateTab={setActiveTab} />,
    History: <History />,
    Summaries: <Summaries />
  };
  const activeTabPage = TAB_PAGES[activeTab];

  return (
    <div className="page">
    

      <div className="page-header">
      <div><div className="page-title">Maintenance</div><div className="page-subtitle">Schedule & service history</div></div>
      <div className="page-actions">
          <button className="btn btn-primary" onClick="">+ Log service</button>
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
       
     
    </div>
  );
};

export default Maintenance;
