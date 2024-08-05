/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material'


const OperatorTable = ({ operators, onViewUnitsClick }) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(Array(operators.length).fill(false));
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
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Position </TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Miles</TableCell>
            <TableCell>License Expiry </TableCell>
            
           
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each operator in the operators array */}
          {operators.map((operator) => (
            <TableRow key={operator.id}>
              <TableCell onClick={() => handleCellClick(operator.id)}>
                {!isDropdownOpen[[operator.id]] && <Button> Details </Button>}

                {isDropdownOpen[operator.id] && <Button>Back </Button>}
              </TableCell>
              <TableCell>
                {operator.a_image ? (
                  <img
                    src={operator.o_image}
                    alt={operator.o_name}
                    style={{ width: "100px", height: "auto" }}
                  />
                ) : (
                  "No Image"
                )}
              </TableCell>
      <TableCell>{operator.o_name}</TableCell>
      <TableCell>{operator.o_email}</TableCell> 
      <TableCell>{operator.o_status}</TableCell>
      <TableCell>{operator.o_role}</TableCell>
      <TableCell>{operator.o_phone}</TableCell>
      <TableCell>{operator.o_cum_mileage}</TableCell>
      <TableCell>{operator.o_lincense_expiry}</TableCell>
     
    
    </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OperatorTable;
