// import React from 'react';
// import './MainPage.css';
// import { IoMdMenu } from "react-icons/io";
// import { MdExpandMore } from "react-icons/md";
// import { IoMdNotificationsOutline } from "react-icons/io";
// import userImg from '../assets/user.png';
// import analytic1 from '../assets/analytic1.png';
// import CanvasJSReact from '@canvasjs/react-charts';
// import Chart from './Chart';
 
// // var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// const MainPage = () => {

//   const options = {
//     animationEnabled: true,
//     title: {
//       text: ""
//     },
//     axisY: {
//       title: "Net Usage (in Thousand USD)",
//       suffix: " $"
//     },
//     data: [{
//       type: "splineArea",
//       xValueFormatString: "YYYY",
//       yValueFormatString: "#,##0.## bn kW⋅h",
//       showInLegend: true,
//       legendText: "",
//       dataPoints: [
//         { x: new Date(2008, 0), y: 20.735 },
//         { x: new Date(2009, 0), y: 24.102 },
//         { x: new Date(2010, 0), y: 22.569 },
//         { x: new Date(2011, 0), y: 22.743 },
//         { x: new Date(2012, 0), y: 22.381 },
//         { x: new Date(2013, 0), y: 21.406 },
//         { x: new Date(2014, 0), y: 23.163 },
//         { x: new Date(2015, 0), y: 24.270 },
//         { x: new Date(2016, 0), y: 22.525 },
//         { x: new Date(2017, 0), y: 23.121 }
//       ]
//     }]
//   }

//   const options2 = {
//     one: 80,
//     two: 80,
//     three: 80,
//     four: 80,
//   }
//   return (
//     <div className='mainpage-container'>
//       <div className="mainpage-data">
//       <div className="d-header">      
//         <div className="d-header-data">
//           <div className="notif-icon">
//             <IoMdNotificationsOutline />
//           </div>
//           <div className="d-profile">
//             <div className="prof-img">
//               <img src={userImg} alt="" />
//             </div>
//             <div className="prof-name">
//               Ami
//             </div>
//             <div className="more-icon">
//               <MdExpandMore />
//             </div>
//           </div>
//         </div>
//         <div className="menu mobile">
//           <IoMdMenu />
//         </div>
//       </div>
//       <div className="d-welcome">
//         <h2>Welcome Ami</h2>
//         <p>Manage all your assets in one place</p>
//         <div className="welcome-analytics">
//           <div className="analytics-data">
//             <div className="analytics-img">
//               <img src={analytic1} alt="" />
//             </div>
//             <div className="analytics-dat">
//               <p>Total Assets</p>
//               <h4>1283</h4>
//             </div>
//           </div>
//           <div className="analytics-data">
//             <div className="analytics-img">
//               <img src={analytic1} alt="" />
//             </div>
//             <div className="analytics-dat">
//               <p>Overall Assets Value</p>
//               <h4>$25, 000, 000</h4>
//             </div>
//           </div>
//           <div className="analytics-data">
//             <div className="analytics-img">
//               <img src={analytic1} alt="" />
//             </div>
//             <div className="analytics-dat">
//               <p>Number of Clients</p>
//               <h4>5</h4>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="dashboard-page-data">
//         <h2>Dashboard</h2>
//         <div className="d-first-sect">
//           <div className="d-asset-overview">
//             <div className="card-header">
//               <h4>Assets Overview</h4>
//               <button className="btn1">Add Asset</button>
//             </div>
//             <div className="card-filter">
//               <select name="asset" id="asset">
//                 <option value="Vehicles">Vehicles</option>
//               </select>
//             </div>
//             <div className="card-analytics">
//               <div className="card-analytic">
//                 <h3>75</h3>
//                 <p>Total Number</p>
//               </div>
//               <div className="card-analytic">
//                 <h3>75</h3>
//                 <p>Active</p>
//               </div>
//               <div className="card-analytic">
//                 <h3>75</h3>
//                 <p>parking</p>
//               </div>
//               <div className="card-analytic">
//                 <h3>75</h3>
//                 <p>Maintanence</p>
//               </div>
//               <div className="card-analytic">
//                 <h3>75</h3>
//                 <p>Inactive</p>
//               </div>
//             </div>
//           </div>
//           <div className="fuel-spend">
//             <div className="card-header">
//               <h4>Fuel Spend</h4>
//               <div className="timeline-filter">
//                 Weekly
//               </div>
              
