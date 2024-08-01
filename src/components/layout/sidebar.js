/* eslint-disable react/prop-types */
import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItemWithLink from './ListItemWithLink'
import { Typography } from '@mui/material'
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
             backgroundColor: '#E5ECF6',
              color: 'black',
              marginTop: '50px',
              paddingTop:'15px',
              zIndex: 0
            },
          }}
          variant='persistent'
          anchor='left'>
   
          <List>
           

            <ListItemWithLink
              label='Dashboard'
              icon={ <img src={Dashboard_icon} alt="Custom Icon" className="icon" />}
              to='/dashboard'
            />
            <ListItemWithLink
              label='Assets'
              icon={ <img src={Asset_icon} alt="Custom Icon" className="icon"/>}
              to='/assets'
            />

<ListItemWithLink
              label='Operators'
              icon={ <img src={Operator_icon} alt="Custom Icon"  className="icon" />}
              to='/operators'
            />
            <ListItemWithLink
              label='Trips'
              icon={ <img src={Routes_icon} alt="Custom Icon"  className="icon" />}
              to='/trips'
            />

<ListItemWithLink
              label='Fuel'
              icon={ <img src={Fuel_icon} alt="Custom Icon"  className="icon" />}
              to='/fuel'
            />




            <ListItemWithLink
              label='Maintenance'
              icon={ <img src={Maintenance_icon} alt="Custom Icon"  className="icon" />}
              to='/maintenance'
            />
             <ListItemWithLink
              label='Reports'
              icon={ <img src={Reports_icon} alt="Custom Icon"  className="icon" />}
              to='/reports'
            />
          </List>
          <Divider />

          {/* <Typography variant='subtitle1' gutterBottom> GENERAL</Typography> */}

          <ListItemWithLink
              label='Settings'
              icon={ <img src={Settings_icon} alt="Custom Icon"  className="icon" />}
              to='/settings'
            />

            <ListItemWithLink
              label='Help Center'
              icon={ <img src={Helpcenter_icon} alt="Custom Icon"  className="icon" />}
              to='/reports'
            />

            <ListItemWithLink
              label='Logout'
              icon={ <img src={Logout_icon} alt="Custom Icon"  className="icon" />}
              to='/logout'
            />

        </Drawer>
        <main style={{ flexGrow: 1, padding: '10px' }}>{children}</main>
      </Box>
    </div>
  )
}
