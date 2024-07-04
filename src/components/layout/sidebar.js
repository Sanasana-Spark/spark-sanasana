/* eslint-disable react/prop-types */
import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItemWithLink from './ListItemWithLink'
import { Typography } from '@mui/material'
// import Logo from '../../assets/logo.png'
import Dashboard_icon from '../../assets/dashboard_icon.png'
import Asset_icon from '../../assets/asset_icon.png'
import Maintenance_icon  from '../../assets/maintenance_icon.png'
import Helpcenter_icon from '../../assets/helpcenter_icon.png'
import Reports_icon from '../../assets/reports_icon.png'
import Settings_icon from '../../assets/settings_icon.png'
import Logout_icon from '../../assets/logout_icon.png'

const drawerWidth = 300

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 0),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

export default function VerticalSidebar({ children }) {
  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          open={true}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            //   backgroundColor: '#081F5C',
              color: '081F5C'
            },
          }}
          variant='persistent'
          anchor='left'>
          <DrawerHeader sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* <img src={Logo} alt='' style={{ maxWidth: '100%' }} /> */}
            <Typography variant='h4' gutterBottom> Sana Sana</Typography>
          </DrawerHeader>
   
          <List>
            <Typography variant='h5' gutterBottom> HOME</Typography>

            <ListItemWithLink
              label='Dashboard'
              icon={ <img src={Dashboard_icon} alt="Custom Icon" />}
              to='/dashboard'
            />
            <ListItemWithLink
              label='Assets'
              icon={ <img src={Asset_icon} alt="Custom Icon" />}
              to='/assets'
            />
            <ListItemWithLink
              label='Maintenance'
              icon={ <img src={Maintenance_icon} alt="Custom Icon" />}
              to='/maintenance'
            />
             <ListItemWithLink
              label='Reports'
              icon={ <img src={Reports_icon} alt="Custom Icon" />}
              to='/reports'
            />
          </List>
          <Divider />

          <Typography variant='h5' gutterBottom> GENERAL</Typography>

          <ListItemWithLink
              label='Settings'
              icon={ <img src={Settings_icon} alt="Custom Icon" />}
              to='/settings'
            />

            <ListItemWithLink
              label='Help Center'
              icon={ <img src={Helpcenter_icon} alt="Custom Icon" />}
              to='/reports'
            />

            <ListItemWithLink
              label='Logout'
              icon={ <img src={Logout_icon} alt="Custom Icon" />}
              to='/logout'
            />

        </Drawer>
        <main style={{ flexGrow: 1, padding: '20px' }}>{children}</main>
      </Box>
    </div>
  )
}
