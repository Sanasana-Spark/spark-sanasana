import React, { useState } from 'react';
import VerticalSidebar from './sidebar';
import TopBar from './topbar';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="app-shell">
      <TopBar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
      <div className="app-body">
        <VerticalSidebar 
          mobileOpen={mobileOpen} 
          onDrawerToggle={handleDrawerToggle} 
          isMobile={isMobile} 
        />
        <main className="main-content">
          {children}
        </main>

      </div>
      
    </div>
  );
};

export default Layout;
