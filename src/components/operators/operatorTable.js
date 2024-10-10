import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Button,
  Collapse,  // New for showing details
} from '@mui/material';

const OperatorTable = ({ operators, onViewUnitsClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(Array(operators.length).fill(false));
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 7;

  // Handle row click to toggle details
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

  // Handle row selection
  const [selected, setSelected] = useState([]);
  const handleSelectRow = (id) => {
    const newSelected = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    setSelected(newSelected);
  };

  // Paginate the operators data
  const paginatedOperators = operators.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email address</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOperators.map((operator, index) => (
              <React.Fragment key={operator.id}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(operator.id)}
                      onChange={() => handleSelectRow(operator.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {operator.a_image ? (
                      <img
                        src={operator.o_image}
                        alt={operator.o_name}
                        style={{ width: '100px', height: 'auto' }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>{operator.o_name}</TableCell>
                  <TableCell>{operator.o_email}</TableCell>
                  <TableCell>{operator.o_role}</TableCell>
                  <TableCell>{operator.o_phone}</TableCell>
                  <TableCell>{operator.o_status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleCellClick(index)}>
                      {isDropdownOpen[index] ? 'Close Details' : 'View Details'}
                    </Button>
                  </TableCell>
                </TableRow>
                
                {/* Collapsible details section */}
                <TableRow>
                  <TableCell colSpan={7} style={{ padding: 0 }}>
                    <Collapse in={isDropdownOpen[index]} timeout="auto" unmountOnExit>
                      <div style={{ padding: '16px' }}>
                        <p><strong>Name:</strong> {operator.o_name}</p>
                        <p><strong>Email:</strong> {operator.o_email}</p>
                        <p><strong>Phone:</strong> {operator.o_phone}</p>
                        <p><strong>Status:</strong> {operator.o_status}</p>
                        <p><strong>Role:</strong> {operator.o_role}</p>
                        <p><strong>Experience:</strong> {operator.o_expirence}</p>
                        <p><strong>Mileage:</strong> {operator.o_cum_mileage}</p>
                        {/* Add more fields if necessary */}
                      </div>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={operators.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
      />
    </>
  );
};

export default OperatorTable;