/* eslint-disable react/prop-types */
import React from 'react';
import { Search } from "@mui/icons-material";
import { Typography, Box, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload"


export const ActionNav = ({ icons, onAddClick, icontitle, bulktitle, onSecondClick }) => {
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
   <Box>
          {icons.map((icon, index) => (
            <IconButton key={index}>{icon}</IconButton>
          ))}
        </Box>

        </Box>
     
        <Box display="flex" id="inner3">

                       {/* Bulk Button */}
                       <IconButton
            onClick={onSecondClick}
            sx={{
              border: "1px solid #01947A", // Change color for differentiation
              borderRadius: "4px",
              padding: "4.5px",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 32,
                backgroundColor: "#01947A", // Different color
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <UploadIcon sx={{ fontSize: 20, color: "white" }} />
            </Box>
            <Typography
              sx={{ color: "#01947A", fontWeight: "bold", marginLeft: "8px" }}
            >
              {bulktitle}
            </Typography>
          </IconButton>


          {/* Add button  */}
          <IconButton
            onClick={onAddClick}
            sx={{
              border: "1px solid #047A9A",
              borderRadius: " 4px",
              padding: "4.5px",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 32,
                backgroundColor: "#047A9A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AddIcon sx={{ fontSize: 20, color: "white" }} />
            </Box>
            <Typography
              sx={{ color: "#047A9A", fontWeight: "bold", marginLeft: "8px" }}
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
