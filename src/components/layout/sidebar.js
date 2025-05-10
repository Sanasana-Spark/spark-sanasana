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

import ListItemWithLink from './ListItemWithLink';
import Logo from '../../assets/logo.png';
import Dashboard_icon from '../../assets/dashboard_icon.png';
import Asset_icon from '../../assets/asset_icon.png';
import Maintenance_icon from '../../assets/maintenance_icon.png';
import Helpcenter_icon from '../../assets/helpcenter_icon.png';
import Reports_icon from '../../assets/reports_icon.png';
import Settings_icon from '../../assets/settings_icon.png';
import Logout_icon from '../../assets/logout_icon.png';
import Operator_icon from '../../assets/operator_icon.png';
import Fuel_icon from '../../assets/fuel_icon.png';
import Routes_icon from '../../assets/routes_icon.png';

const drawerWidth = 250;

export default function VerticalSidebar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <div>

      {!isMobile && (
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pb={2}>
        <img src={Logo} alt="logo" style={{ maxHeight: 50 }} />
      </Box>
    )}

      <List>
        <ListItemWithLink label="Dashboard" icon={<img src={Dashboard_icon} className="icon" alt="dashboard" />} to="/" />
        <ListItemWithLink label="Assets" icon={<img src={Asset_icon} className="icon" alt="" />} to="/assets" />
        <ListItemWithLink label="Operators" icon={<img src={Operator_icon} className="icon" alt="" />} to="/operators" />
        <ListItemWithLink label="Clients" icon={<img src={Operator_icon} className="icon" alt="" />} to="/clients" />
        <ListItemWithLink label="Trips" icon={<img src={Routes_icon} className="icon" alt="" />} to="/trips" />
        <ListItemWithLink label="Fuel" icon={<img src={Fuel_icon} className="icon" alt="" />} to="/fuel" />
        <ListItemWithLink label="Maintenance" icon={<img src={Maintenance_icon} className="icon" alt="" />} to="/maintenance" />
        <ListItemWithLink label="Reports" icon={<img src={Reports_icon} className="icon" alt="" />} to="/reports" />
      </List>
      <Divider />
      <List>
        <ListItemWithLink label="Settings" icon={<img src={Settings_icon} className="icon" alt="" />} to="/settings" />
        <ListItemWithLink label="Help Center" icon={<img src={Helpcenter_icon} className="icon"  alt=""/>} to="/helpcenter" />
        <ListItemWithLink label="Logout" icon={<img src={Logout_icon} className="icon" alt="" />} to="/logout" />
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 ,
           backgroundColor: 'var(--main-bg-color)'
        }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2,
                 backgroundColor: 'var(--primary-color)'
              }}
            >
              <MenuIcon />
            </IconButton>
            <img src={Logo} alt="logo" style={{ height: 40 }} />
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: 'var(--main-bg-color)',
            paddingTop: isMobile ? '64px' : '15px',

            border: 'none'
          }
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, padding: '10px', marginTop: isMobile ? '64px' : 0 }}>
        {children}
      </Box>
    </Box>
  );
}
