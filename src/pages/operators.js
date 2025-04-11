/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, useCallback } from 'react';
import DragIndicator from '@mui/icons-material/DragIndicator';
import Reorder from '@mui/icons-material/Reorder';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ActionNav from '../components/operators/actionOperatorNav';
import OperatorTable from '../components/operators/operatorTable';
import AddOperatorForm from '../components/operators/addOperator';
import BulkUploadForm from '../components/assets/upload';
import OperatorDetails from '../components/operators/operatorDetails';
import { useAuthContext } from '../components/onboarding/authProvider';
import EditOperatorDetails from '../components/operators/editOperatorDetails';
import { Container, Box, Grid, Typography, IconButton, TextField, Paper, TableRow, TableCell } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

const Operators = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { user_id, org_id } = useAuthContext();
	const [currentView, setCurrentView] = useState('TableView'); // Initial view state
	const [selectedTicket, setSelectedTicket] = useState([]);
	const [assets, setAssets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isSliderOpen, setIsSliderOpen] = useState(false);
	const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
	const [showBulkUploadForm, setShowBulkUploadForm] = useState(false);
	const [search, setSearch] = useState('');
	const [editOperator, setEditOperator] = useState(null);
	console.log(loading);

	useEffect(() => {
		if (org_id && user_id) {
			const apiUrl = `${baseURL}/operators/${org_id}/${user_id}`;
			// to be corrected to dynamic
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

	const handleSubmit = operatorData => {
		// Define the URL for the POST request
		const url = `${baseURL}/operators/${org_id}/${user_id}/`;
		const data = {
			o_name: operatorData.o_name,
			o_email: operatorData.o_email,
			o_phone: operatorData.o_phone,
			o_national_id: operatorData.o_national_id,
			o_lincense_id: operatorData.o_lincense_id,
			o_lincense_type: operatorData.o_lincense_type,
			o_lincense_expiry: operatorData.o_lincense_expiry,
			o_payment_card_id: operatorData.o_payment_card_id,
			o_Payment_card_no: operatorData.o_Payment_card_no,
			o_role: operatorData.o_role,
			o_status: operatorData.o_status,
			o_cum_mileage: operatorData.o_cum_mileage,
			o_expirence: operatorData.o_expirence,
			o_assigned_asset: operatorData.o_assigned_asset,
		};
		const options = {
			method: 'POST', // Specify the HTTP method
			headers: {
				'Content-Type': 'application/json', // Specify the content type of the request body
			},
			body: JSON.stringify(data), // Convert data to JSON string for the request body
		};
		fetch(url, options)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to add Operator');
				}
				console.log('Operator added successfully');
				setShowAddPropertyForm(false);
			})
			.catch(error => {
				console.error('Error adding Operator:', error);
			});
	};
	const selectedOperator = assets.find(operator => operator['id'] === selectedTicket);

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
	const handleEditClick = operatorId => {
		const operator = assets.find(o => o.id === operatorId);
		setEditOperator(operator);
		setIsSliderOpen(true);
	};

	const handleEditCancel = () => {
		setEditOperator(null);
		setIsSliderOpen(false);
	};

	const handleSaveEdit = updatedOperator => {
		const url = `${baseURL}/operators/${org_id}/${user_id}/${updatedOperator.id}`;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedOperator),
		};
		fetch(url, options)
			.then(response => response.json())
			.then(() => {
				setAssets(prevAssets => prevAssets.map(asset => (asset.id === updatedOperator.id ? updatedOperator : asset)));
				setEditOperator(null);
				setIsSliderOpen(false);
			})
			.catch(error => {
				console.error('Error updating operator:', error);
			});
	};

	//handling search by driver name or contact
	const filteredAssets = assets.filter(operator => {
		if (!search) return true;

		const searchQuery = search.toLowerCase();
		const phone = operator.o_phone ? operator.o_phone.toString() : '';
		const localFormat = phone.startsWith('254') ? '0' + phone.slice(3) : phone;

		return operator.o_name?.toLowerCase().includes(searchQuery) || phone.includes(searchQuery) || localFormat.includes(searchQuery);
	});

	const AssetView = () => (
		<Container width='100%' sx={{ fontFamily: 'var(--font-family)', padding: 1 }}>
			<Box>
				<Grid item xs={12} marginBottom={5}>
					<Box display='flex' justifyContent='space-between'>
						<Typography variant='h6' sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>
							Operators
						</Typography>

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
									Add Operator
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
							placeholder='Search'
							variant='outlined'
							size='small'
							value={search}
							onChange={e => setSearch(e.target.value)}
							sx={{
								'& .MuiOutlinedInput-notchedOutline': {
									borderTopRightRadius: 0,
									borderBottomRightRadius: 0,
								},
							}}
						/>

						{/* Icons */}
						<Box>
							{icons.map((icon, index) => (
								<IconButton key={index}>{icon}</IconButton>
							))}
						</Box>
					</Box>

					<Box>
						{filteredAssets.length > 0 ? (
							<OperatorTable operators={filteredAssets} onViewUnitsClick={handleViewDetailsClick} onEditClick={handleEditClick} />
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

			<AddOperatorForm open={showAddPropertyForm} onSubmit={handleSubmit} onCancel={handleCancel} />

			<BulkUploadForm open={showBulkUploadForm} onSubmit={handleSubmit} onCancel={handleCancel} />
			{editOperator && isSliderOpen && <EditOperatorDetails selectedOperator={editOperator} open={isSliderOpen} onCancel={handleEditCancel} onSave={handleSaveEdit} />}
		</Container>
	);

	const DetailView = ({ selectedOperator, isOpen }) => (
		<div className='fluidGrid'>
			<ActionNav title='assets' icons={icons} onAddClick={handleAddPropertyClick} icontitle='Add Operator' onSecondClick={handleAddPropertyClick} bulktitle='Bulk Upload' />

			<OperatorTable operators={assets} onViewUnitsClick={handleViewDetailsClick} />

			<AddOperatorForm open={showAddPropertyForm} onSubmit={handleSubmit} onCancel={handleCancel} />

			<div className={`slider ${isOpen ? 'open' : ''}`}>
				<OperatorDetails selectedOperator={selectedOperator} />
			</div>
		</div>
	);

	const handleIconClick = iconIndex => {
		const newView = iconIndex === 0 ? 'TableView' : 'RequestDetails';
		setCurrentView(newView);
		setIsSliderOpen(iconIndex !== 0);
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
						<DetailView selectedOperator={selectedOperator} isOpen={isSliderOpen} />
					</>
				);
			default:
				return null;
		}
	};

	const handleViewDetailsClick = useCallback(rowIndex => {
		setCurrentView('RequestDetails');
		setSelectedTicket(rowIndex);
		setIsSliderOpen(true);
	}, []);

	console.log(currentView, selectedTicket);

	return <>{assets.length > 0 ? <>{renderView()}</> : <p> Add Operators </p>}</>;
};

export default Operators;
