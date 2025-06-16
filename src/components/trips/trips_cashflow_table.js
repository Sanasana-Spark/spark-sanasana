/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
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
  const { org_id, userId, org_currency, user_id } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [showFuelRequestForm, setShowFuelRequestForm] = useState(false);
  const [addIncomeForm, setAddIncomeForm] = useState(false);
  const [addExpenseForm, setAddExpenseForm] = useState(false);
  const [selectedtrip, setSelectedTrip] = useState({});
  const [ formData, setFormData] = useState({});
  const [page, setPage] = useState(0); // Track the current page
  const rowsPerPage = 7; // Number of records per page
  const [loading, setLoading] = useState(false);
  const [, setSuccess] = useState(null);
  const [, setError] = useState(null);
  const [clientOptions, setClientOptions] = useState([]);

  useEffect(() => {
    if (org_id && user_id) {
    const apiUrl = `${baseURL}/clients/${org_id}/${user_id}`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setClientOptions(data.clients || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }}, [ baseURL, org_id, user_id]);

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

  const handleIncomeSubmit = async () => {
    const payload = {
      ti_trip_id : selectedtrip.id,
      ti_asset_id : selectedtrip.t_asset_id,
      ti_operator_id : selectedtrip.t_operator_id,
      ti_client_id : formData.ti_client,
      ti_type: formData.ti_type,
      ti_description: formData.ti_description,
      ti_amount: formData.ti_amount,
    }
    try {
      const response = await fetch(
        `${baseURL}/trips/income/${org_id}/${userId}/${selectedtrip.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit income entry");
      }
      setSuccess("Income entry submitted successfully!");
      setAddIncomeForm(false);
    } catch (err) {
      setError(err.message);
    } finally {  
      setLoading(false);
    }
  };  


  const handleExpenseSubmit = async () => {
    const payload = {
      te_trip_id : selectedtrip.id,
      te_asset_id : selectedtrip.t_asset_id,
      te_operator_id : selectedtrip.t_operator_id,
      te_type: formData.te_type,
      te_description: formData.te_description,
      te_amount: formData.te_amount,
    }
    try {
      const response = await fetch(
        `${baseURL}/trips/expense/${org_id}/${userId}/${selectedtrip.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit income entry");
      }
      setSuccess("Income entry submitted successfully!");
      setAddExpenseForm(false);
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
    <TableContainer  sx={{ height: "100%", width: "100%", overflow: "scroll",
          backgroundColor: 'var(--main-bg-color)',
        }} >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow
            backgroundColor="var(--secondary-bg-color)"
            style={{ backgroundColor: "var(--secondary-bg-color)" }}
          >
            <TableCell>Details</TableCell>
            <TableCell>Desc</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Operator</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Total.Income ({org_currency}) </TableCell>
            <TableCell>Total.Expense ({org_currency})</TableCell>
            <TableCell>Gross Profit ({org_currency})</TableCell>
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
                {!isDropdownOpen[asset.id] && <Button sx={{ color:'var(--secondary-color)'}} > View </Button>}

                {isDropdownOpen[asset.id] && <Button sx={{ color:'var(--secondary-color)'}}>Back </Button>}
              </TableCell>
              <TableCell>{asset.t_type}</TableCell>
              <TableCell>{asset.t_status}</TableCell>
              <TableCell>{asset.o_name}</TableCell>
              <TableCell>{asset.a_license_plate}</TableCell>
              <TableCell>{asset.t_destination_place_query}</TableCell>
              <TableCell>{asset.t_income}</TableCell>
              <TableCell>{asset.t_expense}</TableCell>
              <TableCell>{asset.t_income - asset.t_expense}  </TableCell>
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

        {/* Client drop down */}
        <TextField
          select
          label="Client"
          fullWidth
          name="ti_client"
          value={formData.ti_client}
          onChange={(e) => handleChange(e)}
          margin="dense"
        >
             {clientOptions && clientOptions.length > 0 ? (
            clientOptions.map((client) => (
             
                <MenuItem key={client.id} value={client.id}>
                   {client.c_name} - {client.c_status}
                </MenuItem>
              
            ))
          ) : (
            loading && <MenuItem disabled>Loading clients...</MenuItem>
          )}
          </TextField>

      </DialogContent>

      <DialogActions>
      <Button onClick={() => setAddIncomeForm(false)}>Cancel</Button>
       
        <Button variant="contained" color="primary" onClick={handleIncomeSubmit}>
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
          <MenuItem value="Fuel">Fuel</MenuItem>
          <MenuItem value="Labour">Labour</MenuItem>
          <MenuItem value="Parking">Parking</MenuItem>
          <MenuItem value="Compliance">Compliance</MenuItem>
          <MenuItem value="Charging">Charging</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
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

       
      </DialogContent>

      <DialogActions>
      <Button onClick={() => setAddExpenseForm(false)}>Cancel</Button>
       
        <Button variant="contained" color="primary" onClick={handleExpenseSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>


    </TableContainer>
  );
};

export default AssetsTable;
