/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (trips && trips.length > 0) {
      setLoading(false);
    }
  }, [trips]);



  return (
    <TableContainer  sx={{ height: "100%", width: "100%", overflow: "scroll",
     }} >
       <Table stickyHeader aria-label="sticky table" >
             <TableHead >
               <TableRow backgroundColor='var(--secondary-bg-color)' style={{ backgroundColor: 'var(--secondary-bg-color)' }} >
            <TableCell>Details</TableCell>
            <TableCell>LPO/Description</TableCell>
            <TableCell>Operator</TableCell>
            <TableCell>Vehicle</TableCell>  
            <TableCell>Distance</TableCell>
            <TableCell>Odometer Distance</TableCell>
            <TableCell>Expected Duration</TableCell>
            <TableCell>Actual Duration</TableCell>
            <TableCell>Carbon Emissions</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Destination</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            loading && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Fetching trips...
                </TableCell>
              </TableRow>
            )}

          {!loading && paginatedAssets.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No trips available.
              </TableCell>
            </TableRow>
          )}

          
          {paginatedAssets.map((trip) => (
            <TableRow key={trip.id}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-bg-color)'}
              sx={{ border: 'none' }}
            >
             

              <TableCell onClick={() => handleCellClick(trip.id)}  >
                {!isDropdownOpen[trip.id] && <Button sx={{ color:'var(--secondary-color)'}}> View </Button>}

                {isDropdownOpen[trip.id] && <Button sx={{ color:'var(--secondary-color)'}}>Back </Button>}
              </TableCell>
              <TableCell>{trip.t_type}</TableCell>
              <TableCell>{trip.o_name}</TableCell>
              <TableCell>{trip.a_license_plate}</TableCell>
             
              <TableCell>{trip.t_distance}</TableCell>
              <TableCell>({trip.t_end_od_reading - trip.t_start_od_reading})</TableCell>
             <TableCell>
              {(() => {
                const match = trip.t_duration.match(/(\d+)\s*hours?\s*(\d+)\s*mins?/);
                if (match) {
                  const hours = match[1];
                  const minutes = match[2];
                  return `${hours}h ${minutes}m`;
                }
                return trip.t_duration; // fallback if format changes
              })()}
            </TableCell>
              <TableCell>
                {(() => {
                  const start = new Date(trip.t_started_at);
                  const end = new Date(trip.t_completed_at);

                  const diffMs = end - start; // milliseconds difference
                  const diffMinutes = Math.floor(diffMs / (1000 * 60));
                  const hours = Math.floor(diffMinutes / 60);
                  const minutes = diffMinutes % 60;

                  return `${hours}h ${minutes}m`;
                })()}
              </TableCell>
              <TableCell>{trip.t_carbon_emission != null ? `${trip.t_carbon_emission} kg` : '—'}</TableCell>
               <TableCell>{trip.t_origin_place_query}</TableCell>
              <TableCell>{trip.t_destination_place_query}</TableCell>
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
