import React from 'react';
import { Container, Grid, Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const data = [
  { vehicle: 'TN-323', date: '08/05/2024', volume: 10, price: '$3.5990', type: 'Diesel', vendor: 'Total Energies', usage: '247.0' },
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 15 },
  { name: 'Mar', value: 10 },
  { name: 'Apr', value: 10 },
  { name: 'May', value: 20 },
  { name: 'Jun', value: 25 },
  // Add more data as needed
];

const containerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: 5.6037,
  lng: -0.1870,
};

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={2.9}>
          <Paper sx={{ backgroundColor: '#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="h6">Total Assets</Typography>
            <Typography variant="h4">700</Typography>
          </Paper>
        </Grid>
        <Grid item xs={2.9}>
          <Paper sx={{ backgroundColor: '#E5ECF6', padding: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="h6">Overall Assets Value</Typography>
            <Typography variant="h4">$3,671</Typography>
          </Paper>
        </Grid>
        <Grid item xs={2.9}>
          <Paper sx={{ backgroundColor: '#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="h6">Total Fuel Cost</Typography>
            <Typography variant="h4">$1,500</Typography>
          </Paper>
        </Grid>
        <Grid item xs={2.9}>
          <Paper sx={{ backgroundColor: '#E5ECF6', padding: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="h6">Carbon Reduction</Typography>
            <Typography variant="h4">300 kWh</Typography>
          </Paper>
        </Grid>
      </Grid>


      <Box sx={{ my: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={7.5}>
            <Paper sx={{ padding: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ marginRight: 2 }}>Fuel used</Typography>
                <Typography variant="body2" sx={{ marginRight: 2 }}>Estimated</Typography>
                <Typography variant="body2" sx={{ marginRight: 2 }}>Operating fuel</Typography>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#000', borderRadius: '50%', marginRight: 2 }}></Box>
                <Typography variant="body2" sx={{ marginRight: 2 }}>This year</Typography>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#82ca9d', borderRadius: '50%' }}></Box>
                <Typography variant="body2" sx={{ marginRight: 2 }}>Last year</Typography>
              </Box>

              <LineChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </Paper>
          </Grid>
          <Grid item xs={4.1}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Upcoming Trips</Typography>
              <List>
                {['Truck 1', 'Truck 2', 'Truck 3', 'Truck 4', 'Truck 5', 'Truck 6'].map((truck, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={truck} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>



        <Grid container spacing={3}>
          <Grid item xs={11.6}>
            <Box sx={{ my: 4, height: 300, backgroundColor: '#f5f5f5', borderRadius: 1, position: 'relative' }}>
              <LoadScript googleMapsApiKey="AIzaSyACIsovAIGLyWjhP-KZAK7wz-smt0NPTCY">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={13}
                >
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, backgroundColor: '#fff', padding: 2, borderRadius: 1 }}>
                <Typography variant="h6">Merc</Typography>
                <Typography variant="body2">East Legon</Typography>
                <Typography variant="body2">12:00 am - 10:00 pm</Typography>
                <Typography variant="body2">40L</Typography>
                <Typography variant="body2">100 mt</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

      </Box>

    </Container>
  );
};

export default Dashboard;