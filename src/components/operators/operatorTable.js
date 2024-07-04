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
// import actionicon from "../../assets/actionicon.svg"
import actionicon from '@mui/icons-material/Add';


const OperatorTable = ({ properties, onAddClick, onViewUnitsClick }) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(Array(properties.length).fill(false));
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
            <TableCell>License </TableCell>
            
           
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each property in the properties array */}
          {properties.map((property) => (
                <TableRow key={property.p_id}>

       <TableCell onClick={() => handleCellClick(property.p_id)}>
              {!isDropdownOpen[[property.p_id]] && (
                 <CardMedia
                 component="img"
                 image={actionicon}
                 alt={property.p_id}
                 height="40"
                 width="40"
                 sx={{flex: "0 0 40px",  }}
               />


              )}

              {isDropdownOpen[property.p_id] && (
                <>
    
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    onClick={() =>
                      handleMenuItemClick("viewDetails", property.p_id)
                    }
                  >
                    view details
                  </Typography>
               
                </>
              )}
            </TableCell>
      <TableCell>{property.p_name}</TableCell>
      <TableCell>{property.p_num_units}</TableCell>
      <TableCell>{property.p_city}</TableCell>
      <TableCell>{property.p_num_units}</TableCell>
      <TableCell>{property.p_num_units}</TableCell>
      <TableCell>{property.p_num_units}</TableCell>
      <TableCell>{property.p_num_units}</TableCell>
      <TableCell>{property.p_num_units}</TableCell>
    
    </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OperatorTable;
