/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAuthContext } from '../components/onboarding/authProvider';

const Reports = () => {
  const baseURL = process.env.REACT_APP_BASE_URL
  const { org_id } = useAuthContext();

  const [trips, setTrips] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
      fetchTrips();
  },);

  const fetchTrips = async () => {
      try {
          const response = await axios.get(`${baseURL}/trips/reports/${org_id}`, {
              params: {organization_id: org_id, start_date: startDate, end_date: endDate }
          });
          setTrips(response.data);
      } catch (error) {
          console.error("Error fetching reports:", error);
      }
  };

  return (
      <div className="p-4">
          <h2 className="text-xl font-bold">Trip Reports</h2>

          {/* Filters */}
          <div className="mb-4">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <button onClick={fetchTrips} className="bg-blue-500 text-white px-4 py-2">Fetch Report</button>
          </div>

          {/* Export as CSV */}
          <CSVLink data={trips} filename="trip_report.csv" className="bg-green-500 text-white px-4 py-2">
              Export as CSV
          </CSVLink>

          {/* Chart Visualization */}
          <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trips}>
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="t_est_cost" fill="#8884d8" name="Estimated Cost" />
                  <Bar dataKey="t_actual_cost" fill="#82ca9d" name="Actual Cost" />
              </BarChart>
          </ResponsiveContainer>

          {/* Table */}
          <table className="min-w-full bg-white border border-gray-300 mt-4">
              <thead>
                  <tr className="bg-gray-200">
                      <th className="border px-4 py-2">ID</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Est. Cost</th>
                      <th className="border px-4 py-2">Actual Cost</th>
                      <th className="border px-4 py-2">Created At</th>
                  </tr>
              </thead>
              <tbody>
                  {trips.map((trip) => (
                      <tr key={trip.id}>
                          <td className="border px-4 py-2">{trip.id}</td>
                          <td className="border px-4 py-2">{trip.t_status}</td>
                          <td className="border px-4 py-2">${trip.t_est_cost}</td>
                          <td className="border px-4 py-2">${trip.t_actual_cost}</td>
                          <td className="border px-4 py-2">{new Date(trip.t_created_at).toLocaleDateString()}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
};

export default Reports