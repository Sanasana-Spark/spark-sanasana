import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import General from '../components/reports/general';
import Operators from '../components/reports/operators';
import Assets from '../components/reports/assets';

const Reports = () => {
	const [activeTab, setActiveTab] = useState(0);

	const handleChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case 0:
				return <General />;
			case 1:
				return <Operators />;
			case 2:
				return <Assets />;
			default:
				return null;
		}
	};

	return (
		<Box sx={{ m: 4 }}>
			<Typography variant='h5' fontWeight='bold' mb={2}>
				Reports
			</Typography>

			<Tabs
				value={activeTab}
				onChange={handleChange}
				variant='fullWidth'
				TabIndicatorProps={{
					style: {
						backgroundColor: 'var(--secondary-color)',
					},
				}}
				sx={{
					borderBottom: 1,
					borderColor: 'divider',
					borderTopLeftRadius: 8,
					borderTopRightRadius: 8,
					'& .MuiTab-root': {
						color: 'var(--secondary-color)',
						fontWeight: 'bold',
					},
					'& .Mui-selected': {
						color: 'var(--secondary-color)',
					},
				}}
			>
				<Tab label='General' />
				<Tab label='By-Operators' />
				<Tab label='By-Asset' />
			</Tabs>

			<Box sx={{ p: 3, height: '70vh', overflowY: 'auto' }}>{renderTabContent()}</Box>
		</Box>
	);
};

export default Reports;
