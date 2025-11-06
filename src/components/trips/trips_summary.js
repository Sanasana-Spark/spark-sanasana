import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Link, 
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuthContext } from "../onboarding/authProvider";
import { TrendingUp, TrendingDown, DirectionsCar } from "@mui/icons-material";
import Map from "../../components/maps/dashboard_map";

const TripSummary = ({onNavigateTab}) => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { apiFetch, org_currency } = useAuthContext();
  const [tripCountSummary, setTripCountSummary] = useState({});
  const [tripExpenseSummary, setTripExpenseSummary] = useState({});
  const [tripIncomeSummary, setTripIncomeSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [dailyTripData, setDailyTripData] = useState([]);
    const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchAllSummaries = async () => {
      try {
        const [countRes, expenseRes, incomeRes] = await Promise.all([
          apiFetch(`${baseURL}/summaries/trip-count-summary/`, { method: "GET" }),
          apiFetch(`${baseURL}/summaries/trip-expense-summary/`, { method: "GET" }),
          apiFetch(`${baseURL}/summaries/trip-income-summary/`, { method: "GET" }),
        ]);

        const [countData, expenseData, incomeData] = await Promise.all([
          countRes.json(),
          expenseRes.json(),
          incomeRes.json(),
        ]);

        setTripCountSummary(countData);
        setTripExpenseSummary(expenseData);
        setTripIncomeSummary(incomeData);
      } catch (error) {
        console.error("Error fetching trip summaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSummaries();
  }, [baseURL, apiFetch]);

useEffect(() => {
  apiFetch(`${baseURL}/summaries/last7days-summary/`, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const formatted = data.map((item) => ({
        ...item,
        Mileage: `${item.mileage}`, // add units later if needed
      }));
      setDailyTripData(formatted);
    })
    .catch((error) => {
      console.error("Error fetching trip summary:", error);
    });
}, [baseURL, apiFetch]);
console.log('>>>>>', dailyTripData)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>
          {new Date(data.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        <p style={{ margin: "4px 0" }}>Trips: {data.trips}</p>
        <p style={{ margin: 0 }}>Mileage: {data.mileage.toFixed(1)} km</p>
      </div>
    );
  }
  return null;
};

  useEffect(
    () => {
      apiFetch(`${baseURL}/trips/?state=new`, { method: 'GET' })
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
    },
    // eslint-disable-next-line
    [apiFetch, baseURL]
  );


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>

      <Typography variant="body2">
        Want to add a new trip?{" "}
        <Link
          component="button"
          variant="body2"
          sx={{ color: "var(--secondary-color)", fontWeight: "bold" }}
          onClick={() => onNavigateTab("New")}
        >
          Go to New/In-Progress
        </Link>
      </Typography>

       {/* --- Trips per day chart --- */}
      <Box sx={{ height: 250, mb: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyTripData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="trips" fill="var(--secondary-color)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>


      <Grid container spacing={3}>
        {/* 🟢 Trip Count Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <DirectionsCar color="primary" />
                <Typography variant="h6">Trip Counts</Typography>
              </Box>
              {Object.entries(tripCountSummary).map(([status, count]) => (
                <Typography key={status} variant="body1">
                  {status.toUpperCase()}: <strong>{count}</strong>
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* 🔵 Trip Income Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TrendingUp color="success" />
                <Typography variant="h6">Trip Income</Typography>
              </Box>
              <Typography variant="body1">
                Total Income: <strong>{org_currency} {tripIncomeSummary.total || 0}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average per trip: {org_currency} {tripIncomeSummary.average || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 🔴 Trip Expense Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TrendingDown color="error" />
                <Typography variant="h6">Trip Expenses</Typography>
              </Box>
              <Typography variant="body1">
                Total Expense: <strong>{org_currency} {tripExpenseSummary.total || 0}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average per trip: {org_currency} {tripExpenseSummary.average || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Box sx={{ marginTop:5, textAlign: "center" }}>
        <Typography variant="h6"> Pending & Inprogress Trips </Typography>
        <Map trips={trips} style={{ width: "100%", height: "100%" }} />
      </Box>
    </Box>
  );
};

export default TripSummary;
