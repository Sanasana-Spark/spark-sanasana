import React from 'react';
import { Box, styled } from '@mui/material';

// ── Custom Styled Container Mappings ──
const ShellLayout = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
});

const AppBody = styled(Box)({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
});

const MainViewport = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  backgroundColor: theme.palette.background.default,
  /* Webkit custom scrollbars injection */
  '&::-webkit-scrollbar': { width: '4px', height: '4px' },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.brand.border2,
    borderRadius: '4px',
  },
}));

const SlidingPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})(({ theme, isOpen }) => ({
  position: 'absolute',
  right: 0,
  top: '8vh',
  height: '80vh',
  zIndex: 100,
  width: '380px', // Standardized context drawer width
  backgroundColor: theme.palette.background.paper,
  boxShadow: '-2px 0 15px rgba(0, 0, 0, 0.15)',
  borderTopLeftRadius: '8px',
  borderBottomLeftRadius: '8px',
  borderLeft: `1px solid ${theme.palette.brand.border}`,
  transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
  transition: 'transform 0.3s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
}));

export default function AppShell({ 
  topbarContent, 
  sidebarContent, 
  sliderContent, 
  isSliderOpen, 
  children 
}) {
  return (
    <ShellLayout className="app-shell">
      {/* ── Fixed Global Navigation Header ── */}
      <Box className="topbar" sx={{ height: '56px', width: '100%', flexShrink: 0 }}>
        {topbarContent}
      </Box>

      <AppBody className="app-body">
        {/* ── Left Sidebar Segment ── */}
        {sidebarContent && (
          <Box className="sidebar" sx={{ flexShrink: 0 }}>
            {sidebarContent}
          </Box>
        )}

        {/* ── Central Application Space ── */}
        <MainViewport className="main-content">
          <Box className="page">
            {children}
          </Box>
        </MainViewport>

        {/* ── Sliding Panel Context Target (Overlay Layer) ── */}
        <SlidingPanel isOpen={isSliderOpen} className={`slider ${isSliderOpen ? 'open' : ''}`}>
          {sliderContent}
        </SlidingPanel>
      </AppBody>
    </ShellLayout>
  );
}