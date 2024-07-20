/* eslint-disable react/prop-types */
import { React, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
// import actionicon from "../../assets/actionicon.svg"

const AssetsTable = ({ assets, onViewUnitsClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(
    Array(assets.length).fill(false)
  );
  const handleCellClick = (rowIndex) => {
    setIsDropdownOpen((prevState) => {
      const newDropdowns = [...prevState];
      newDropdowns[rowIndex] = !newDropdowns[rowIndex];
      return newDropdowns;
    });
    onViewUnitsClick(rowIndex);
  };


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Plate</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Make</TableCell>
            <TableCell>Model </TableCell>
            <TableCell>Fuel type</TableCell>
            <TableCell>Engine size</TableCell>
            <TableCell>Efficiency </TableCell>
            <TableCell>Dep</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each asset in the assets array */}
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell onClick={() => handleCellClick(asset.id)}>
                {!isDropdownOpen[[asset.id]] && <Button> Details </Button>}

                {isDropdownOpen[asset.id] && <Button>Back </Button>}
              </TableCell>
              <TableCell>
                {asset.a_image ? (
                  <img
                    src={asset.a_image}
                    alt={asset.a_license_plate}
                    style={{ width: "100px", height: "auto" }}
                  />
                ) : (
                  "No Image"
                )}
              </TableCell>
              <TableCell>{asset.a_license_plate}</TableCell>
              <TableCell>{asset.a_status}</TableCell>
              <TableCell>{asset.a_make}</TableCell>
              <TableCell>{asset.a_model}</TableCell>
              <TableCell>{asset.a_fuel_type}</TableCell>
              <TableCell>{asset.a_engine_size}</TableCell>
              <TableCell>{asset.a_efficiency_rate}</TableCell>
              <TableCell>{asset.a_accumulated_dep}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssetsTable;
