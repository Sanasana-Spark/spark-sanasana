import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuthContext } from "../components/onboarding/authProvider";

const Fuel = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, org_currency, user_id } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [fuelEntries, setFuelEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [paginatedEntries, setPaginatedEntries] = useState([]);
  console.log(loading);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (org_id && user_id) {
      const apiUrl = `${baseURL}/fuel/${org_id}/${user_id}`;
      // to be corrected to dynamic
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setFuelEntries(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [baseURL, org_id, user_id]);

  //Implementing  Filter & Search Logic
  useEffect(() => {
    setTotalPages(Math.ceil(fuelEntries.length / itemsPerPage));
    setPaginatedEntries(
      fuelEntries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
  }, [fuelEntries, currentPage, itemsPerPage]);

  const TotalMileage = fuelEntries
    .reduce((sum, entry) => sum + parseFloat(entry.f_distance), 0)
    .toFixed(2);
  const TotalRequests = fuelEntries.length;
  const avgCostPerGallon = 0;
  const totalLitres = fuelEntries
    .reduce((sum, entry) => sum + entry.f_litres, 0)
    .toFixed(2);
  const totalFuelCost = fuelEntries.reduce(
    (sum, entry) => sum + entry.f_total_cost,
    0
  );

  return (
    <>
      {
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}
              gutterBottom
            >
              Fuel history
            </Typography>
            <Typography variant="h6">
              Manage all your fuel transactions in one place
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              mb: 3,
              backgroundColor: "none",
              p: 2,
              border: "none",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                borderRadius: 1,
                flex: 1,
                maxWidth: "400px",
                maxHeight: "40px",
              }}
            />
            <TextField
              variant="outlined"
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1, maxHeight: "40px" }}
            />
            <TextField
              variant="outlined"
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1, maxHeight: "40px" }}
            />
            <TextField
              select
              variant="outlined"
              label="Vehicle"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              sx={{ borderRadius: 1, minWidth: "200px" }}
            >
              <MenuItem value="">All Vehicles</MenuItem>
              {[
                ...new Set(fuelEntries.map((entry) => entry.a_license_plate)),
              ].map((plate) => (
                <MenuItem key={plate} value={plate}>
                  {plate}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={2.4}>
              <Paper
                sx={{
                  backgroundColor: "#E3F5FF",
                  padding: 2,
                  textAlign: "center",
                  color: "text.secondary",
                  height: "100%",
                }}
              >
                <Typography variant="h6">Total Fuel Cost </Typography>
                <Typography variant="h4">
                  {org_currency}
                  {totalFuelCost}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper
                sx={{
                  backgroundColor: "#E5ECF6",
                  padding: 2,
                  textAlign: "center",
                  color: "text.secondary",
                  height: "100%",
                }}
              >
                <Typography variant="h6">Total Fuel (Litres)</Typography>
                <Typography variant="h4">{totalLitres}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper
                sx={{
                  backgroundColor: "#E3F5FF",
                  padding: 2,
                  textAlign: "center",
                  color: "text.secondary",
                  height: "100%",
                }}
              >
                <Typography variant="h6">Total Mileage(km)</Typography>
                <Typography variant="h4">{TotalMileage}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper
                sx={{
                  backgroundColor: "#E5ECF6",
                  padding: 2,
                  textAlign: "center",
                  color: "text.secondary",
                  height: "100%",
                }}
              >
                <Typography variant="h6">Total Request</Typography>
                <Typography variant="h4">{TotalRequests}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper
                sx={{
                  backgroundColor: "#E3F5FF",
                  padding: 2,
                  textAlign: "center",
                  color: "text.secondary",
                  height: "100%",
                }}
              >
                <Typography variant="h6">Avg.....</Typography>
                <Typography variant="h4">
                  {org_currency}
                  {avgCostPerGallon}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          {/* <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
						<Button variant='contained' color='primary'>
							Add fuel entry
						</Button>
						<Box>
							<Button variant='outlined' sx={{ mr: 2 }}>
								Filter by
							</Button>
							<Button variant='outlined'>Edit</Button>
						</Box>
					</Box> */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Reg-No
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Operator
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Distance
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Fuel Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Litres
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Total Cost
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    L/100km
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedEntries.length > 0 ? (
                  paginatedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell sx={{ border: "none" }}>
                        {entry.a_license_plate}
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        {entry.o_name}
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        {entry.f_distance}
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        {entry.a_fuel_type}
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        {entry.f_litres.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        {entry.f_total_cost}
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        {entry.f_litres > 0
                          ? (
                              parseFloat(entry.f_distance) / entry.f_litres
                            ).toFixed(2)
                          : "N/A"}
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        {" "}
                        {new Date(entry.f_created_at).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        </Container>
      }
      ;
    </>
  );
};

export default Fuel;
