/* eslint-disable react/prop-types */
import React from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { NavLink } from 'react-router-dom' // Import Link for navigation

const ListItemWithLink = ({ label, icon, to }) => {
  return (
    <ListItem className='dashboardLink'>
      <ListItemButton component={NavLink} to={to}>
        <ListItemIcon className='dashIcon'>{icon}</ListItemIcon>
        <ListItemText className='dashLabel' primary={label} />
      </ListItemButton>
    </ListItem>
  )
}

export default ListItemWithLink
