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
  Typography,
  MenuItem
} from "@mui/material";
import { useAuthContext } from "../onboarding/authProvider";
// import actionicon from "../../assets/actionicon.svg"

const AssetsTable = ({ assets, onViewUnitsClick }) => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, userId } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [showFuelRequestForm, setShowFuelRequestForm] = useState(false);
  const [addIncomeForm, setAddIncomeForm] = useState(false);
  const [addExpenseForm, setAddExpenseForm] = useState(false);
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

  const handleAddIncome = (trip) => {
    setAddIncomeForm(true);
    setSelectedTrip(trip);
  };

  const handleAddExpense = (trip) => {
    setAddExpenseForm(true);
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
            <TableCell>Destination</TableCell>
            <TableCell>T.Income</TableCell>
            <TableCell>T.Expense</TableCell>
            <TableCell>Gross Profit</TableCell>
            <TableCell> Action</TableCell>
            <TableCell> Income</TableCell>
            <TableCell> Expense</TableCell>
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
              <TableCell>{asset.t_destination_place_query}</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell>0</TableCell>
              <TableCell onClick={() => handleRequestClick(asset)}>
                <Button> Approve </Button>
              </TableCell>

              <TableCell onClick={() => handleAddIncome(asset)}>
                <Button
                sx={{
                  borderRadius: "4px",
                  fontSize: "0.65rem",  // Smaller text
                  padding: "4px 8px",   // Smaller padding
                  minWidth: "auto",     // Avoids default button width
                  backgroundColor: "var(--secondary-color)", 
                  color: "white",        // Ensure text is visible
                  "&:hover": {
                    backgroundColor:"rgb(119, 237, 215)", // Darker on hover
                  },
                }}
                
                > Add Income  </Button>
              </TableCell>

              <TableCell onClick={() => handleAddExpense(asset)}>
                <Button
                sx={{
                  borderRadius: "4px",
                  fontSize: "0.65rem",  // Smaller text
                  padding: "4px 8px",   // Smaller padding
                  minWidth: "auto",     // Avoids default button width
                  backgroundColor: "var(--primary-color)", 
                  color: "white",        // Ensure text is visible
                  "&:hover": {
                    backgroundColor:"rgb(89, 210, 244)", // Darker on hover
                  },
                }}
                > Add Expense </Button>
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
        
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowFuelRequestForm(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>



      <Dialog open={addIncomeForm} fullWidth>
      <DialogTitle>Add Income</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          This is an entry for income generated  relating to asset{" "}
          {selectedtrip.a_license_plate} while with {selectedtrip.o_name}.
        </Typography>

        {/* Income Type Dropdown */}
        <TextField
          select
          label="Income Type"
          fullWidth
          name="ti_type"
          value={formData.ti_type}
          onChange={(e) => handleChange(e)}
          margin="dense"
          required
        >
          <MenuItem value="Rental">Rental</MenuItem>
          <MenuItem value="Service">Service</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          name="ti_description"
          value={formData.ti_description}
          onChange={(e) => handleChange(e)}
          margin="dense"
          multiline
          rows={2}
        />

        {/* Amount */}
        <TextField
          label="Amount"
          type="number"
          fullWidth
          name="ti_amount"
          value={formData.ti_amount}
          onChange={(e) => handleChange(e)}
          margin="dense"
          required
        />

        {/* Client */}
        <TextField
          label="Client"
          fullWidth
          name="ti_client"
          value={formData.ti_client}
          onChange={(e) => handleChange(e)}
          margin="dense"
          required
        />
      </DialogContent>

      <DialogActions>
      <Button onClick={() => setAddIncomeForm(false)}>Cancel</Button>
       
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>


    <Dialog open={addExpenseForm} fullWidth>
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          This is an entry for expense incurred relating to asset{" "}
          {selectedtrip.a_license_plate} while with {selectedtrip.o_name}.
        </Typography>

        {/* Income Type Dropdown */}
        <TextField
          select
          label="Expense Type"
          fullWidth
          name="te_type"
          value={formData.te_type}
          onChange={(e) => handleChange(e)}
          margin="dense"
          required
        >
          <MenuItem value="Rental">Fuel</MenuItem>
          <MenuItem value="Service">Charging</MenuItem>
          <MenuItem value="Other">Labour</MenuItem>
          <MenuItem value="Other">Parking</MenuItem>
          <MenuItem value="Other">Compliance</MenuItem>
        </TextField>

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          name="te_description"
          value={formData.te_description}
          onChange={(e) => handleChange(e)}
          margin="dense"
          multiline
          rows={2}
        />

        {/* Amount */}
        <TextField
          label="Amount"
          type="number"
          fullWidth
          name="te_amount"
          value={formData.te_amount}
          onChange={(e) => handleChange(e)}
          margin="dense"
          required
        />

        {/* Client */}
        <TextField
          label="Client"
          fullWidth
          name="ti_client"
          value={formData.te_client}
          onChange={(e) => handleChange(e)}
          margin="dense"
          required
        />
      </DialogContent>

      <DialogActions>
      <Button onClick={() => setAddExpenseForm(false)}>Cancel</Button>
       
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>


    </TableContainer>
  );
};

export default AssetsTable;
