import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  Button,
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
       <TableContainer >
            <Table stickyHeader aria-label="sticky table" >
              <TableHead >
                <TableRow style={{ backgroundColor: 'var(--secondary-bg-color)' }} >
              <TableCell padding="checkbox"> </TableCell>
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
            
                <TableRow key={operator.id}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-bg-color)' }
                sx={{ border: 'none' }} 
                 >
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
                    <Button onClick={() => handleCellClick(operator.id)}>
                      {isDropdownOpen[index] ? 'Close Details' : 'Details'}
                    </Button>
                  </TableCell>
                </TableRow>

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