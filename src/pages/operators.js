/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
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
import { Container, Box, Grid, Typography, IconButton, TextField, Paper, TableRow, TableCell, Alert, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteOperator from '../components/operators/deleteOperator';

const Operators = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { user_id, org_id } = useAuthContext();
	const [currentView, setCurrentView] = useState('TableView'); // Initial view state
	const [selectedOperator, setSelectedOperator] = useState([]);
	const [operators, setOperators] = useState([]);
	const [filteredOperators, setFilteredOperators] = useState([]);
	const [, setLoading] = useState(true);
	const [isSliderOpen, setIsSliderOpen] = useState(false);
	const [isDeleteSliderOpen, setIsDeleteSliderOpen] = useState(false);
	const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
	const [showBulkUploadForm, setShowBulkUploadForm] = useState(false);
	const [search, setSearch] = useState('');
	const [editOperator, setEditOperator] = useState(null);
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

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
					setOperators(data);
					setLoading(false);
				})
				.catch(error => {
					console.error('Error fetching data:', error);
					setLoading(false);
				});
		}
	}, [baseURL, org_id, user_id, showAddPropertyForm, isSliderOpen]);

	const handleSubmit = async operatorData => {
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
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};
		fetch(url, options)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to add Operator - check email and mandatory fields ');
				}
				console.log('Operator added successfully');
				setShowAddPropertyForm(false);
				setSuccessMsg('Operator Added successfully!');
			})
			.catch(error => {
				setErrorMsg(error.message);
				console.error('Error adding Operator:', error);
			});
	};

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
		const operator = operators.find(o => o.id === operatorId);
		setEditOperator(operator);
		setIsSliderOpen(true);
	};

	//handling delete
	const handleDeleteClick = operatorId => {
		const operator = operators.find(o => o.id === operatorId);
		setEditOperator(operator);
		setIsDeleteSliderOpen(true);
	};

	const handleViewDetailsClick = (operatorId) => {
		setSelectedOperator(operators.find(operator => operator.id === operatorId));
		
		setCurrentView('RequestDetails');
		setIsSliderOpen(true);
	};

	const handleEditCancel = () => {
		setEditOperator(null);
		setIsSliderOpen(false);
	};

	const handleDeleteCancel = () => {
		setEditOperator(null);
		setIsDeleteSliderOpen(false);
	};

	const handleSaveEdit = updatedOperator => {
		const url = `${baseURL}/operators/${org_id}/${user_id}/${updatedOperator.id}/`;
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
				setIsSliderOpen(false);
			})
			.catch(error => {
				console.error('Error updating operator:', error);
			});
	};

	const handleSaveDelete = updatedOperator => {
		const url = `${baseURL}/operators/${org_id}/${user_id}/${updatedOperator.id}/`;
		const options = {
			method: 'DELETE',
			headers: {
					'Content-Type': 'application/json',
				},
			};

		fetch(url, options)
			.then(response => response.json())
			.then(() => {
				setIsDeleteSliderOpen(false);
				setFilteredOperators(filteredOperators => filteredOperators.filter(operator => operator.id !== updatedOperator.id));
				setEditOperator(null);
				setSuccessMsg('Operator deleted successfully!');
			})
			.catch(error => {
				console.error('Error updating operator:', error);
			});
	};

	//handling search by driver name or contact
	useEffect(() => {
		const filteredOperators = operators.filter(operator => {
			if (!search) return true;

			const searchQuery = search.toLowerCase();
			const phone = operator.o_phone ? operator.o_phone.toString() : '';
			const localFormat = phone.startsWith('254') ? '0' + phone.slice(3) : phone;

			return operator.o_name?.toLowerCase().includes(searchQuery) || phone.includes(searchQuery) || localFormat.includes(searchQuery);
		});
		setFilteredOperators(filteredOperators);
	}, [search, operators]);

	const AssetView = () => (
		<Stack spacing={2}>
			{' '}
			{errorMsg && <Alert severity='error' onClose={() => setErrorMsg(null)} >{errorMsg}</Alert>}
			{successMsg && <Alert severity='success' onClose={() => setSuccessMsg(null)} >{successMsg}</Alert>}
			<Container width='100%' sx={{ fontFamily: 'var(--font-family)', padding: 1 }}>
				<Box>
					<Grid item xs={12} marginBottom={5}>
						<Box display='flex' justifyContent='space-between'>
							<Typography variant='h6' sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>
								Drivers
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
										Add Driver
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
							{filteredOperators.length > 0 ? (
								<OperatorTable operators={filteredOperators} onViewUnitsClick={handleViewDetailsClick} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
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
				{editOperator && isDeleteSliderOpen && <DeleteOperator selectedOperator={editOperator} open={isDeleteSliderOpen} onCancel={handleDeleteCancel} onSave={handleSaveDelete} />}
			</Container>
		</Stack>
	);

	const DetailView = ({ isOpen }) => (
		<div className='fluidGrid'>
			<ActionNav title='assets' icons={icons} onAddClick={handleAddPropertyClick} icontitle='Add Operator' onSecondClick={handleAddPropertyClick} bulktitle='Bulk Upload' />

			<OperatorTable operators={operators} onViewUnitsClick={handleViewDetailsClick} />

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



	return <> {renderView()} </>;
};

export default Operators;
