/* eslint-disable react/prop-types */
import React, {  useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
} from "@mui/material";
// import actionicon from "../../assets/actionicon.svg"

const AssetsTable = ({ assets, onViewUnitsClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(
    Array(assets.length).fill(false)
  );

  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const rowsPerPage = 7; // Define number of rows per page

  const handleCellClick = (rowIndex) => {
    setIsDropdownOpen((prevState) => {
      const newDropdowns = [...prevState];
      newDropdowns[rowIndex] = !newDropdowns[rowIndex];
      return newDropdowns;
    });
    onViewUnitsClick(rowIndex);
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedAssets = assets.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
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
      

      {/* Pagination Component */}
      <TablePagination
        rowsPerPageOptions={[]} // Hide the rows per page options
        component="div"
        count={assets.length} // Total number of assets
        rowsPerPage={rowsPerPage} // Rows per page
        page={currentPage} // Current page
        onPageChange={handleChangePage} // Page change handler
      />
    </TableContainer>
  );
};

export default AssetsTable;
