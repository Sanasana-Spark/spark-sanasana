import React from 'react';
import { UserButton } from "@clerk/clerk-react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';

const TopBar = () => {
  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <UserButton />
        <Typography variant="h6"></Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
