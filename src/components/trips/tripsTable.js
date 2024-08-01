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
            <TableCell>LPO</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Vehicle</TableCell>  
            <TableCell>Tonnage</TableCell>           
            <TableCell>Est Distance</TableCell>
            <TableCell>Variance</TableCell>
            <TableCell>Fuel(L) </TableCell>
            <TableCell>Fuel cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each asset in the assets array */}
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell onClick={() => handleCellClick(asset.id)}>
                {!isDropdownOpen[[asset.id]] && <Button> View </Button>}

                {isDropdownOpen[asset.id] && <Button>Back </Button>}
              </TableCell>
              <TableCell>{asset.t_type}</TableCell>
              <TableCell>{asset.t_status}</TableCell>
              <TableCell>{asset.t_operator_name}</TableCell>
              <TableCell>{asset.a_license_plate}</TableCell>
              <TableCell>{asset.t_load}</TableCell>
              <TableCell>{asset.t_distance}</TableCell>
              <TableCell>{asset.t_distance}</TableCell>
              <TableCell>{asset.t_distance}</TableCell>
              <TableCell>{asset.t_est_fuel}</TableCell>
              <TableCell>{asset.t_est_cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssetsTable;
