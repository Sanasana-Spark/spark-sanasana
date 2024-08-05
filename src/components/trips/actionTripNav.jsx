/* eslint-disable react/prop-types */
import React from 'react';
import { Search } from "@mui/icons-material";
import { Typography, Box, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export const ActionNav = ({ icons, onAddClick, icontitle }) => {
  return (
    <Box className="actionNav" id="top">
      <Box
        display="flex"
        justifyContent="space-between"
        id="subparent"
        width="100%"
      >
       
        <Box
          sx={{ display: "flex", alignItems: "center", marginRight: "0px" }}
          id="inner1"
        >
           {/* Search Box */}
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#047A9A",
              padding: "8px",
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px",
            }}
          >
            <Search sx={{ color: "white" }} />
          </Box>
   {/* Icons */}
   
          {icons.map((icon, index) => (
            <Box>
            <IconButton key={index}> {icon}</IconButton>
            </Box>
          ))}
      

        </Box>
     
        <Box display="flex" id="inner3">
          {/* Add button  */}
          <IconButton
            onClick={onAddClick}
            sx={{
              border: "1px solid #047A9A",
              borderRadius: " 50px",
              padding: "4.5px",
              backgroundColor: "#047A9A",
            }}
          >
            <AddIcon sx={{ fontSize: 20, color: "white" }} />

            <Typography
              sx={{ color: "white", fontWeight: "normal", marginLeft: "5px" }}
            >
              {icontitle}
            </Typography>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ActionNav;
