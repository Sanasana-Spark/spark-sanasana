import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useAuthContext } from '../components/onboarding/authProvider';
import '../App.css';

const baseURL = process.env.REACT_APP_BASE_URL;

const containerStyle = {
  width: '100%',
  height: '300px',

};

const center = {
  lat: 5.6037,
  lng: -0.1870,
};

const Dashboard = () => {
  const { user_id} = useAuthContext();
  const { org_id } = useAuthContext();
  console.log("user", user_id, "org", org_id);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardSummary, setDashboardSummary] = useState({
    totalAssets: 0,
    overallAssetsValue: 0,
    totalFuelCost: 0,
    carbonReduction: 0
  })
  const [dashboardData, setDashboardData] = useState({
    fuelUsage: [
      { name: 'Jan', value: 1000 },
      { name: 'Feb', value: 1700 },
      { name: 'Mar', value: 1800 },
      { name: 'Apr', value: 1500 },
      { name: 'May', value: 1700 },
      { name: 'Jun', value: 100 },
      { name: 'Jul', value: 1450 },
      { name: 'Aug', value: 1500 },
      { name: 'Sep', value: 1340 },
      { name: 'Oct', value: 1000 },
      { name: 'Nov', value: 1590 },
      { name: 'Dec', value: 1490 },
    ],
    upcomingTrips: []
  });
  

  const [currentPage, setCurrentPage] = useState(1); // Added for pagination
  const tripsPerPage = 5;

  const indexOfLastTrip = currentPage * tripsPerPage;
  // const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  // const currentTrips = dashboardData.upcomingTrips.slice(indexOfFirstTrip, indexOfLastTrip);



  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/summary`);
        const fetchedData = response.data;
        //Map the fetched fuel usage data to the static months
        const updatedFuelUsage = dashboardData.fuelUsage.map(month => {
        const fetchedMonthData = fetchedData.fuelUsage.find(fuel => fuel.name === month.name);
          return fetchedMonthData ? { ...month, value: fetchedMonthData.value } : month;
        });

        setDashboardData({
          ...fetchedData,
          fuelUsage: updatedFuelUsage,
          
        });

      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchData();
  }, );

  useEffect(() => {
    fetch(`${baseURL}/trips`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  },[] );

  useEffect(() => {

    if (org_id && user_id) {

    fetch(`${baseURL}/summaries/${org_id}/${user_id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDashboardSummary(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }},[org_id,user_id] );


  // Pagination controls
  const handleNextPage = () => {
    if (indexOfLastTrip < dashboardData.upcomingTrips.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container maxWidth="inherit" sx={{fontfamily: 'var(--font-family)'}}>

<Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        gap: 2,
      }}
    >
     
      <Card>
        <CardContent> 
        <Typography variant="body2" >Total Assets</Typography>
        <Typography variant="h6">{dashboardSummary.totalAssets}</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent> 
        <Typography variant="h6" >Assets Value</Typography>
        <Typography variant="h4">${dashboardSummary.overallAssetsValue}</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent> 
        <Typography variant="h6" >Fuel Cost</Typography>
        <Typography variant="h4">${dashboardSummary.totalFuelCost}</Typography>
        </CardContent>
      </Card>

  

      <Card>
        <CardContent> 
        <Typography variant="h6" >Carbon Reduction</Typography>
        <Typography variant="h4">{dashboardSummary.carbonReduction}</Typography>
        </CardContent>
      </Card>
      </Box>
  


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

              <LineChart width={600} height={300} data={dashboardData.fuelUsage}>
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
              
              { loading && trips.map((trip) => (
                <Typography key={trip.id}>{trip.a_license_plate}</Typography>
              ))}
              {/* Pagination Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={indexOfLastTrip >= trips.length}
                >
                  Next
                </Button>
              </Box>
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