//             </div>
//             <div className="fuel-usage-chart">
//               <CanvasJSChart options = {options} />
//               </div>
//           </div>
//         </div>
//         <div className="d-second-sect">
//         <div className="card-header">
//               <h4>Live Tracking</h4>
              
//             </div>
//             <div className="live-chart">
//                 <Chart options={options2} />
//               </div>
//         </div>
//       </div>
//       </div>
      
//     </div>
//   )
// }

// export default MainPage



import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsNone as NotificationsIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import userImg from '../assets/user.png';
import analytic1 from '../assets/analytic1.png';
import CanvasJSReact from '@canvasjs/react-charts';
import Chart from './Chart';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MainPage = () => {
  const [chartData, setChartData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [assetOverview, setAssetOverview] = useState({});
  const [liveTrackingData, setLiveTrackingData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchChartData();
    fetchAnalyticsData();
    fetchAssetOverview();
    fetchLiveTrackingData();
  }, []);

  const fetchChartData = async () => {
    const response = await fetch('https://api.example.com/chart-data');
    const data = await response.json();
    setChartData(data);
  };

  const fetchAnalyticsData = async () => {
    const response = await fetch('https://api.example.com/analytics-data');
    const data = await response.json();
    setAnalyticsData(data);
  };

  const fetchAssetOverview = async () => {
    const response = await fetch('https://api.example.com/asset-overview');
    const data = await response.json();
    setAssetOverview(data);
  };

  const fetchLiveTrackingData = async () => {
    const response = await fetch('https://api.example.com/live-tracking-data');
    const data = await response.json();
    setLiveTrackingData(data);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = {
    animationEnabled: true,
    title: {
      text: ""
    },
    axisY: {
      title: "Net Usage (in Thousand USD)",
      suffix: " $"
    },
    data: [{
      type: "splineArea",
      xValueFormatString: "YYYY",
      yValueFormatString: "#,##0.## bn kW⋅h",
      showInLegend: true,
      legendText: "",
      dataPoints: chartData
    }]
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar src={userImg} />
            <ExpandMoreIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" style={{ marginTop: '20px' }}>
        Welcome Ami
      </Typography>
      <Typography variant="subtitle1">
        Manage all your assets in one place
      </Typography>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardHeader
              avatar={<Avatar src={analytic1} />}
              title="Total Assets"
              subheader={analyticsData.totalAssets}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardHeader
              avatar={<Avatar src={analytic1} />}
              title="Overall Assets Value"
              subheader={`$${analyticsData.totalValue}`}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardHeader
              avatar={<Avatar src={analytic1} />}
              title="Number of Clients"
              subheader={analyticsData.numClients}
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Dashboard</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title="Assets Overview"
              action={
                <Button variant="contained" color="primary">
                  Add Asset
                </Button>
              }
            />
            <CardContent>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="asset">Asset</InputLabel>
                <Select native label="Asset" inputProps={{ id: 'asset' }}>
                  <option value="Vehicles">Vehicles</option>
                </Select>
              </FormControl>
              <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6">{assetOverview.total}</Typography>
                  <Typography variant="body2">Total Number</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6">{assetOverview.active}</Typography>
                  <Typography variant="body2">Active</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6">{assetOverview.parking}</Typography>
                  <Typography variant="body2">Parking</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6">{assetOverview.maintenance}</Typography>
                  <Typography variant="body2">Maintenance</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6">{assetOverview.inactive}</Typography>
                  <Typography variant="body2">Inactive</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title="Fuel Spend"
              subheader="Weekly"
            />
            <CardContent>
              <CanvasJSChart options={options} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Live Tracking" />
            <CardContent>
              <Chart options={liveTrackingData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainPage;
