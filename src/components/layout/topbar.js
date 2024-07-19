import React from 'react';
import { UserButton } from "@clerk/clerk-react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuthContext } from '../onboarding/authProvider';

const TopBar = () => {
  const { org_name } = useAuthContext();
  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Typography variant="h6">{org_name}</Typography>
        <IconButton color="inherit">
       
          <NotificationsIcon />
        </IconButton>
        <UserButton />
       
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
