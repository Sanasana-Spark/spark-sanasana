import React from 'react';
import VerticalSidebar from './sidebar';
import TopBar from './topbar';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {

  return (
<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <VerticalSidebar />
        <main style={{ flexGrow: 1, padding: '20px' }}>{children}</main>
      </div>
    </div>

  )
}

export default Layout
