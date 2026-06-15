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
import { IconButton, TextField, Alert } from '@mui/material';
import DeleteOperator from '../components/operators/deleteOperator';
import KpiCard from '../components/ui/KpiCard';

const Operators = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const {apiFetch } = useAuthContext();
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
	const totalCount = operators.length;

	useEffect(() => {
		const apiUrl = `${baseURL}/operators/`;
		// to be corrected to dynamic
		apiFetch(apiUrl, { method: 'GET' })
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

	}, [baseURL, apiFetch, showAddPropertyForm, isSliderOpen]);

	const handleSubmit = async operatorData => {
		const url = `${baseURL}/operators/`;
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
		apiFetch(url, { method: 'POST', body: JSON.stringify(data) })
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

	const handleSaveEdit = (updatedOperator, onSuccess, onError) => {
		const url = `${baseURL}/operators/${updatedOperator.id}/`;
		apiFetch(url, { method: 'PUT', body: JSON.stringify(updatedOperator) })
			.then(async response => {
				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || 'Server error');
				}
				onSuccess();
			})
			.catch(error => {
				console.error('Error updating operator:', error);
				onError();
			});
	};

	const handleSaveDelete = updatedOperator => {
		const url = `${baseURL}/operators/${updatedOperator.id}/`;
		apiFetch(url, { method: 'DELETE' })
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
		<div className="page">
			{' '}
			{errorMsg && (
				<Alert severity='error' onClose={() => setErrorMsg(null)}>
					{errorMsg}
				</Alert>
			)}
			{successMsg && (
				<Alert severity='success' onClose={() => setSuccessMsg(null)}>
					{successMsg}
				</Alert>
			)}

			<div className="page-header">
						<div className="page-title">Drivers</div>
						 <div className="page-actions">
						<button className="btn btn-secondary" onClick={handleBulkUploadClick}>+ Bulk Upload</button>
          				<button className="btn btn-primary" onClick={handleAddPropertyClick}>+ Add Driver</button>
						</div>
			
			</div>

			 <div className="grid-4">
				<KpiCard label="Total drivers" value={totalCount} icon="👤" color="var(--lime)"  chipColor="var(--lime-bg)"  footer="3 cities" />
				<KpiCard label="Avg score"     value={totalCount} icon="⭐" color="var(--blue)"  chipColor="var(--blue-bg)"  footer="↑ 3 pts vs last month" footerType="up" />
				<KpiCard label="Incidents"     value={totalCount}  icon="⚠"  color="var(--amber)" chipColor="var(--amber-bg)" footer="This month" />
				<KpiCard label="Top driver"    value={totalCount} icon="🏆" color="var(--forest)" chipColor="var(--lime-bg)" footer="Score 96 · 4,220 km" />
			</div>

							{filteredOperators.length > 0 ? (
							<div className="card">
								<div className="card-header">
				<div className="card-title">
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
								{icons.map((icon, index) => (
									<IconButton key={index}>{icon}</IconButton>
								))}

				</div>
				</div>
									<OperatorTable operators={filteredOperators} onViewUnitsClick={handleViewDetailsClick} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
								</div>
	
							) : (
								<tr>
									<td align='center' colSpan={7}>
										No records found
									</td>
								</tr>
							)}

		
				<AddOperatorForm open={showAddPropertyForm} onSubmit={handleSubmit} onCancel={handleCancel} />

				<BulkUploadForm open={showBulkUploadForm} onSubmit={handleSubmit} onCancel={handleCancel} />
				{editOperator && isSliderOpen && <EditOperatorDetails selectedOperator={editOperator} open={isSliderOpen} onCancel={handleEditCancel} onSave={handleSaveEdit} />}
				{editOperator && isDeleteSliderOpen && <DeleteOperator selectedOperator={editOperator} open={isDeleteSliderOpen} onCancel={handleDeleteCancel} onSave={handleSaveDelete} />}
		
		</div>
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
