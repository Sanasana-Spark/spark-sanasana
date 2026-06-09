import React, { } from 'react';
import {
  Drawer
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthContext } from "../onboarding/authProvider";
import { UserButton } from "@clerk/clerk-react";

const NAV_CONFIG = [
  { path: '/',            label: 'Dashboard',   icon: '⊞',   section: 'Overview' },
  { path: '/reports',     label: 'Analytics',     icon: '📊',     section: 'Overview' },
  { path: '/assets',      label: 'Vehicles',    icon: '🚐',       section: 'Operations', badge: '18', badgeType: 'badge-green' },
  { path: '/operators',   label: 'Drivers',     icon: '↗',    section: 'Operations' },
  { path: '/clients',     label: 'Clients',     icon: '↖',    section: 'Finance' },
  { path: '/trips',       label: 'Trips',       icon: '🚗',      section: 'Operations' },
  { path: '/fuel',        label: 'Fuel Log',    icon: '⛽',        section: 'Finance' },
  { path: '/reports',     label: 'Reports',     icon: '📊',     section: 'Finance' },
  { path: '/maintenance', label: 'Maintenance', icon: '🔧', section: 'People', badge: '3', badgeType: 'badge-red' },
  { path: '/settings',    label: 'Settings',    icon: '⚙',    section: 'Management' },
  { path: '/helpcenter',  label: 'Help Center', icon: '❓',  section: 'Management' },
  { path: '/carbon',      label: 'Carbon',       icon: '🌿', section: 'People' },
];

export default function VerticalSidebar({mobileOpen, onDrawerToggle, isMobile, children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { org_name } = useAuthContext();
  const sections = [...new Set(NAV_CONFIG.map(item => item.section))];
  const isRouteActive = (path) => path === '/' ? pathname === '/' : pathname.startsWith(path);

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
