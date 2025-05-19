import React, { useState } from 'react';
import '../App.css';
import Generalview from '../components/general_settings/main';
import Userpermissions from '../components/users_settings/main';
import { Box, Typography, Tab, Tabs, useMediaQuery, useTheme, Paper } from '@mui/material';
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
		<Box width='100%' p={2}>
			<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
				<Typography variant='h5'>Settings</Typography>
			</Box>

			<Paper elevation={3} sx={{ p: 2 }}>
				<Tabs
					value={activeTab}
					onChange={handleTabClick}
					variant='scrollable'
					scrollButtons='auto'
					textColor='primary'
					indicatorColor='primary'
					sx={{
						'.MuiTab-root': {
							fontSize: isMobile ? '0.75rem' : '1rem',
							minWidth: 100,
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
			</Paper>
		</Box>
	);
};

export default Settings;
