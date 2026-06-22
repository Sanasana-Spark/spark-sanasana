import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
} from "@mui/material";
import { useAuthContext } from "../onboarding/authProvider";
import KpiCard from "../ui/KpiCard"

const MaintenanceSummary = () => {
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
          apiFetch(`${baseURL}/summaries/maintenance-count-summary/`, { method: "GET" }),
          apiFetch(`${baseURL}/summaries/maintenance-expense-summary/`, { method: "GET" }),
          apiFetch(`${baseURL}/summaries/maintenance-income-summary/`, { method: "GET" }),
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
        console.error("Error fetching maintenance summaries:", error);
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
    <div className="page">
        <div className="card-header">
          <div className="card-title">Maintenance Overview</div>
          </div>


       <div className="grid-4">

        <KpiCard label="Maintenance Counts"
         value={
          Object.entries(tripCountSummary)
          .map(([status, count]) => `${status}: ${count}`)
          .join(' | ')} 
         icon="👤" color="var(--lime)"
           chipColor="var(--lime-bg)"   />
      
        <KpiCard label="Maintenance Income"  
           value={`${org_currency} ${tripIncomeSummary.total || 0}`}
           icon="⭐" 
           color="var(--blue)"  chipColor="var(--blue-bg)" 
            footer={`Avg: ${org_currency} ${tripIncomeSummary.average || 0}`}
            footerType="up" />
        <KpiCard label="Maintenance Expenses"     
        value={`${org_currency} ${tripExpenseSummary.total || 0}`}
        icon="⚠"  color="var(--amber)" chipColor="var(--amber-bg)" 
        footer={`Avg: ${org_currency} ${tripExpenseSummary.average || 0}`}
         />
      </div>
      
    </div>
  );
};

export default MaintenanceSummary;
