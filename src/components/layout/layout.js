import React from 'react';
import VerticalSidebar from './sidebar';
import TopBar from './topbar';
import Grid from "@mui/material/Grid";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {

  return (
<Grid container spacing={0}>

{/* Sidebar */}
<Grid
  item
  xs={2}
  style={{
    borderColor: 'black',
    borderRight: '1px solid',
    height: '100vh',
    boxSizing: 'border-box',
  }}
>
  <VerticalSidebar />
</Grid>

{/* Main Content */}
<Grid
  item
  xs={10}
  container
  direction="column"
  style={{
    height: '100vh',
    backgroundColor: 'var(--faded-primary-color)',
    boxSizing: 'border-box',
    overflow: 'hidden', // Prevents overflow
  }}
>
  {/* TopBar */}
  <Grid
    item
    xs="auto" // Automatically adjusts height for TopBar
    style={{
      boxSizing: 'border-box',
    }}
  >
    <TopBar />
  </Grid>

  {/* Children */}
  <Grid
    item
    xs
    style={{
      overflow: 'auto', // Allows scrolling for content if it exceeds height
      boxSizing: 'border-box',
      padding: '1rem', // Optional padding for children
    }}
  >
    {children}
  </Grid>
</Grid>

</Grid>

  )
}

export default Layout
