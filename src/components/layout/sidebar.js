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
import Logo from '../../assets/logo.png'
import Dashboard_icon from '../../assets/dashboard_icon.png'
import Asset_icon from '../../assets/asset_icon.png'
import Maintenance_icon  from '../../assets/maintenance_icon.png'
import Helpcenter_icon from '../../assets/helpcenter_icon.png'
import Reports_icon from '../../assets/reports_icon.png'
import Settings_icon from '../../assets/settings_icon.png'
import Logout_icon from '../../assets/logout_icon.png'
import Operator_icon from '../../assets/operator_icon.png'
import Fuel_icon from '../../assets/fuel_icon.png'
import Routes_icon from '../../assets/routes_icon.png'

const drawerWidth = 250

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
            //   backgroundColor: '#047A9A',
              color: '#047A9A',
            },
          }}
          variant='persistent'
          anchor='left'>
          <DrawerHeader sx={{ display: 'flex', justifyContent: 'left' }}>
            <img src={Logo} alt='' style={{ maxWidth: '80%' }} />
          </DrawerHeader>
   
          <List>
            <Typography variant='subtitle1' gutterBottom> HOME</Typography>

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
              label='Operators'
              icon={ <img src={Operator_icon} alt="Custom Icon" />}
              to='/operators'
            />

<ListItemWithLink
              label='Fuel'
              icon={ <img src={Fuel_icon} alt="Custom Icon" />}
              to='/fuel'
            />

<ListItemWithLink
              label='Trips'
              icon={ <img src={Routes_icon} alt="Custom Icon" />}
              to='/trips'
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

          <Typography variant='subtitle1' gutterBottom> GENERAL</Typography>

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
