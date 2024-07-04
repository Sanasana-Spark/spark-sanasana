import React from 'react';
import VerticalSidebar from './sidebar' // Assuming correct path

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {

  return (
    <div style={{ display: 'flex' }}>
      <VerticalSidebar />
      <main style={{ flexGrow: 1, padding: '20px' }}>{children}</main>
    </div>
  )
}

export default Layout
