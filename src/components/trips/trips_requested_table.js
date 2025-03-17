/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,TextField,
  Typography
} from "@mui/material";
import { useAuthContext } from "../onboarding/authProvider";
// import actionicon from "../../assets/actionicon.svg"

const AssetsTable = ({ assets, onViewUnitsClick }) => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, userId } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [showFuelRequestForm, setShowFuelRequestForm] = useState(false);
  const [selectedtrip, setSelectedTrip] = useState({});
  const [ formData, setFormData] = useState({});
  const [page, setPage] = useState(0); // Track the current page
  const rowsPerPage = 7; // Number of records per page
  const [, setLoading] = useState(false);
  const [, setSuccess] = useState(null);
  const [, setError] = useState(null);

  const handleCellClick = (rowIndex) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [rowIndex]: !prevState[rowIndex], // Toggle the state for the specific asset id
    }));
    onViewUnitsClick(rowIndex);
  };

  const handleRequestClick = (trip) => {
    setShowFuelRequestForm(true);
    setSelectedTrip(trip);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,  // Store file object properly
    }));
  
    e.stopPropagation(); // Prevent unexpected closing behavior
  };

  const handleSubmit = async () => {
  console.log(formData);
    const payload = {
      t_id : selectedtrip.id,
      a_fuel_type: selectedtrip.a_fuel_type,
      t_actual_cost : formData.t_actual_cost,
      // image : formData.image
    }

    try {
      const response = await fetch(
        `${baseURL}/trips/approve_request/${org_id}/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit odometer reading");
      }

      setSuccess("Odometer reading submitted successfully!");
      setShowFuelRequestForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const paginatedAssets = assets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow
            backgroundColor="var(--secondary-bg-color)"
            style={{ backgroundColor: "var(--secondary-bg-color)" }}
          >
            <TableCell>Details</TableCell>
            <TableCell>LPO</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Operator</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Distance</TableCell>
            <TableCell>Fuel cost</TableCell>
            <TableCell> Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each asset in the assets array */}
          {paginatedAssets.map((asset) => (
            <TableRow
              key={asset.id}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--secondary-bg-color)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--main-bg-color)")
              }
              sx={{ border: "none" }}
            >
              <TableCell onClick={() => handleCellClick(asset.id)}>
                {!isDropdownOpen[asset.id] && <Button> View </Button>}

                {isDropdownOpen[asset.id] && <Button>Back </Button>}
              </TableCell>
              <TableCell>{asset.t_type}</TableCell>
              <TableCell>{asset.t_status}</TableCell>
              <TableCell>{asset.o_name}</TableCell>
              <TableCell>{asset.a_license_plate}</TableCell>
              <TableCell>{asset.t_origin_place_query}</TableCell>
              <TableCell>{asset.t_destination_place_query}</TableCell>
              <TableCell>{asset.t_distance}</TableCell>
              <TableCell>{asset.t_actual_cost}</TableCell>
              <TableCell onClick={() => handleRequestClick(asset)}>
                <Button> Approve </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={assets.length} // Total number of records
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]} // Disable option to change number of rows per page
      />

      <Dialog open={showFuelRequestForm} fullWidth>
        <DialogTitle>Approve Request</DialogTitle>
        <DialogContent>
          <Typography> This is a fuel request by {selectedtrip.o_name} for asset {selectedtrip.a_license_plate} </Typography>
          <Typography>Distance: {selectedtrip.t_distance} </Typography>
          
          <TextField
            label="Amt disbursed"
            variant="outlined"
            type="number"
            fullWidth
            sx={{ marginTop: 2 }}
            name="t_actual_cost"
            value={formData.t_actual_cost}
            onChange={(e) => handleChange(e)}
          />
          {/* <input
  type="file"
  name="image"
  onChange={handleChange}
  style={{ marginTop: '10px', display: 'block' }} 
/> */}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowFuelRequestForm(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default AssetsTable;
