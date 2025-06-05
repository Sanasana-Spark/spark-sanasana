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

const AssetsTable = ({ trips, onViewUnitsClick }) => {
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
  const paginatedAssets = trips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <TableContainer  sx={{ height: "100%", width: "100%", overflow: "scroll",
     }} >
       <Table stickyHeader aria-label="sticky table" >
             <TableHead >
               <TableRow backgroundColor='var(--secondary-bg-color)' style={{ backgroundColor: 'var(--secondary-bg-color)' }} >
            <TableCell>Details</TableCell>
            <TableCell>LPO/Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Operator</TableCell>
            <TableCell>Vehicle</TableCell>  
            <TableCell>Origin</TableCell>           
            <TableCell>Destination</TableCell>
            <TableCell>Distance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each trip in the trips array */}
          {paginatedAssets.map((trip) => (
            <TableRow key={trip.id}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-bg-color)' }
            sx={{ border: 'none' }} 
            >


              <TableCell onClick={() => handleCellClick(trip.id)}  >
                {!isDropdownOpen[trip.id] && <Button sx={{ color:'var(--secondary-color)'}}> View </Button>}

                {isDropdownOpen[trip.id] && <Button sx={{ color:'var(--secondary-color)'}}>Back </Button>}
              </TableCell>
              <TableCell>{trip.t_type}</TableCell>
              <TableCell>{trip.t_status}</TableCell>
              <TableCell>{trip.o_name}</TableCell>
              <TableCell>{trip.a_license_plate}</TableCell>
              <TableCell>{trip.t_origin_place_query}</TableCell>
              <TableCell>{trip.t_destination_place_query}</TableCell>
              <TableCell>{trip.t_distance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={trips.length} // Total number of records
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]} // Disable option to change number of rows per page
      />

    </TableContainer>
  );
};

export default AssetsTable;
