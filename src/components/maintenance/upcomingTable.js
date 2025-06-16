/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,TablePagination,
} from "@mui/material";
// import actionicon from "../../trips/actionicon.svg"

const AssetsTable = ({ maintenance, onViewUnitsClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [page, setPage] = useState(0); // Track the current page
  const rowsPerPage = 7; // Number of records per page

  const handleCellClick = (rowIndex) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [rowIndex]: !prevState[rowIndex], // Toggle the state for the specific trip id
    }));
    onViewUnitsClick(rowIndex);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const paginatedAssets = maintenance.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <TableContainer  sx={{ height: "100%", width: "100%", overflow: "scroll",
     }} >
       <Table stickyHeader aria-label="sticky table" >
             <TableHead >
               <TableRow backgroundColor='var(--secondary-bg-color)' style={{ backgroundColor: 'var(--secondary-bg-color)' }} >
            <TableCell>Print out</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>date</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>Expected Cost</TableCell>
            <TableCell>Insurance Coverage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each trip in the maintenance array */}
          {paginatedAssets.map((trip) => (
            <TableRow key={trip.id}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-bg-color)' }
            sx={{ border: 'none' }} 
            >


              <TableCell onClick={() => handleCellClick(trip.id)}  >
                {!isDropdownOpen[trip.id] && <Button sx={{ color:'var(--secondary-color)'}}> Preview </Button>}

                {isDropdownOpen[trip.id] && <Button sx={{ color:'var(--secondary-color)'}}>Back </Button>}
              </TableCell>
              <TableCell>{trip.m_type}</TableCell>
              <TableCell>{trip.m_description}</TableCell>
              <TableCell>{trip.m_status}</TableCell>
              <TableCell> {trip.m_date ? new Date(trip.m_date).toLocaleDateString('en-GB') : '-'} </TableCell>
              <TableCell>{trip.m_asset_id}</TableCell>
              <TableCell>{trip.m_total_cost}</TableCell>
              <TableCell> {trip.m_insurance_coverage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={maintenance.length} // Total number of records
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]} // Disable option to change number of rows per page
      />

    </TableContainer>
  );
};

export default AssetsTable;
