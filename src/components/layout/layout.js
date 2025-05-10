import React from 'react';
import VerticalSidebar from './sidebar';
import TopBar from './topbar';
import { useMediaQuery, useTheme, Box } from '@mui/material';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      
      <VerticalSidebar>
        {/* Only render TopBar on desktop */}
        {!isMobile && <TopBar />}
        
        <Box component="main"
          sx={{
            flexGrow: 1,
            overflow: 'scroll',
            backgroundColor: 'var(--faded-primary-color)',
            marginTop: isMobile ? '64px' : 0,
            padding: 0, // ✅ Remove internal spacing
            height: `calc(100vh - ${isMobile ? 0 : 64}px)`,
            width: `calc(100vw - ${isMobile ? 0 : 255}px)`,
          }}
        >
          {children}
        </Box>
      </VerticalSidebar>
    </Box>
  );
};

export default Layout;
