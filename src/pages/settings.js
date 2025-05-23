import React, { useState } from 'react';
import '../App.css';
import Generalview from '../components/general_settings/main';
import Userpermissions from '../components/users_settings/main';
import { Box, Typography, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
// import { useAuthContext } from '../components/onboarding/authProvider';

const Settings = () => {
	// const { user_id, org_id } = useAuthContext();
	const [activeTab, setActiveTab] = useState('General');

	const handleTabClick = (event, newValue) => {
		setActiveTab(newValue);
	};

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
			<Box sx={{ 
			  // p: isMobile ? 1 : 3,
			  margin : isMobile ? 0 : 0,
			  padding: isMobile ? 0 : 2,
			  display: "flex",
			  flexDirection: "column",
			  width: "100%",
			  minWidth: 0,  
			  height: "100%",
			  overflow: "scroll",
			  boxShadow: isMobile ? 1 : 3, }}>

			
				<Typography variant='h5'>Settings</Typography>
			

				<Tabs
					value={activeTab}
					onChange={handleTabClick}
					variant='scrollable'
					scrollButtons='auto'
					textColor= 'var(--secondary-color)'
					indicatorColor='var(--secondary-color)'
					sx={{
						'.MuiTab-root': {
							fontSize: isMobile ? '0.75rem' : '1rem',
							minWidth: 100,
						},
						color: 'var(--secondary-text-color)',
						'& .Mui-selected': {
							color: 'var(--secondary-color)',
						},
						'& .MuiTabs-indicator': {
							backgroundColor: 'var(--secondary-color)',
						},
						'& .MuiTabs-scrollButtons': {
							color: 'var(--secondary-color)',
						},
						'& .MuiTabs-root': {
							backgroundColor: 'var(--main-bg-color)',
						},
					}}
				>
					<Tab label='General' value='General' />
					<Tab label='Users' value='Users' />
					<Tab label='Billing' value='Billing' />
					<Tab label='Notification' value='Notification' />
					<Tab label='Security' value='Security' />
				</Tabs>

				<Box sx={{ mt: 2, height: '70vh', overflowY: 'auto' }}>
					{activeTab === 'General' && <Generalview />}
					{activeTab === 'Users' && <Userpermissions />}
					{activeTab === 'Billing' && <Typography>This is the content of Billing</Typography>}
					{activeTab === 'Notification' && <Typography>This is the content of Notification</Typography>}
					{activeTab === 'Security' && <Typography>This is the content of Security</Typography>}
				</Box>
			
		</Box>
	);
};

export default Settings;
