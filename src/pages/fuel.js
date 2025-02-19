/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination } from '@mui/material';
import { useAuthContext } from '../components/onboarding/authProvider';


const Fuel = () => {
  const baseURL = process.env.REACT_APP_BASE_URL
  const { user_id} = useAuthContext();
  const { org_id } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [fuelEntries, setFuelEntries] = useState([]);
  console.log(loading)

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
  }}, [baseURL, org_id, user_id]);


  const avgFuelEconomyMPG = 0 ;
  const avgFuelEconomyHrs = 0;
  const avgCostPerGallon = 0; 
  const totalLitres = fuelEntries.reduce((sum, entry) => sum + entry.f_litres, 0).toFixed(2);
  const totalFuelCost = fuelEntries.reduce((sum, entry) => sum + entry.f_total_cost, 0);


  return (
    <>
      {
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold'}}  gutterBottom>Fuel history</Typography>
            <Typography variant="h6">Manage all your fuel transactions in one place</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Total Fuel Cost </Typography>
                <Typography variant="h4">${totalFuelCost}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E5ECF6', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Total Volume (Litres)</Typography>
                <Typography variant="h4">{totalLitres}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Avg. Fuel Economy (Km/L)</Typography>
                <Typography variant="h4">{avgFuelEconomyMPG}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E5ECF6', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Avg. Fuel Economy (hrs)</Typography>
                <Typography variant="h4">{avgFuelEconomyHrs}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Avg. Cost Per Litre</Typography>
                <Typography variant="h4">${avgCostPerGallon}</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary">Add fuel entry</Button>
            <Box>
              <Button variant="outlined" sx={{ mr: 2 }}>Filter by</Button>
              <Button variant="outlined">Edit</Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Volume (Litres)</TableCell>
                  <TableCell>Fuel Price/Litre</TableCell>
                  <TableCell>Fuel Type</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Distance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
               {fuelEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.f_license_plate}</TableCell>
                      <TableCell>{entry.f_created_at}</TableCell>
                      <TableCell>{entry.f_litres}</TableCell>
                      <TableCell>${entry.f_total_cost}</TableCell>
                      <TableCell>{entry.f_type}</TableCell>
                      <TableCell>{entry.f_vendor}</TableCell>
                      <TableCell>{entry.f_distance}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              
              
              
            </Table>
          </TableContainer>
          <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination count={2} />
          </Box>
        </Container>
  


      

     
    }; 
    </>

  )
}

export default Fuel