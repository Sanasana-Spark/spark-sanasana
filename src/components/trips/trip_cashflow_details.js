/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Loader from "../loader";
import Map from "../maps/singleTripMap";
import { useAuthContext } from '../onboarding/authProvider';

const PropCard = ({ selectedAsset }) => {
   const { org_currency } = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!selectedAsset);
  }, [selectedAsset]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {selectedAsset.map((asset) => {
        const startLat = parseFloat(asset.t_start_lat);
        const startLong = parseFloat(asset.t_start_long);
        const start = { lat: startLat, lng: startLong };
        const origin = asset.t_origin_place_query;
        const destination = asset.t_destination_place_query;

        return (
          <Box key={asset.id}
          sx={{ 
            backgroundColor: "#F9FAFB", // Light gray background
            boxShadow: 2, // Adds a slight shadow
            borderRadius: 2, // Rounded corners
            padding: 2, // Adds spacing inside
            marginBottom: 2 // Adds spacing between sections
          }}
          >
            <Typography variant="h6" fontWeight="bold">
                      {asset.a_license_plate} ({asset.a_make} - {asset.a_model})
                    </Typography>

            {/* Minimized Map */}
            <Box sx={{  marginBottom: 2 }}>
              <Map origin={origin} destination={destination} center={start} />
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
                            <TableCell>Description</TableCell>
                            <TableCell>Amount ({org_currency})</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {asset.income_list && asset.income_list.length > 0 ? (
                            asset.income_list.map((income, index) => (
                              <TableRow key={index}>
                                <TableCell>{income.date}</TableCell>
                                <TableCell>{income.amount}</TableCell>
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
                          {asset.expense_list && asset.expense_list.length > 0 ? (
                            asset.expense_list.map((expense, index) => (
                              <TableRow key={index}>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell>{expense.date}</TableCell>
                                <TableCell>{expense.amount}</TableCell>
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
                      {org_currency} {asset.income_summary || "0.00"}
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
                      {org_currency} {asset.expense_summary || "0.00"}
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
