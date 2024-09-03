import React from "react";
import { UserButton } from "@clerk/clerk-react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Logo from "../../assets/logo.png";
import { useAuthContext } from "../onboarding/authProvider";

const TopBar = () => {
  const { org_name } = useAuthContext();

  return (
    <AppBar position="fixed">
      <Toolbar
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F6F7F8",
          color: "black",
          maxHeight: "80px",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >


        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
                    <img
            src={Logo}
            alt="logo driver"
            style={{
              maxHeight: "50px",
            }}
          />

          <Typography variant="body1" style={{ marginRight: "16px" }}>
           
          </Typography>

          <Typography>
          {org_name}
          
          <IconButton color="inherit" style={{ marginRight: "16px" }}>
            <NotificationsIcon />
          </IconButton>
          
          <UserButton />
          </Typography>

        

         

        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
