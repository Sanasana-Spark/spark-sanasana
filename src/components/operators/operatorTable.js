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
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const OperatorTable = ({ operators, onViewUnitsClick }) => {
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 7;

  // Handle row selection
  const handleSelectRow = (id) => {
    const newSelected = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    setSelected(newSelected);
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Details Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);

  // Open dialog with operator details
  const handleRowClick = (operator) => {
    setSelectedOperator(operator);
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Slice operators for pagination
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
              <TableCell>
                <Checkbox
                  checked={selected.length === operators.length}
                  onChange={() => {
                    if (selected.length === operators.length) {
                      setSelected([]);
                    } else {
                      setSelected(operators.map((operator) => operator.id));
                    }
                  }}
                />
              </TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email address</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOperators.map((operator) => (
              <TableRow key={operator.id} onClick={() => handleRowClick(operator)}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(operator.id)}
                    
                    onChange={(event) => {
                      event.stopPropagation(); // Prevent row click from firing
                      handleSelectRow(operator.id);
                    }}
                  />
                </TableCell>
                <TableCell>
                  {operator.o_image ? (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={operators.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
      />

      {/* Dialog for Operator Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Operator Details</DialogTitle>
        <DialogContent>
          {selectedOperator && (
            <div>
              <p><strong>Name:</strong> {selectedOperator.o_name}</p>
              <p><strong>Email:</strong> {selectedOperator.o_email}</p>
              <p><strong>Phone:</strong> {selectedOperator.o_phone}</p>
              <p><strong>Status:</strong> {selectedOperator.o_status}</p>
              <p><strong>Role:</strong> {selectedOperator.o_role}</p>
              <p><strong>Experience:</strong> {selectedOperator.o_expirence}</p>
              <p><strong>Mileage:</strong> {selectedOperator.o_cum_mileage}</p>
              {/* Add more details as needed */}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OperatorTable;