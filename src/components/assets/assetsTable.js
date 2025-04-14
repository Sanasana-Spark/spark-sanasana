/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  TablePagination,
} from "@mui/material";

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


  // Handle checkbox selection (can be enhanced for more complex selection logic)
  const [selected, setSelected] = useState([]);
  const handleSelectRow = (id) => {
    const newSelected = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    setSelected(newSelected);
  };

  return (
    <TableContainer >
      <Table stickyHeader aria-label="sticky table" >
        <TableHead >
          <TableRow backgroundColor='var(--secondary-bg-color)' style={{ backgroundColor: 'var(--secondary-bg-color)' }} >
            <TableCell padding="checkbox"> {/* Replace Action with Checkbox */}
              
            </TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Reg</TableCell>
            <TableCell>Status</TableCell>    
            <TableCell>Driver</TableCell>
            <TableCell>T.miles</TableCell>
            <TableCell>Make</TableCell>
            <TableCell>Model</TableCell>
           
            
            {/* Move Details button to the right */}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each asset in the assets array */}
          {paginatedAssets.map((asset) => (
            <TableRow key={asset.id}          
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-bg-color)' }
            sx={{ border: 'none' }} 
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.includes(asset.id)}
                  onChange={() => handleSelectRow(asset.id)}
                />
              </TableCell>
              <TableCell> {/* Move Details button here */}
                <Button onClick={() => handleCellClick(asset.id)}>
                  {isDropdownOpen[asset.id] ? 'Back' : 'Details'}
                </Button>
              </TableCell>
              <TableCell>{asset.a_license_plate}</TableCell>
              <TableCell>{asset.a_status}</TableCell>
              
              <TableCell> </TableCell>
              <TableCell>{asset.a_milage}</TableCell>
              <TableCell>{asset.a_make}</TableCell>
              <TableCell>{asset.a_model}-{asset.a_year}</TableCell>
            
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
