/* eslint-disable no-undef */
import React from 'react';
import { Container, Grid, Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Pagination } from '@mui/material';



const data = [
  { vehicle: 'TN-323', date: '08/05/2024', volume: 10, price: '$3.5990', type: 'Diesel', vendor: 'Total Energies', usage: '247.0' },
  // Add more data as needed
];


const Fuel = () => {
  return (
    <>
      {
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>Fuel history</Typography>
            <Typography variant="subtitle1">Manage all your fuel transactions in one place</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Total Fuel Cost (USD)</Typography>
                <Typography variant="h4">7,265</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E5ECF6', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Total Volume (gallons)</Typography>
                <Typography variant="h4">3,671</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Avg. Fuel Economy (MPG)</Typography>
                <Typography variant="h4">156</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E5ECF6', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Avg. Fuel Economy (hrs)</Typography>
                <Typography variant="h4">2,318</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2.4}>
              <Paper sx={{ backgroundColor:'#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
                <Typography variant="h6">Avg. Cost Per Gallon</Typography>
                <Typography variant="h4">2,318</Typography>
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
                  <TableCell>Volume (gallons)</TableCell>
                  <TableCell>Fuel Price/gallon</TableCell>
                  <TableCell>Fuel Type</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Usage/mile</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox />
                      {row.vehicle}
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.volume}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.usage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox />
                      {row.vehicle}
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.volume}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.usage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox />
                      {row.vehicle}
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.volume}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.usage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox />
                      {row.vehicle}
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.volume}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.usage}</TableCell>
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