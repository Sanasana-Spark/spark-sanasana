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


const AssetsTable = ({ assets, onAddClick, onViewUnitsClick }) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(Array(assets.length).fill(false));
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
            <TableCell>Action</TableCell>
            <TableCell>Plate</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Make</TableCell>
            <TableCell>Model </TableCell>
            <TableCell>Fuel type</TableCell>
            <TableCell>Engine size</TableCell>
            <TableCell>Efficiency </TableCell>
            <TableCell>Dep</TableCell>
            
           
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each asset in the assets array */}
          {assets.map((asset) => (
                <TableRow key={asset.id}>

       <TableCell onClick={() => handleCellClick(asset.id)}>
              {!isDropdownOpen[[asset.id]] && (
                 <CardMedia
                 component="img"
                 image={actionicon}
                 alt={asset.id}
                 height="40"
                 width="40"
                 sx={{flex: "0 0 40px",  }}
               />


              )}

              {isDropdownOpen[asset.id] && (
                <>
    
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    onClick={() =>
                      handleMenuItemClick("viewDetails", asset.id)
                    }
                  >
                    view details
                  </Typography>
               
                </>
              )}
            </TableCell>
      <TableCell>{asset.a_image}</TableCell>
      <TableCell>{asset.a_license_plate}</TableCell>  
      <TableCell>{asset.a_status}</TableCell>
      <TableCell>{asset.a_make}</TableCell>
      <TableCell>{asset.a_model}</TableCell>
      <TableCell>{asset.a_fuel_type}</TableCell>
      <TableCell>{asset.a_engine_size}</TableCell>
      <TableCell>{asset.a_efficiency_rate}</TableCell>
      <TableCell>{asset.a_accumulated_dep}</TableCell>
    
    </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssetsTable;
