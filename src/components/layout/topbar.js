import React from 'react';
import { UserButton } from "@clerk/clerk-react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Logo from '../../assets/logo.png';
import { useAuthContext } from '../onboarding/authProvider';

const TopBar = () => {
  const { org_name } = useAuthContext();


  
  return (
    <AppBar position="fixed">
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#F6F7F8', color: 'black' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt='' style={{ maxWidth: '150px' }} /> {/* Adjust the width as needed */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" style={{ marginRight: '16px' }}>{org_name}</Typography>
          <IconButton color="inherit" style={{ marginRight: '16px' }}>
            <NotificationsIcon />
          </IconButton>
          <UserButton />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
