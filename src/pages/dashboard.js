import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Grid,
} from "@mui/material";
import { useAuthContext } from "../components/onboarding/authProvider";
import "../App.css";
import Map from "../components/maps/dashboard_map";
import KpiCard from "../components/ui/KpiCard";
import Badge from "../components/ui/Badge";

const baseURL = process.env.REACT_APP_BASE_URL;

const Dashboard = () => {
  const { org_id, user_id, user_org, org_currency, apiFetch } = useAuthContext();
  const navigate  = useNavigate()

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
    totalAlerts: 0,
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


  useEffect(() => {async function fetchData() {
    try {
      const response = await apiFetch(
        `${baseURL}/assets/fleet_performance/?start_date=${startDate}&end_date=${endDate}`, { method: "GET" }
      );
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      setAssetPerformance(data.fleet_data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [apiFetch, startDate, endDate]);


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


  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  useEffect(
    () => {
      apiFetch(`${baseURL}/trips/`, { method: "GET" })
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
    [apiFetch, baseURL]
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

    apiFetch(`${baseURL}/summaries/`, { method: "GET", signal })
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
  }, [apiFetch, org_id]); // Runs only when org_id changes


  return (
    <div className="page">

            {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Fleet Dashboard</div>
          <div className="page-subtitle"> replace with real-time </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick="">+ Add Trip</button>
        </div>
      </div>

    {/* Carbon strip */}
      <div className="carbon-strip">
        <div className="carbon-icon">🌿</div>
        <div>
          <div className="carbon-hl">Carbon savings this month</div>
          <div className="carbon-body">Route optimisation &amp; idle-time reduction · June 2026</div>
        </div>
        <div className="carbon-divider" />
        <div className="carbon-stat"><div className="carbon-stat-v">2.4t</div><div className="carbon-stat-l">CO₂ reduced</div></div>
        <div className="carbon-divider" />
        <div className="carbon-stat"><div className="carbon-stat-v">34</div><div className="carbon-stat-l">routes optimised</div></div>
        <div className="carbon-divider" />
        <div className="carbon-stat"><div className="carbon-stat-v">22%</div><div className="carbon-stat-l">idle ↓ vs May</div></div>
        <div className="carbon-kpi">
          <div className="carbon-kpi-v">14.8t</div>
          <div className="carbon-kpi-l">SAVED YTD</div>
        </div>
      </div>

         {/* KPIs */}
      <div className="grid-4">
        <KpiCard label="Active vehicles" value={dashboardSummary.totalAssets} icon="🚐" color="var(--lime)"  chipColor="var(--lime-bg)"  footer="↑ 2 from yesterday" footerType="up" />
        <KpiCard label="Fuel cost this week" value= {`${dashboardSummary.totalFuelCost} ${org_currency}`} icon="⛽" color="var(--amber)" chipColor="var(--amber-bg)" footer="↑ 8% vs 7-day avg" footerType="down" />
        <KpiCard label="Trips completed" value={dashboardSummary.totalTrips} icon="📍" color="var(--teal)"  chipColor="var(--teal-bg)"  footer="↑ 5 vs yesterday" footerType="up" />
        <KpiCard label="Active alerts"   value={dashboardSummary.totalAlerts}  icon="⚠"  color="var(--red)"   chipColor="var(--red-bg)"   footer="2 maintenance · 1 speeding" />
      </div>

          {/* Map + Alerts */}
      <div className="grid-2r">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Live fleet tracking</div>
              <div className="card-subtitle">14 active · Nairobi, Kenya</div>
            </div>
            <Badge type="green" dot>14 active</Badge>
            <Badge type="amber" dot>2 idle</Badge>
            <span className="card-link" onClick={() => navigate('/fleet')}>Full map →</span>
          </div>

          {/* Map */}
          <div className="map-area">
            <div className="map-bg" /><div className="map-grid-overlay" />
            <Map trips={trips} style={{ width: "100%", height: "100%" }} />

            <div className="map-legend">
              <div className="map-legend-item"><div className="map-legend-dot" style={{background:'var(--forest)'}} />Active</div>
              <div className="map-legend-item"><div className="map-legend-dot" style={{background:'var(--amber)'}} />Idle</div>
              <div className="map-legend-item"><div className="map-legend-dot" style={{background:'var(--red)'}} />Alert</div>
            </div>

          </div>

          {/* Active trips table */}
          <table className="data-table">
            <thead><tr><th>Vehicle</th><th>Driver</th><th>Route</th><th>Status</th><th style={{textAlign:'right'}}>Fuel(L)</th><th></th></tr></thead>
            <tbody>
              {trips.map((t,i) => (
                <tr key={i} onClick={() => navigate('/trips')}>
                  <td><div className="vtag"><div className="vico">🚐</div><div><div className="vname">{t.a_license_plate}</div><div className="vid">{t.a_make}-{t.a_model}</div></div></div></td>
                  <td>{t.o_name}</td>
                  <td>{t.t_type}</td>
                   <td><Badge type={t.t_status === 'active' ? 'green' : t.t_status === 'Pending' ? 'amber' : 'red'} dot> {t.t_status.charAt(0).toUpperCase()+t.t_status.slice(1)} </Badge></td>

                  <td style={{textAlign:'right',fontFamily:'var(--mono)',fontSize:12}}>{t.t_actual_cost}</td>
                  <td><span className="card-link" style={{fontSize:11}} onClick={e=>{e.stopPropagation();navigate('/trips')}}>View</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right col */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {/* Alerts */}
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">Active alerts</div><div className="card-subtitle">3 require attention</div></div>
              <span className="card-link" onClick={() => navigate('/maintenance')}>View all</span>
            </div>
            <div className="card-body" style={{paddingTop:4,paddingBottom:4}}>
              {trips.map(a => (
                <div key={a.id} className="alert-row">
                  <div className="alert-pip" style={{background: a.severity === 'red' ? 'var(--red)' : 'var(--amber)'}} />
                  <div style={{flex:1}}>
                    <div className="alert-text"><strong>{a.vehicle}</strong> — {a.message}</div>
                    <div className="alert-meta">{a.meta}</div>
                  </div>
                  <span className={`badge badge-${a.severity === 'red' ? 'red' : 'amber'}`} style={{cursor:'pointer',fontSize:10}} onClick='#' >Ack</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver scoreboard */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Driver scoreboard</div>
              <span className="card-link" onClick={() => navigate('/operators')}>All drivers</span>
            </div>
            <div className="card-body" style={{paddingTop:4,paddingBottom:4}}>
              {trips.map(d => (
                <div key={d.id} className="driver-row" style={{cursor:'pointer'}} onClick={() => navigate('/operators')}>
                  <div className="driver-avatar" style={{background:d.color}}>{d.o_name}</div>
                  <div><div className="driver-name">{d.o_name}</div><div className="driver-stat">{d.t_distance} · {d.trips} trips</div></div>
                  <div className={`driver-score ${d.score >= 85 ? 'score-hi' : d.score >= 70 ? 'score-md' : 'score-lo'}`}>{d.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div className="grid-2r">

        <Grid
  item
  xs={6}
  sx={{
    height: "100%",
    backgroundColor: "var(--main-bg-color)",
    borderRadius: 3,
    padding: 2,
  }}
>
  {(() => {
    // 1. Extract dynamic data directly from your local state context tree
    const fuelData = dashboardData?.fuelUsage || [];
    
    // Resolve organization currency identifier cleanly from form state context
    const currentCurrency =  org_currency || "KES";
    
    // Calculate global summation metrics safely
    const totalSpend = fuelData.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0);
    
    // Find peak value to dynamically clamp bar scale multipliers (Default to 1 to prevent division by 0)
    const maxVal = Math.max(...fuelData.map(d => parseFloat(d.value) || 0), 1);

    // 2. Map absolute dollar metrics down to the chart's 93px pixel grid bounds
    const barH = (val) => {
      const parsed = parseFloat(val) || 0;
      return (parsed / maxVal) * 93;
    };

    // Formatter tool for creating grid line ticks dynamically
    const formatTick = (multiplier) => {
      const value = maxVal * multiplier;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toFixed(0);
    };

    // Stylized index color matrix mapping (Cycles variations safely)
    const BAR_COLORS = ['var(--lime)', 'var(--lime)', 'var(--lime)', 'var(--lime)', 'var(--lime)', 'var(--lime)', 'var(--lime)'];

    return (
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* ── CARD HEADER LAYER ── */}
        <div className="card-header" style={{ padding: 0, marginBottom: 16 }}>
          <div>
            <div className="card-title">Weekly fuel spend</div>
            <div className="card-subtitle">{currentCurrency} · last 7 days</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--ink4)' }}>
            Total: <strong style={{ color: 'var(--ink)' }}>{currentCurrency} {totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </span>
          <span className="card-link" onClick={() => navigate('/fuel')}>Fuel page →</span>
        </div>

        {/* ── CARD GRID SVG BODY LAYER ── */}
        <div className="card-body" style={{ flexGrow: 1, position: 'relative' }}>
          <svg width="100%" viewBox="0 0 480 128" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
            
            {/* Horizontal Blueprint Track Grid lines */}
            {[4, 35, 66, 97].map((y, i) => (
              <line key={i} x1="36" y1={y} x2="476" y2={y} stroke="#E8EDE5" strokeWidth="0.5" />
            ))}

            {/* Dynamic Scaling Y-Axis Grid text labels */}
            {[1.0, 0.75, 0.5, 0.25].map((ratio, i) => (
              <text key={i} x="0" y={[8, 39, 70, 101][i]} fontSize="9" fill="#9BAD98" fontFamily="JetBrains Mono">
                {formatTick(ratio)}
              </text>
            ))}

            {/* Dynamic Data Bar Loop mapping */}
            {fuelData.map((d, i) => {
              const h = barH(d.value);
              // Calculate spacing values evenly across the available horizontal 440px viewport space
              const step = fuelData.length > 1 ? (400 / (fuelData.length - 1)) : 64;
              const x = 36 + (i * step);
              const barWidth = Math.min(38, step * 0.7);

              return (
                <g key={i} className="bc-bar">
                  {/* Performance Yield Bar Vector */}
                  <rect 
                    x={x} 
                    y={97 - h} 
                    width={barWidth} 
                    height={h} 
                    rx={4} 
                    fill={BAR_COLORS[i % BAR_COLORS.length]} 
                    className="bar-animated" 
                    style={{ animationDelay: `${i * 0.05}s` }} 
                  />
                  
                  {/* Inline Value Indicator on peak hover target arrays */}
                  {h > 15 && (
                    <text 
                      x={x + (barWidth / 2)} 
                      y={92 - h < 10 ? 92 - h + 12 : 92 - h} 
                      textAnchor="middle" 
                      fontSize="8" 
                      fill={92 - h < 10 ? "#FFF" : "var(--forest, #2D6A4F)"} 
                      fontFamily="JetBrains Mono"
                    >
                      {parseFloat(d.value) >= 1000 ? `${(parseFloat(d.value) / 1000).toFixed(0)}K` : parseFloat(d.value).toFixed(0)}
                    </text>
                  )}

                  {/* Horizontal Data Label Anchor */}
                  <text x={x + (barWidth / 2)} y="118" textAnchor="middle" fontSize="8.5" fill="#9BAD98">
                    {d.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* ── CHART LEGEND ANCHOR ROW ── */}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {[['var(--lime)', 'Weekday'], ['var(--lime3, #b7e4c7)', 'Weekend']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--ink3)' }}>
                <div style={{ width: 9, height: 9, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  })()}
</Grid>


        <div className="card">

          <div className="card-header">
              <div className="card-title">Fleet Performance</div>
                <span className="card-link" onClick={() => navigate('/fuel')}>Full report</span>
          </div>

          <div className="card-body">
            {/* Calculate baseline metrics for dynamic percentage distribution */}
            {(() => {
              if (loading || !Array.isArray(assetPerformance) || assetPerformance.length === 0) return null;
              
              // Compute total consumption across assets to find the fleet average
              const computedList = assetPerformance.map(asset => {
                const mileage = parseFloat(asset.total_miles) || 0;
                const fuel = parseFloat(asset.total_fuel) || 0;
                const profit = parseFloat(asset.profit) || 0;
                const consumption = fuel > 0 ? (fuel / 100) * mileage : 0;
                return { mileage, consumption, profit, asset };
              });

              const totalConsumption = computedList.reduce((acc, curr) => acc + curr.consumption, 0);
              const avgConsumption = (totalConsumption / computedList.length).toFixed(1);
              const maxProfit = Math.max(...computedList.map(d => d.profit), 1);

              return (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: 'var(--ink4)', marginBottom: 10 }}>
                    Fleet avg: <span style={{ color: 'var(--forest)', fontSize: 14, letterSpacing: '-.3px', fontWeight: 800 }}>{avgConsumption} L/100km</span>
                  </div>

                  {computedList.map(({ mileage, consumption, profit, asset }) => {
                    // Clamp progression width between 5% and 100% based on peak financial yield
                    const pct = Math.min(Math.max((profit / maxProfit) * 100, 5), 100);

                    return (
                      <div key={asset.id} className="prog-row">
                        {/* Vehicle Descriptor Plate */}
                        <span className="prog-label">{asset.a_license_plate}</span>
                        
                        {/* Relative Performance Rail Graphic */}
                        <div className="prog-track">
                          <div className="prog-fill" style={{ width: `${pct}%`, background: 'var(--forest)' }} />
                        </div>
                        
                        {/* Performance Metrics Readout Columns */}
                        <span className="prog-value" style={{ display: 'flex', gap: '12px' }}>
                          <span style={{ color: 'var(--ink4)' }}>{mileage.toFixed(0)} KM</span>
                          <span style={{ fontWeight: 700 }}>
                            {org_currency} {profit.toFixed(2)}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </>
              );
            })()}

            {/* Fallback States mapped seamlessly to your stylesheet layout */}
            {loading && (
              <div className="prog-row" style={{ justifyContent: 'center', color: 'var(--ink4)' }}>
                Loading metrics...
              </div>
            )}

            {!loading && (!Array.isArray(assetPerformance) || assetPerformance.length === 0) && (
              <div className="prog-row" style={{ justifyContent: 'center', color: 'var(--ink4)' }}>
                No asset performance data available.
              </div>
            )}
          </div>
        

        
      </div>

      </div>


    </div>
  );
};

export default Dashboard;
