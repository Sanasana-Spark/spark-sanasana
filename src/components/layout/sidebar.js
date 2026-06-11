import React, {useEffect, useState} from "react";
import {
  Drawer
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthContext } from "../onboarding/authProvider";
import { UserButton } from "@clerk/clerk-react";


export default function VerticalSidebar({mobileOpen, onDrawerToggle, isMobile, children }) {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, apiFetch } = useAuthContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { org_name } = useAuthContext();
 
  const isRouteActive = (path) => path === '/' ? pathname === '/' : pathname.startsWith(path);

  const [, setLoading] = useState(true);
  const [dashboardSummary, setDashboardSummary] = useState({
    totalAssets: 0,
    totalDrivers: 0,
    totalMaintenanceAlerts: 0
  });

  const [, setPrevOrgId] = useState(null);
  useEffect(() => {
    if (!org_id) return;

    setPrevOrgId((prev) => {
      if (prev === org_id) return prev; // Prevent unnecessary state update
      return org_id;
    });

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true); // Ensure loading state is set correctly

    apiFetch(`${baseURL}/summaries/`, { method: "GET", signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDashboardSummary(data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      });

    return () => controller.abort(); // Cleanup previous fetch request
  }, [apiFetch, org_id, baseURL]); // Runs only when org_id changes


  const NAV_CONFIG = [
    { path: '/',            label: 'Dashboard',   icon: '⊞',   section: 'Overview' },
    { path: '/reports',     label: 'Analytics',     icon: '📊',     section: 'Overview' },
    { path: '/assets',      label: 'Vehicles',    icon: '🚐',       section: 'Operations', badge: `${dashboardSummary.totalAssets}`, badgeType: 'badge-green' },
    { path: '/operators',   label: 'Drivers',     icon: '↗',    section: 'Operations', badge: `${dashboardSummary.totalDrivers}`, badgeType: 'badge-green' },
    { path: '/clients',     label: 'Clients',     icon: '↖',    section: 'Finance' },
    { path: '/trips',       label: 'Trips',       icon: '🚗',      section: 'Operations' },
    { path: '/fuel',        label: 'Fuel Log',    icon: '⛽',        section: 'Finance' },
    { path: '/reports',     label: 'Reports',     icon: '📊',     section: 'Finance' },
    { path: '/maintenance', label: 'Maintenance', icon: '🔧', section: 'People', badge: `${dashboardSummary.totalMaintenanceAlerts}`, badgeType: 'badge-red' },
    { path: '/settings',    label: 'Settings',    icon: '⚙',    section: 'Management' },
    { path: '/helpcenter',  label: 'Help Center', icon: '❓',  section: 'Management' },
    { path: '/carbon',      label: 'Carbon',       icon: '🌿', section: 'People' },
  ];
 const sections = [...new Set(NAV_CONFIG.map(item => item.section))];
  const sidebarContent = (
    <aside className="sidebar" style={{ height: '100%' }}>

      {sections.map(section => (
        <div key={section}>
          <div className="sidebar-section">{section}</div>
          {NAV_CONFIG.filter(n => n.section === section).map(n => (
            <div
              key={n.path}
              className={`sidebar-item${isRouteActive(n.path) ? ' active' : ''}`}
              onClick={() => {
                navigate(n.path);
                if (isMobile) onDrawerToggle();
              }}
            >
              <span className="sidebar-icon">
                {n.icon}
              </span>
              {n.label}
              {n.badge && <span className={`sidebar-badge ${n.badgeType}`}>{n.badge}</span>}
              {isRouteActive(n.path) && !n.badge && <span className="sidebar-dot" />}
            </div>
          ))}
        </div>
      ))}

      <div className="sidebar-bottom">
        <div className="user-row" style={{ padding: '4px 8px' }}>
          <UserButton afterSignOutUrl="/signin" />
          <div style={{ marginLeft: '4px' }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{org_name || 'Organization'}</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink4)' }}>Active Workspace</div>
          </div>
        </div>
      </div>
    </aside>
  );

if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: 250, border:'solid 1px var(--ink2)', backgroundColor: 'var(--white)' } }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return sidebarContent;
}
