import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuthContext } from "../components/onboarding/authProvider";
import "../App.css";
import Map from "../components/maps/dashboard_map";
import CarbonEmissionChart from "../components/carbon_emission/main";

const baseURL = process.env.REACT_APP_BASE_URL;

const Dashboard = () => {
  const { org_id, user_id, user_org, org_currency } = useAuthContext();

  if (user_id && !user_org && !org_id) {
    window.location.href = "/create-organization";
  }

  const [trips, setTrips] = useState([]);
  const [assetPerformance, setAssetPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardSummary, setDashboardSummary] = useState({
    totalAssets: 0,
    overallAssetsValue: 0,
    totalFuelCost: 0,
    carbonReduction: 0,
  });
  const [dashboardData, setDashboardData] = useState({
    fuelUsage: [],
    mileage: [],
  });

  // Format dates to 'YYYY-MM-DD'
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits for month
    const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits for day
    return `${year}-${month}-${day}`;
  };
  // Get the date 7 days ago
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const [startDate] = useState(formatDate(sevenDaysAgo));
  const [endDate] = useState(formatDate(today));

  useEffect(
    () => {
      if (!org_id) return; // Prevent unnecessary updates
      fetch(
        `${baseURL}/assets/fleet_performance/${org_id}/?start_date=${startDate}&end_date=${endDate}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setAssetPerformance(data.fleet_data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    },
    // eslint-disable-next-line
    [org_id]
  );

  useEffect(() => {
    if (!trips.length) return; // Prevent unnecessary updates

    // Prepare daily fuel costs for the last 7 days
    const last7Days = Array(7)
      .fill(0)
      .map((_, i) => {
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
      const daysAgo = Math.floor(
        (new Date() - tripDate) / (1000 * 60 * 60 * 24)
      );

      if (daysAgo < 7) {
        last7Days[6 - daysAgo].value += trip.t_actual_cost || 0; // Assign cost
      }
    });

    // Merge data into the fuelUsage array
    setDashboardData((prevData) => ({
      ...prevData,
      fuelUsage: [
        ...prevData.fuelUsage.filter(
          (entry) => !last7Days.some((d) => d.name === entry.name)
        ), // Remove old last 7 days
        ...last7Days, // Add new calculated last 7 days
      ],
    }));
  }, [trips]); // Runs when trips change

  const [currentPage, setCurrentPage] = useState(1); // Added for pagination
  const tripsPerPage = 5;

  const indexOfLastTrip = currentPage * tripsPerPage;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  useEffect(
    () => {
      fetch(`${baseURL}/trips/${org_id}/${user_id}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setTrips(
            data.filter((trip) => new Date(trip.t_created_at) >= oneWeekAgo)
          );

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    },
    // eslint-disable-next-line
    [org_id, user_id]
  );

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
  }, [org_id]); // Runs only when org_id changes

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
    <Container maxWidth="inherit" sx={{ fontFamily: "var(--font-family)" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Card
          sx={{
            backgroundColor: "#E3F5FF",
            padding: 2,
            textAlign: "center",
            color: "text.secondary",
            height: "100%",
            width: "200px",
            maxWidth: "20%",
          }}
        >
          <CardContent>
            <Typography variant="body2">Total Assets</Typography>
            <Typography variant="h6">{dashboardSummary.totalAssets}</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: "#E5ECF6",
            padding: 2,
            textAlign: "center",
            color: "text.secondary",
            height: "100%",
            width: "200px",
            maxWidth: "20%",
          }}
        >
          <CardContent>
            <Typography variant="body2">Operators</Typography>
            <Typography variant="h6">
              {dashboardSummary.totalOperators}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: "#E3F5FF",
            padding: 2,
            textAlign: "center",
            color: "text.secondary",
            height: "100%",
            width: "200px",
            maxWidth: "20%",
          }}
        >
          <CardContent>
            <Typography variant="body2"> Trips </Typography>
            <Typography variant="h6">{dashboardSummary.totalTrips}</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: "#E5ECF6",
            padding: 2,
            textAlign: "center",
            color: "text.secondary",
            height: "100%",
            width: "200px",
            maxWidth: "20%",
          }}
        >
          <CardContent>
            <Typography variant="body2">Fuel Cost</Typography>
            <Typography variant="h6">
              {dashboardSummary.totalFuelCost} {org_currency}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          my: 6,
          height: "45vh",
          display: "grid",
          marginBottom: 2,
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 2,
        }}
      >
        <Grid
          item
          xs={6}
          sx={{
            overflow: "scroll",
            height: "100%",
            backgroundColor: "var(--main-bg-color)",
            borderRadius: 3,
            padding: 2,
          }}
        >
          <Typography variant="body2" sx={{ marginRight: 2 }}>
            Fuel Used
          </Typography>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData.fuelUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        <Grid
          item
          xs={3}
          sx={{
            overflowY: "scroll",
            height: "inherit",
            backgroundColor: "var(--main-bg-color)",
            borderRadius: 3,
            padding: 2,
          }}
        >
          <Typography variant="h6">CO'2 Emission</Typography>
          <CarbonEmissionChart />
        </Grid>

        <Grid
          item
          xs={3}
          sx={{
            overflowY: "scroll",
            height: "inherit",
            backgroundColor: "var(--main-bg-color)",
            borderRadius: 3,
            padding: 2,
          }}
        >
          <Typography variant="h6">This Week's Trips</Typography>

          {!loading &&
            trips.map((trip) => (
              <Card
                key={trip.id}
                sx={{
                  backgroundColor: getStatusColor(trip.t_status),
                  padding: 1,
                  marginBottom: 2,
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Row 1 */}
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong> {trip.o_name}</strong>{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>{trip.a_license_plate} </strong>
                      </Typography>
                    </Grid>

                    {/* Row 2 */}
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>From:</strong> {trip.t_origin_place_query}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>To:</strong> {trip.t_destination_place_query}
                      </Typography>
                    </Grid>

                    {/* Row 3 */}
                    <Grid item xs={6}>
                      <Typography variant="body2"> {trip.t_status}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
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
        </Grid>
      </Box>

      <Box
        sx={{
          my: 6,
          display: "grid",
          marginBottom: 2,
          gridTemplateColumns: "2fr 1fr",
          gap: 2,
        }}
      >
        <Grid
          item
          xs={7}
          sx={{
            overflow: "scroll",
            height: "100%",
            backgroundColor: "var(--main-bg-color)",
            borderRadius: 3,
            padding: 2,
          }}
        >
          <Map trips={trips} style={{ width: "100%", height: "100%" }} />
        </Grid>

        <Grid
          item
          xs={5}
          sx={{
            overflow: "scroll",
            height: "100%",
            backgroundColor: "var(--main-bg-color)",
            borderRadius: 3,
            padding: 2,
          }}
        >
          <Typography variant="h6">Fleet Performance</Typography>
          <Table>
            <TableHead>
              <TableRow
                backgroundColor="var(--secondary-bg-color)"
                style={{ backgroundColor: "var(--secondary-bg-color)" }}
              >
                <TableCell>Vehicle</TableCell>
                <TableCell>Mileage(KMs)</TableCell>
                <TableCell>Consumption/100km</TableCell>
                <TableCell>Profit ({org_currency}) </TableCell>
              </TableRow>
            </TableHead>

            {!loading &&
            Array.isArray(assetPerformance) &&
            assetPerformance.length > 0 ? (
              assetPerformance.map((asset) => (
                <TableBody>
                  <TableRow
                    key={asset.id}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--secondary-bg-color)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--main-bg-color)")
                    }
                    sx={{ border: "none" }}
                  >
                    <TableCell>
                      <strong> {asset.a_license_plate}</strong>{" "}
                    </TableCell>
                    <TableCell>
                      {parseFloat(asset.total_miles) > 0
                        ? parseFloat(asset.total_miles).toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell>
                      {parseFloat(asset.total_fuel) > 0
                        ? parseFloat(
                            (asset.total_fuel / 100) * asset.total_miles
                          ).toFixed(2)
                        : "0.00"}
                    </TableCell>

                    <TableCell>
                      {parseFloat(asset.profit) > 0
                        ? parseFloat(asset.profit).toFixed(2)
                        : "0.00"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    {loading
                      ? "Loading..."
                      : "No asset performance data available."}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
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
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
