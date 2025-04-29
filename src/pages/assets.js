/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import DragIndicator from '@mui/icons-material/DragIndicator';
import Reorder from '@mui/icons-material/Reorder';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import AssetsTable from '../components/assets/assetsTable';
import AddAssetForm from '../components/assets/addAsset';
import BulkUploadForm from '../components/assets/upload';
import AssetDetails from '../components/assets/assetDetails';
import EditAssetDetails from '../components/assets/editAssetDetails';
import { useAuthContext } from '../components/onboarding/authProvider';
import { Container, Box, Grid, Typography, IconButton, TextField, Paper, TableRow, TableCell } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import { Search } from '@mui/icons-material';

const Assets = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { user_id } = useAuthContext();
	const { org_id } = useAuthContext();
	const [currentView, setCurrentView] = useState('TableView'); // Initial view state
	const [selectedTicket, setSelectedTicket] = useState([]);
	const [assets, setAssets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
	const [showBulkUploadForm, setShowBulkUploadForm] = useState(false);
	const [search, setSearch] = useState('');
	const [editAsset, setEditAsset] = useState(null);
	const [filteredAssets, setFilteredAssets] = useState([]);
	console.log(loading);

	const [isSliderOpen, setIsSliderOpen] = useState(false);
	useEffect(() => {
		if (org_id && user_id) {
			const apiUrl = `${baseURL}/assets/${org_id}/${user_id}`;
			fetch(apiUrl)
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					setAssets(data);
					setLoading(false);
				})
				.catch(error => {
					console.error('Error fetching data:', error);
					setLoading(false);
				});
		}
	}, [baseURL, org_id, user_id, showAddPropertyForm]);

	const handleSubmit = assetData => {
		// Define the URL for the POST request
		const url = `${baseURL}/assets/${org_id}/${user_id}/`;
		const data = {
			a_make: assetData.a_make,
			a_model: assetData.a_model,
			a_year: assetData.a_year,
			a_fuel_type: assetData.a_fuel_type,
			a_tank_size: assetData.a_tank_size,
			a_status: assetData.a_status,
			a_license_plate: assetData.a_license_plate,
			a_displacement: assetData.a_displacement,
			a_mileage: assetData.a_mileage,
			a_horsepower: assetData.a_horsepower,
			a_acceleration: assetData.a_acceleration,
			a_insurance_expiry: assetData.a_insurance_expiry,
			a_attachment1: null,
			a_attachment2: null,
		};
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};
		fetch(url, options)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to add asset');
				}
				console.log('Property added successfully');
				setShowAddPropertyForm(false);
			})
			.catch(error => {
				console.error('Error adding asset:', error);
			});
	};
	const selectedAsset = assets.filter(asset => asset['id'] === selectedTicket);

	const handleCancel = () => {
		setShowAddPropertyForm(false);
		setShowBulkUploadForm(false);
	};

	const handleAddPropertyClick = () => {
		setShowAddPropertyForm(true);
	};

	const handleBulkUploadClick = () => {
		setShowBulkUploadForm(true);
	};

	//handling edit
	const handleEditClick = assetId => {
		const asset = assets.find(o => o.id === assetId);
		setEditAsset(asset);
		setIsSliderOpen(true);
	};

	const handleEditCancel = () => {
		setEditAsset(null);
		setIsSliderOpen(false);
	};

	const handleSaveEdit = updatedAsset => {
		const url = `${baseURL}/assets/${org_id}/${user_id}/${updatedAsset.id}`;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedAsset),
		};
		fetch(url, options)
			.then(response => response.json())
			.then(() => {
				setAssets(prevAssets => prevAssets.map(asset => (asset.id === updatedAsset.id ? updatedAsset : asset)));
				setEditAsset(null);
				setIsSliderOpen(false);
			})
			.catch(error => {
				console.error('Error updating asset:', error);
			});
	};

	//handling search by vehicle registration and driver/asset
	useEffect(() => {
		let filtered = assets;
		if (search) {
			filtered = filtered.filter(asset => asset.a_license_plate.toLowerCase().includes(search.toLowerCase()));
		}
		setFilteredAssets(filtered);
	}, [search, assets]);

	const AssetView = () => (
		<Container width='100%' sx={{ fontFamily: 'var(--font-family)', padding: 1 }}>
			<Box>
				<Grid item xs={12} marginBottom={5}>
					<Box display='flex' justifyContent='space-between'>
						<Typography variant='h6'>Assets</Typography>

						<Box display='flex' justifyContent='flex-end' gap={2} color='var(--primary-text-color)'>
							{/* Bulk Button */}
							<IconButton
								onClick={handleBulkUploadClick}
								sx={{
									border: '1px solid #01947A',
									borderRadius: '4px',
									padding: '4.5px',
								}}
							>
								<Box
									sx={{
										width: 30,
										height: 32,
										backgroundColor: '#01947A',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<UploadIcon sx={{ fontSize: 20, color: 'white' }} />
								</Box>
								<Typography
									variant='body2'
									sx={{
										paddingLeft: '3px',
										color: 'var(--primary-text-color)',
									}}
								>
									Bulk Upload
								</Typography>
							</IconButton>

							{/* Add button  */}
							<IconButton
								onClick={handleAddPropertyClick}
								sx={{
									border: '1px solid #047A9A',
									borderRadius: ' 4px',
									padding: '4.5px',
								}}
							>
								<Box
									sx={{
										width: 30,
										height: 32,
										backgroundColor: '#047A9A',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<AddIcon sx={{ fontSize: 20, color: 'white' }} />
								</Box>
								<Typography
									variant='body2'
									sx={{
										paddingLeft: '3px',
										color: 'var(--primary-text-color)',
									}}
								>
									Add Asset
								</Typography>
							</IconButton>
						</Box>
					</Box>
				</Grid>

				<Grid item xs={12} component={Paper}>
					<Box
						sx={{
							display: 'flex',
							padding: '15px 25px',
						}}
					>
						{/* Search Box */}
						<TextField
							label='Search'
							variant='outlined'
							size='small'
							onChange={e => setSearch(e.target.value)}
							value={search}
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
						{/* Icons */}
						<Box>
							{icons.map((icon, index) => (
								<IconButton key={index}>{icon}</IconButton>
							))}
						</Box>
					</Box>

					<Box>
						{filteredAssets.length > 0 ? (
							<AssetsTable assets={filteredAssets.length > 0 ? filteredAssets : assets} onViewUnitsClick={handleViewDetailsClick} onEditClick={handleEditClick} />
						) : (
							<TableRow>
								<TableCell align='center' colSpan={7}>
									No records found
								</TableCell>
							</TableRow>
						)}
					</Box>
				</Grid>
			</Box>

			<AddAssetForm open={showAddPropertyForm} onSubmit={handleSubmit} onCancel={handleCancel} />

			<BulkUploadForm open={showBulkUploadForm} onSubmit={handleSubmit} onCancel={handleCancel} />
			{editAsset && isSliderOpen && <EditAssetDetails selectedAsset={editAsset} open={isSliderOpen} onCancel={handleEditCancel} onSave={handleSaveEdit} />}
		</Container>
	);

	const DetailView = ({ selectedAsset, isOpen }) => (
		<Container width='100%' sx={{ fontFamily: 'var(--font-family)', padding: 1 }}>
			<Box>
				<Grid item xs={12} marginBottom={5}>
					<Box display='flex' justifyContent='space-between'>
						<Typography variant='h6'>Assets</Typography>

						<Box display='flex' justifyContent='flex-end' gap={2} color='var(--primary-text-color)'>
							{/* Bulk Button */}
							<IconButton
								onClick={handleBulkUploadClick}
								sx={{
									border: '1px solid #01947A', // Change color for differentiation
									borderRadius: '4px',
									padding: '4.5px',
								}}
							>
								<Box
									sx={{
										width: 30,
										height: 32,
										backgroundColor: '#01947A',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<UploadIcon sx={{ fontSize: 20, color: 'white' }} />
								</Box>
								<Typography
									variant='body2'
									sx={{
										paddingLeft: '3px',
										color: 'var(--primary-text-color)',
									}}
								>
									Bulk Upload
								</Typography>
							</IconButton>

							{/* Add button  */}
							<IconButton
								onClick={handleAddPropertyClick}
								sx={{
									border: '1px solid #047A9A',
									borderRadius: ' 4px',
									padding: '4.5px',
								}}
							>
								<Box
									sx={{
										width: 30,
										height: 32,
										backgroundColor: '#047A9A',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<AddIcon sx={{ fontSize: 20, color: 'white' }} />
								</Box>
								<Typography
									variant='body2'
									sx={{
										paddingLeft: '3px',
										color: 'var(--primary-text-color)',
									}}
								>
									Add Asset
								</Typography>
							</IconButton>
						</Box>
					</Box>
				</Grid>

				<Grid item xs={12} component={Paper}>
					<Box
						sx={{
							display: 'flex',
							padding: '15px 25px',
						}}
					>
						{/* Search Box */}
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
						{/* Icons */}
						<Box>
							{icons.map((icon, index) => (
								<IconButton key={index}>{icon}</IconButton>
							))}
						</Box>
					</Box>

					<Box>
						<AssetsTable assets={assets} onViewUnitsClick={handleViewDetailsClick} />
					</Box>
				</Grid>
			</Box>

			<AddAssetForm open={showAddPropertyForm} onSubmit={handleSubmit} onCancel={handleCancel} />

			<BulkUploadForm open={showBulkUploadForm} onSubmit={handleSubmit} onCancel={handleCancel} />

			<div className={`slider ${isOpen ? 'open' : ''}`}>
				<Box sx={{ fontFamily: 'var(--font-family)', padding: 1, position: 'fixed', right: 0, width: '40vw' }}>
					<AssetDetails selectedAsset={selectedAsset} />
				</Box>
			</div>
		</Container>
	);

	const handleIconClick = iconIndex => {
		const newView = iconIndex === 0 ? 'TableView' : 'RequestDetails'; // Determine view based on index
		setCurrentView(newView);
		setIsSliderOpen(iconIndex !== 0); // Open slider if iconIndex is not 0
	};

	const icons = [
		currentView === 'TableView' ? (
			<Reorder />
		) : (
			<>
				<DisabledByDefaultIcon onClick={() => handleIconClick(0)} />
			</>
		),

		currentView === 'RequestDetails' ? <Reorder /> : <DragIndicator onClick={() => handleIconClick(1)} />,
	];

	const renderView = () => {
		switch (currentView) {
			case 'TableView':
				return <AssetView />;
			case 'RequestDetails':
				return (
					<>
						<DetailView selectedAsset={selectedAsset} isOpen={isSliderOpen} />
					</>
				); // Replace with actual rendering logic for RequestDetails
			default:
				return null;
		}
	};

	const handleViewDetailsClick = rowIndex => {
		setCurrentView('RequestDetails');
		setSelectedTicket(rowIndex);
		setIsSliderOpen(true);
	};
	console.log(currentView, selectedTicket);

	return <>{assets.length > 0 ? <>{renderView()}</> : <p> add Assets </p>}</>;
};

export default Assets;
