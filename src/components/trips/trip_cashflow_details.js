/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Loader from "../loader";
import Map from "../maps/singleTripMarkedMap";
import { useAuthContext } from '../onboarding/authProvider';

const PropCard = ({ selectedTrip }) => {
  const baseURL = process.env.REACT_APP_BASE_URL
  const {org_id, user_id , org_currency } = useAuthContext();
  const [tripIncome, setTripIncome] = useState([]);
  const [tripExpense, setTripExpense] = useState([]);
  const [tripSummary, setTripSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const trip_id  = selectedTrip[0]?.id;

  useEffect(() => {
      if (org_id && user_id && trip_id) {
      fetch(`${baseURL}/trips/income/${org_id}/${user_id}/${trip_id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setTripIncome(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }},[baseURL,org_id, user_id, trip_id] );

    useEffect(() => {
      if (org_id && user_id && trip_id) {
      fetch(`${baseURL}/trips/expense/${org_id}/${user_id}/${trip_id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setTripExpense(data);

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }},[baseURL,org_id, user_id, trip_id] );

  // Calculate income, expense, and profit summaries
  // when tripIncome or tripExpense changes
  // and when org_id, user_id, and trip_id are available
  // This ensures that the summaries are updated whenever the data changes
  // and that the calculations are only done when the necessary data is available
  // This is a good practice to avoid unnecessary calculations
  // and to ensure that the component behaves correctly
  useEffect(() => {
    if (org_id && user_id && trip_id) {
      setTripSummary((prevSummary) => ({
        ...prevSummary,
        income_summary: tripIncome.reduce((acc, item) => acc + parseFloat(item.ti_amount), 0),
        expense_summary: tripExpense.reduce((acc, item) => acc + parseFloat(item.te_amount), 0),
        profit_summary: tripIncome.reduce((acc, item) => acc + parseFloat(item.ti_amount), 0) - tripExpense.reduce((acc, item) => acc + parseFloat(item.te_amount), 0),
      }));
    }
  }, [org_id, user_id, trip_id, tripIncome, tripExpense]);


  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {selectedTrip.map((trip) => {
        const startLat = parseFloat(trip.t_start_lat);
        const startLong = parseFloat(trip.t_start_long);
        const start = { lat: startLat, lng: startLong };
        const origin = trip.t_origin_place_query;
        const destination = trip.t_destination_place_query;

        return (
          <Box key={trip.id}
          sx={{ 
            backgroundColor: "#F9FAFB", // Light gray background
            boxShadow: 2, // Adds a slight shadow
            borderRadius: 2, // Rounded corners
            padding: 2, // Adds spacing inside
            marginBottom: 2 // Adds spacing between sections
          }}
          >
            <Typography variant="h6" fontWeight="bold">
                      {trip.a_license_plate} ({trip.a_make} - {trip.a_model})
                    </Typography>

            {/* Minimized Map */}
            <Box sx={{  marginBottom: 2 }}>
              <Map origin={origin} destination={destination} center={start} tripid={trip.id} />
            </Box>

            <Grid container spacing={2}>
             
              {/* Income Listing */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">Income</Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                          <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount ({org_currency})</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tripIncome && tripIncome.length > 0 ? (
                            tripIncome.map((income) => (
                              <TableRow key={income.id}>
                                <TableCell>{income.ti_type}</TableCell>
                                <TableCell>{income.ti_description}</TableCell>
                                <TableCell>{income.ti_amount}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={2} align="center">No income records</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Expense Listing */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">Expenses</Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount ({org_currency})</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tripExpense && tripExpense.length > 0 ? (
                            tripExpense.map((expense) => (
                              <TableRow key={expense.id}>
                                <TableCell>{expense.te_type}</TableCell>
                                <TableCell>{expense.te_description}</TableCell>
                                <TableCell>{expense.te_amount}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} align="center">No expense records</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>



              {/* Income & Expense Summary Cards */}
              <Grid item xs={12} md={3}>
                <Card sx={{ backgroundColor: "#ECFDF5", textAlign: "center" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      Income
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="green">
                      {org_currency} {tripSummary.income_summary || "0.00"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ backgroundColor: "#FEE2E2", textAlign: "center" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      Expenses
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="red">
                      {org_currency} {tripSummary.expense_summary || "0.00"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>


              <Grid item xs={12} md={3}>
                <Card sx={{ backgroundColor: "#ECFDF5", textAlign: "center" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      Gross Profit
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="green">
                      {org_currency} {tripSummary.profit_summary|| "0.00"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>



            </Grid>
          </Box>
        );
      })}
    </div>
  );
};

export default PropCard;
