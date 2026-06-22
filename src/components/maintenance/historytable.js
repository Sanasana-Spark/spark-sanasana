/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  TableContainer,TablePagination,
} from "@mui/material";
// import actionicon from "../../trips/actionicon.svg"

const HistoryMaintenanceTable = ({ maintenance, onViewUnitsClick }) => {
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
       <table className="data-table" >

        <thead><tr><th>Print out</th><th>Type</th><th>Description</th><th>Status</th><th>date</th><th>Vehicle</th><th>Expected Cost</th><th>Actual Cost</th><th> Insurance Coverage </th></tr></thead>
          
      
        <tbody>
          {/* Render a TableRowItem for each trip in the maintenance array */}
          {paginatedAssets.map((trip) => (
            <tr key={trip.id}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-bg-color)' }
            sx={{ border: 'none' }} 
            >


              <td onClick={() => handleCellClick(trip.id)}  >
                {!isDropdownOpen[trip.id] && <button  className="btn btn-secondary"> Preview </button>}

                {isDropdownOpen[trip.id] && <button className="btn btn-secondary">Back </button>}
              </td>
              <td>{trip.m_type}</td>
              <td>{trip.m_description}</td>
              <td>{trip.m_status}</td>
              <td> {trip.m_date ? new Date(trip.m_date).toLocaleDateString('en-GB') : '-'} </td>
              <td>{trip.m_asset_id}</td>
              <td>{trip.m_expected_cost}</td>
              <td>{trip.m_total_cost}</td>
              <td> {trip.m_insurance_coverage}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default HistoryMaintenanceTable;
