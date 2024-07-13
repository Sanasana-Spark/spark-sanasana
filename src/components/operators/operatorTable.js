/* eslint-disable react/prop-types */
import {React,useState }from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardMedia,
  Typography
} from '@mui/material'
// import actionicon from "../../operators/actionicon.svg"
import actionicon from '@mui/icons-material/Add';


const OperatorTable = ({ operators, onAddClick, onViewUnitsClick }) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(Array(operators.length).fill(false));
  const handleCellClick = (rowIndex) => {
    setIsDropdownOpen((prevState) => {
      const newDropdowns = [...prevState];
      newDropdowns[rowIndex] = !newDropdowns[rowIndex];
      return newDropdowns;
    });
  };

  const handleMenuItemClick = (action, rowIndex) => {
    setIsDropdownOpen(false); // Close dropdown after selection
    console.log(action, rowIndex)
    switch (action) {
      case "add":
        onAddClick(rowIndex);
        break;
      case "viewDetails":
        onViewUnitsClick(rowIndex);
        break;
      case "reject":
        // onDeleteClick(rowIndex);
        break;
      default:
        break;
    }
  };


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>

          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>National ID</TableCell>
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
              {!isDropdownOpen[[operator.id]] && (
                 <CardMedia
                 component="img"
                 image={actionicon}
                 alt={operator.id}
                 height="40"
                 width="40"
                 sx={{flex: "0 0 40px",  }}
               />


              )}

              {isDropdownOpen[operator.id] && (
                <>
    
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    onClick={() =>
                      handleMenuItemClick("viewDetails", operator.id)
                    }
                  >
                    view details
                  </Typography>
               
                </>
              )}
            </TableCell>
      <TableCell>{operator.o_image}</TableCell>
      <TableCell>{operator.o_national_id}</TableCell>  
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
