import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAuthContext } from "../onboarding/authProvider";
import { TrendingUp, TrendingDown, DirectionsCar } from "@mui/icons-material";

const TripSummary = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { apiFetch, org_currency } = useAuthContext();

  const [tripCountSummary, setTripCountSummary] = useState({});
  const [tripExpenseSummary, setTripExpenseSummary] = useState({});
  const [tripIncomeSummary, setTripIncomeSummary] = useState({});
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Trip Overview
      </Typography>

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
    </Box>
  );
};

export default TripSummary;
