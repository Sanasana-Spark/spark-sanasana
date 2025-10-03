/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import DragIndicator from '@mui/icons-material/DragIndicator';
import Reorder from '@mui/icons-material/Reorder';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import TripsTable from './trips_cashflow_table';
import AddTripForm from './addTripMap';
import TripDetails from './trip_cashflow_details';
import { useAuthContext } from '../onboarding/authProvider';
import { Container, Box, IconButton, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

const Trips = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { apiFetch } = useAuthContext();
	const [currentView, setCurrentView] = useState('TableView');
	const [selectedTicket, setSelectedTicket] = useState([]);
	const [trips, setTrips] = useState([]);
	const [, setLoading] = useState(true);
	const [isSliderOpen, setIsSliderOpen] = useState(false);
	const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
	const [refesh, setRefesh] = useState(false);

	useEffect(() => {
		apiFetch(`${baseURL}/trips/?state=pending-approval`, { method: 'GET' })
			.then(response => {
				if (!response.ok) throw new Error('Network response was not ok');
				return response.json();
			})
			.then(data => {
				setTrips(data);
				setLoading(false);
				setRefesh(false);
			})
			.catch(error => {
				console.error('Error fetching data:', error);
				setLoading(false);
				setRefesh(false);
			});
		
	}, [baseURL, apiFetch, showAddPropertyForm, refesh]);

	const handleSubmit = assetData => {
		const url = `${baseURL}/trips/`;
		const data = { ...assetData };
		const options = {
			method: 'POST',
			body: JSON.stringify(data),
		};
		apiFetch(url, options)
			.then(response => {
				if (!response.ok) throw new Error('Failed to add trip');
				console.log('trip added successfully');
				setShowAddPropertyForm(false);
			})
			.catch(error => console.error('Error adding trip:', error));
	};

	const selectedTrip = trips.filter(asset => asset['id'] === selectedTicket);
	const handleCancel = () => setShowAddPropertyForm(false);
	const AssetView = () => (
		<Container maxWidth='xl' disableGutters sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'scroll', flex: 1 }}>
			<Box>
				<Box
					sx={{
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: { xs: 'flex-start', sm: 'center' },
						justifyContent: 'space-between',
						paddingBottom: { xs: 1, sm: 2 },
						gap: 2,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<TextField
							label='Search'
							variant='outlined'
							size='small'
							sx={{
								'& .MuiOutlinedInput-notchedOutline': {
									borderTopRightRadius: 0,
									borderBottomRightRadius: 0,
								},
							}}
						/>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: '#047A9A',
								padding: '8px',
								borderTopRightRadius: '5px',
								borderBottomRightRadius: '5px',
							}}
						>
							<Search sx={{ color: 'white' }} />
						</Box>
						<Box>
							{icons.map((icon, index) => (
								<IconButton key={index}>{icon}</IconButton>
							))}
						</Box>
					</Box>
				</Box>
				<TripsTable trips={trips} onViewUnitsClick={handleViewDetailsClick} reloadtrips={handleReload} />
			</Box>
			<AddTripForm open={showAddPropertyForm} onSubmit={handleSubmit} onCancel={handleCancel} />
		</Container>
	);

	const DetailView = ({ selectedTrip, isOpen }) => (
		<Container maxWidth='xl' disableGutters sx={{ padding: { xs: 1, sm: 2 } }}>
			<Box sx={{ display: 'flex', padding: '15px 25px' }}>
				<TextField
					label='Search'
					variant='outlined'
					size='small'
					sx={{
						'& .MuiOutlinedInput-notchedOutline': {
							borderTopRightRadius: 0,
							borderBottomRightRadius: 0,
						},
					}}
				/>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: '#047A9A',
						padding: '8px',
						borderTopRightRadius: '5px',
						borderBottomRightRadius: '5px',
					}}
				>
					<Search sx={{ color: 'white' }} />
				</Box>
				<Box>
					{icons.map((icon, index) => (
						<IconButton key={index}>{icon}</IconButton>
					))}
				</Box>
			</Box>
			<Box>
				<TripsTable trips={trips} onViewUnitsClick={handleViewDetailsClick} />
			</Box>
			<div className={`slider ${isOpen ? 'open' : ''}`}>
				<Box sx={{ fontFamily: 'var(--font-family)', padding: 1, position: 'fixed', right: 0, width: '40vw' }}>
					<TripDetails selectedTrip={selectedTrip} />
				</Box>
			</div>
			<AddTripForm open={showAddPropertyForm} onSubmit={handleSubmit} onCancel={handleCancel} />
		</Container>
	);

	const handleIconClick = iconIndex => {
		const newView = iconIndex === 0 ? 'TableView' : 'RequestDetails';
		setCurrentView(newView);
		setIsSliderOpen(iconIndex !== 0);
	};

	const icons = [currentView === 'TableView' ? <Reorder /> : <DisabledByDefaultIcon onClick={() => handleIconClick(0)} />, currentView === 'RequestDetails' ? <Reorder /> : <DragIndicator onClick={() => handleIconClick(1)} />];

	const renderView = () => {
		switch (currentView) {
			case 'TableView':
				return <AssetView />;
			case 'RequestDetails':
				return <DetailView selectedTrip={selectedTrip} isOpen={isSliderOpen} />;
			default:
				return null;
		}
	};

	const handleViewDetailsClick = rowIndex => {
		setCurrentView('RequestDetails');
		setSelectedTicket(rowIndex);
		setIsSliderOpen(true);
	};

	const handleReload = () => setRefesh(true);

	return <>{setTrips.length > 0 ? <>{renderView()}</> : <p> No Data Available </p>}</>;
};

export default Trips;
