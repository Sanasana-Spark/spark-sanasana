import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  Divider,
  IconButton,
  useMediaQuery,
  AppBar,
  Toolbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';

import ListItemWithLink from './ListItemWithLink';
import Logo from '../../assets/logo.png';
import Dashboard_icon from '../../assets/dashboard_icon.png';
import Asset_icon from '../../assets/asset_icon.png';
import Maintenance_icon from '../../assets/maintenance_icon.png';
import Helpcenter_icon from '../../assets/helpcenter_icon.png';
import Reports_icon from '../../assets/reports_icon.png';
import Settings_icon from '../../assets/settings_icon.png';
import Operator_icon from '../../assets/operator_icon.png';
import Fuel_icon from '../../assets/fuel_icon.png';
import Routes_icon from '../../assets/routes_icon.png';
import { useAuthContext } from "../onboarding/authProvider";
import { UserButton } from "@clerk/clerk-react";

const drawerWidth = 250;
const NAV_CONFIG = [
  { path: '/',            label: 'Dashboard',   icon: Dashboard_icon,   section: 'Overview' },
  { path: '/assets',      label: 'Vehicles',    icon: Asset_icon,       section: 'Operations', badge: '18', badgeType: 'badge-green' },
  { path: '/operators',   label: 'Drivers',     icon: Operator_icon,    section: 'Operations' },
  { path: '/clients',     label: 'Clients',     icon: Operator_icon,    section: 'Operations' },
  { path: '/trips',       label: 'Trips',       icon: Routes_icon,      section: 'Operations' },
  { path: '/fuel',        label: 'Fuel Log',    icon: Fuel_icon,        section: 'Finance' },
  { path: '/reports',     label: 'Reports',     icon: Reports_icon,     section: 'Finance' },
  { path: '/maintenance', label: 'Maintenance', icon: Maintenance_icon, section: 'People', badge: '3', badgeType: 'badge-red' },
  { path: '/settings',    label: 'Settings',    icon: Settings_icon,    section: 'Management' },
  { path: '/helpcenter',  label: 'Help Center', icon: Helpcenter_icon,  section: 'Management' },
];

export default function VerticalSidebar({mobileOpen, onDrawerToggle, isMobile, children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { org_name } = useAuthContext();
  const sections = [...new Set(NAV_CONFIG.map(item => item.section))];
  const isRouteActive = (path) => path === '/' ? pathname === '/' : pathname.startsWith(path);

  const sidebarContent = (
    <aside className="sidebar" style={{ height: '100%', borderRight: 'none' }}>
      {!isMobile && (
        <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pb={2} pt={1}>
          <img src={Logo} alt="logo" style={{ maxHeight: 42 }} />
        </Box>
      )}

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
                <img src={n.icon} className="icon" alt="" style={{ width: 17, height: 17 }} />
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

  const location = window.location; // Get the current location

  const drawerContent = (
    <div>

      {!isMobile && (
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pb={2}>
        <img src={Logo} alt="logo" style={{ maxHeight: 50 }} />
      </Box>
    )}

      <List>
        <ListItemWithLink label="Dashboard" icon={<img src={Dashboard_icon} className="icon" alt="dashboard" />} to="/"  active={location.pathname === '/'} />
        <ListItemWithLink label="Vehicles" icon={<img src={Asset_icon} className="icon" alt="" />} to="/assets"  active={location.pathname === '/assets'} />
        <ListItemWithLink label="Drivers" icon={<img src={Operator_icon} className="icon" alt="" />} to="/operators"  active={location.pathname === '/operators'} />
        <ListItemWithLink label="Clients" icon={<img src={Operator_icon} className="icon" alt="" />} to="/clients"  active={location.pathname === '/clients'} />
        <ListItemWithLink label="Trips" icon={<img src={Routes_icon} className="icon" alt="" />} to="/trips"  active={location.pathname === '/trips'} />
        <ListItemWithLink label="Fuel" icon={<img src={Fuel_icon} className="icon" alt="" />} to="/fuel"  active={location.pathname === '/fuel'} />
        <ListItemWithLink label="Maintenance" icon={<img src={Maintenance_icon} className="icon" alt="" />} to="/maintenance"  active={location.pathname === '/maintenance'} />
        <ListItemWithLink label="Reports" icon={<img src={Reports_icon} className="icon" alt="" />} to="/reports"  active={location.pathname === '/reports'} />
      </List>
      <Divider />
      <List>
        <ListItemWithLink label="Settings" icon={<img src={Settings_icon} className="icon" alt="" />} to="/settings" />
        <ListItemWithLink label="Help Center" icon={<img src={Helpcenter_icon} className="icon"  alt=""/>} to="/helpcenter" />
        {/* <ListItemWithLink label="Logout" icon={<img src={Logout_icon} className="icon" alt="" />} to="/logout" /> */}
      </List>
    </div>
  );

if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: 250, border: 'none', backgroundColor: 'var(--white)' } }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return sidebarContent;
}
