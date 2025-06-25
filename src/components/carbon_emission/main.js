import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Select, MenuItem, Box, FormControl } from "@mui/material";

const carbonEmissionData = {
  monthOnMonth: [
    { name: "Jan", value: 120 },
    { name: "Feb", value: 150 },
    { name: "Mar", value: 180 },
    { name: "Apr", value: 170 },
    { name: "May", value: 160 },
    { name: "Jun", value: 190 },
    { name: "Jul", value: 200 },
    { name: "Aug", value: 220 },
    { name: "Sep", value: 210 },
    { name: "Oct", value: 230 },
    { name: "Nov", value: 250 },
    { name: "Dec", value: 270 },
  ],
  yearOnYear: [
    { name: "2020", value: 1800 },
    { name: "2021", value: 1900 },
    { name: "2022", value: 2000 },
    { name: "2023", value: 2100 },
    { name: "2024", value: 2200 },
  ],
  weekOnWeek: [
    { name: "Monday", value: 100 },
    { name: "Tuesday", value: 120 },
    { name: "Wednesday", value: 140 },
    { name: "Thursday", value: 130 },
    { name: "Friday", value: 150 },
  ],
};

const CarbonEmissionChart = () => {
  const [filter, setFilter] = useState("monthOnMonth");
  const data = carbonEmissionData[filter];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: 400, // Fixed height for the entire chart component
        overflow: "hidden", // Prevent vertical scroll
      }}
    >
      <Box sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="monthOnMonth">Month-on-Month</MenuItem>
            <MenuItem value="yearOnYear">Year-on-Year (Last 5 Years)</MenuItem>
            <MenuItem value="weekOnWeek">Week-on-Week (Mon-Fri)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ flex: 1, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CarbonEmissionChart;
