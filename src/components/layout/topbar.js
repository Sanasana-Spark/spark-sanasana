import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Profile from "../../assets/user.png"

const TopBar = () => {
  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <Avatar alt="User Name" src={Profile} style={{ margin: '0 10px' }} />
        <Typography variant="h6">Ami</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
