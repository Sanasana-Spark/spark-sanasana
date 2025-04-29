import React from "react";
import { UserButton } from "@clerk/clerk-react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuthContext } from "../onboarding/authProvider";

const TopBar = () => {
  const { org_name } = useAuthContext();

  return (
    <div style={{ display: "flex", justifyContent:"flex-end", alignItems: "center", padding: "5px 16px" }}>


      <Typography style={{ marginRight: "16px" }}> {org_name} </Typography>

      <IconButton color="inherit" style={{ marginRight: "16px" }}>
        <NotificationsIcon />
      </IconButton>

      <UserButton />
      </div>
  );
};

export default TopBar;
