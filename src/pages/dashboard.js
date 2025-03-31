import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAuthContext } from '../components/onboarding/authProvider';
import '../App.css';
import Map from "../components/maps/dashboard_map"

const baseURL = process.env.REACT_APP_BASE_URL;

const Dashboard = () => {
  const { org_id, user_id } = useAuthContext();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardSummary, setDashboardSummary] = useState({
    totalAssets: 0,
    overallAssetsValue: 0,
    totalFuelCost: 0,
    carbonReduction: 0
  })
  const [dashboardData, setDashboardData] = useState({
    fuelUsage: [],
    mileage: [],
  });
  
  useEffect(() => {
    if (!trips.length) return; // Prevent unnecessary updates
  
    // Prepare daily fuel costs for the last 7 days
    const last7Days = Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // Get last 7 days' dates
  
      return {
        name: date.toLocaleDateString("en-US", { weekday: "short" }), // "Mon", "Tue", etc.
        value: 0,
      };
    });
  
    // Populate last 7 days' costs from trips
    trips.forEach((trip) => {
      const tripDate = new Date(trip.t_created_at);
      const daysAgo = Math.floor((new Date() - tripDate) / (1000 * 60 * 60 * 24));
  
      if (daysAgo < 7) {
        last7Days[6 - daysAgo].value += trip.t_actual_cost || 0; // Assign cost
      }
    });
  
    // Merge data into the fuelUsage array
    setDashboardData((prevData) => ({
      ...prevData,
      fuelUsage: [
        ...prevData.fuelUsage.filter((entry) => !last7Days.some((d) => d.name === entry.name)), // Remove old last 7 days
        ...last7Days, // Add new calculated last 7 days
      ],


    }));
  }, [trips]); // Runs when trips change

  const [currentPage, setCurrentPage] = useState(1); // Added for pagination
  const tripsPerPage = 5;

  const indexOfLastTrip = currentPage * tripsPerPage;


  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  useEffect(() => {
    fetch(`${baseURL}/trips/${org_id}/${user_id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTrips(
          data.filter(
            (trip) =>
              new Date(trip.t_created_at) >= oneWeekAgo
          )
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  },
  // eslint-disable-next-line
  [org_id, user_id] );

  const [, setPrevOrgId] = useState(null);

  useEffect(() => {
    if (!org_id) return;

  setPrevOrgId((prev) => {
      if (prev === org_id) return prev; // Prevent unnecessary state update
      return org_id;
  });
  
    const controller = new AbortController();
    const signal = controller.signal;
  
    setLoading(true); // Ensure loading state is set correctly
  
    fetch(`${baseURL}/summaries/${org_id}/`, { signal })
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
        if (error.name !== "AbortError") {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      });
  
    return () => controller.abort(); // Cleanup previous fetch request
  
  }, 
  [org_id ]); // Runs only when org_id changes

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


  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#ffeb3b"; // Yellow
      case "Requested":
        return "#ff9800"; // Orange
      case "In-Progress":
        return "#2196f3"; // Blue
      case "Completed":
        return "#4caf50"; // Green
      default:
        return "#ffffff"; // Default White
    }
  };

  return (
    <Container maxWidth="inherit" sx={{ fontFamily: 'var(--font-family)' }}>
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
          gap: 2,
        }}
      >
        <Card sx={{ backgroundColor: '#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }} >
          <CardContent>
            <Typography variant="body2">Total Assets</Typography>
            <Typography variant="h6">{dashboardSummary.totalAssets}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#E5ECF6', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }} >
          <CardContent>
            <Typography variant="body2">Assets Value</Typography>
            <Typography variant="h6">${dashboardSummary.overallAssetsValue}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#E3F5FF', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
          <CardContent>
            <Typography variant="body2">Fuel Cost</Typography>
            <Typography variant="h6">${dashboardSummary.totalFuelCost}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#E5ECF6', padding: 2, textAlign: 'center', color: 'text.secondary', height: '100%' }}>
          <CardContent>
            <Typography variant="body2">Carbon Reduction</Typography>
            <Typography variant="h6">{dashboardSummary.carbonReduction}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ my: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={7.5}>
            <Paper sx={{ padding: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ marginRight: 2 }}>Fuel Used</Typography>
                {/* <Typography variant="body2" sx={{ marginRight: 2 }}>Operating fuel</Typography>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#000', borderRadius: '50%', marginRight: 2 }}></Box>
                <Typography variant="body2" sx={{ marginRight: 2 }}>This year</Typography>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#82ca9d', borderRadius: '50%' }}></Box>
                <Typography variant="body2" sx={{ marginRight: 2 }}>Last year</Typography> */}
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

          <Grid item xs={4.5} sx={{ maxHeight: 400, overflowY: 'scroll' }}>
            <Paper sx={{ padding: 2, height: 'inherit' }}>
              <Typography variant="h6">This Week's Trips</Typography>

              {!loading && trips.map((trip) => (
                <Card key={trip.id} sx={{ backgroundColor: getStatusColor(trip.t_status), padding: 1, marginBottom: 2 }}>
<CardContent>
  <Grid container spacing={2}>
    {/* Row 1 */}
    <Grid item xs={6}>
    <Typography variant="body2"><strong> {trip.o_name}</strong> </Typography>
    </Grid>
    <Grid item xs={6}>
    <Typography variant="body2"><strong>{trip.a_license_plate} </strong></Typography>
    </Grid>

    {/* Row 2 */}
    <Grid item xs={6}>
      <Typography variant="body2"><strong>From:</strong> {trip.t_origin_place_query}</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body2"><strong>To:</strong> {trip.t_destination_place_query}</Typography>
    </Grid>

    {/* Row 3 */}
    <Grid item xs={6}>
    <Typography variant="body2"> {trip.t_status}</Typography>
    </Grid>

  </Grid>
</CardContent>
                </Card>
              ))}

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
      </Box>

      <Box sx={{ my: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ my: 4, height: 300, backgroundColor: '#f5f5f5', borderRadius: 1, position: 'relative' }}>
             
<Map
trips={trips}
style={{ width: "100%", height: "100%" }}
/>
             

            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;