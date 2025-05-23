import React, { useState, useEffect } from 'react';
import '../../App.css';
import { useAuthContext } from '../onboarding/authProvider';
import { Button, Box, MenuItem, TextField, Select, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const OrganizationForm = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { user_id, org_id } = useAuthContext();
	// State to hold organization details fetched from backend
	const [organization, setOrganization] = useState({
		logo: '',
		name: '',
		email: '',
		phone: '',
		language: 'English',
		country: 'USA',
		currency: 'USD',
	});

	// State to manage editable fields
	const [editingField, setEditingField] = useState(null);
	const [editedOrganization, setEditedOrganization] = useState({});

	useEffect(() => {
		const fetchOrganization = async () => {
			if (user_id) {
				try {
					const response = await fetch(`${baseURL}/organizations/${org_id}`);
					if (response.ok) {
						const data = await response.json();
						// Assuming data is an array with one item
						if (Array.isArray(data) && data.length > 0) {
							setOrganization(data[0]);
							setEditedOrganization(data[0]); // Initialize edited fields
						} else {
							console.error('Error: Organization data is not an array or is empty');
						}
					} else {
						console.error('Error fetching organization:', response.statusText);
					}
				} catch (error) {
					console.error('Error fetching organization:', error);
				}
			}
		};
		fetchOrganization();
	}, [baseURL, org_id, user_id]);

	const handleFieldChange = (field, value) => {
		const updatedOrg = {
			...editedOrganization,
			[field]: value,
		};
		setEditedOrganization(updatedOrg);
	};

	const handleSave = field => {
		console.log(editedOrganization);
		const url = `${baseURL}/organizations/${org_id}/${user_id}/`;
		const data = {
			org_currency: editedOrganization.org_currency,
			org_diesel_price: editedOrganization.org_diesel_price,
			org_petrol_price: editedOrganization.org_petrol_price,
			org_email: editedOrganization.org_email,
			org_name: editedOrganization.org_name,
			org_size: editedOrganization.org_size,
			org_fiscal_start: editedOrganization.org_fiscal_start,
			org_fiscal_stop: editedOrganization.org_fiscal_stop,
		};
		console.log('Payload Data:', data); // Log the payload

		const options = {
			method: 'PUT', // Specify the HTTP method
			headers: {
				'Content-Type': 'application/json', // Specify the content type of the request body
			},
			body: JSON.stringify(data), // Convert data to JSON string for the request body
		};
		fetch(url, options)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to add trip');
				}
				console.log('trip added successfully');
				setEditingField(null); // Exit edit mode for the field
			})
			.catch(error => {
				console.error('Error adding trip:', error);
			});

		setOrganization(editedOrganization);
	};

	return (
		<Box style={{ padding: '5px', maxWidth: '100%', margin: '0 auto' }}>
			<form>
				{/* Logo */}
				<Box
					style={{
						paddingBottom: '20px',
						marginTop: '15px',
						display: 'flex',
						alignItems: 'center',
						borderBottom: 'solid 0.75px gray',
					}}
				>
					{/* Label Section */}
					<Box style={{ flex: 1, fontWeight: 'light' }}>Logo</Box>

					{/* Display or Edit Mode Section */}
					<Box style={{ flex: 2 }}>
						{editingField === 'logo' ? (
							// Edit Mode: Show Input and Save/Cancel Buttons
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<TextField
									type='text'
									value={editedOrganization.org_logo_url}
									onChange={e => handleFieldChange('logo', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								/>
								<Button
									type='button'
									onClick={() => handleSave('logo')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--primary-color)',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Save
								</Button>
								<Button
									type='button'
									onClick={() => {
										// Cancel changes: Reset the edited field and exit edit mode
										setEditedOrganization(prev => ({ ...prev, logo: organization.org_logo_url }));
										setEditingField(null);
									}}
									style={{
										padding: '5px 10px',
										backgroundColor: 'red',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Cancel
								</Button>
							</Box>
						) : (
							// View Mode: Show Image and Edit Button
							<Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<img
									src={organization.org_logo_url}
									alt='Logo'
									style={{
										width: '100px',
										height: 'auto',
										borderRadius: '50%',
										marginRight: '10px',
									}}
								/>
								<IconButton onClick={() => setEditingField('logo')} sx={{ color: '#047A9A' }}>
									<EditIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>

				{/* Name */}
				<Box style={{ paddingBottom: '20px', marginTop: '15px', display: 'flex', alignItems: 'center', borderBottom: 'solid 0.75px gray' }}>
					<Box style={{ flex: 1, fontWeight: 'light' }}>Name</Box>

					<Box style={{ flex: 2 }}>
						{editingField === 'name' ? (
							// Edit Mode: Show Input and Save Button
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<TextField type='text' value={editedOrganization.org_name} onChange={e => handleFieldChange('name', e.target.value)} style={{ flex: 1, padding: '5px' }} />
								<Button
									type='button'
									onClick={() => handleSave('name')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--primary-color)',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Save
								</Button>
								<Button
									type='button'
									onClick={() => {
										setEditedOrganization(prev => ({ ...prev, name: organization.org_name }));
										setEditingField(null);
									}}
									style={{
										padding: '5px 10px',
										backgroundColor: 'red',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Cancel
								</Button>
							</Box>
						) : (
							// View Mode: Show Field Value and Edit Button
							<Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_name}</Typography>
								<IconButton onClick={() => setEditingField('name')} sx={{ color: '#047A9A' }}>
									<EditIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>

				{/* Email */}
				<Box
					style={{
						paddingBottom: '20px',
						marginTop: '15px',
						display: 'flex',
						alignItems: 'center',
						borderBottom: 'solid 0.75px gray',
					}}
				>
					{/* Label Section */}
					<Box style={{ flex: 1, fontWeight: 'light' }}>Email</Box>

					{/* Display or Edit Mode Section */}
					<Box style={{ flex: 2 }}>
						{editingField === 'email' ? (
							// Edit Mode: Show Input and Save/Cancel Buttons
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<TextField
									type='email'
									value={editedOrganization.org_email}
									onChange={e => handleFieldChange('email', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								/>
								<Button
									type='button'
									onClick={() => handleSave('email')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--primary-color)',
										color: 'black',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Save
								</Button>
								<Button
									type='button'
									onClick={() => {
										// Cancel changes: Reset the edited field and exit edit mode
										setEditedOrganization(prev => ({
											...prev,
											email: organization.org_email,
										}));
										setEditingField(null);
									}}
									style={{
										padding: '5px 10px',
										backgroundColor: 'red',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Cancel
								</Button>
							</Box>
						) : (
							// View Mode: Show Field Value and Edit Button
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_email}</Typography>
								<IconButton onClick={() => setEditingField('email')} sx={{ color: '#047A9A' }}>
									<EditIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>

				{/* Phone */}
				<Box
					style={{
						paddingBottom: '20px',
						marginTop: '15px',
						display: 'flex',
						alignItems: 'center',
						borderBottom: 'solid 0.75px gray',
					}}
				>
					{/* Label Section */}
					<Box style={{ flex: 1, fontWeight: 'light' }}>Phone</Box>

					{/* Display or Edit Mode Section */}
					<Box style={{ flex: 2 }}>
						{editingField === 'phone' ? (
							// Edit Mode: Show Input and Save/Cancel Buttons
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<TextField
									type='text'
									value={editedOrganization.org_phone}
									onChange={e => handleFieldChange('phone', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								/>
								<Button
									type='button'
									onClick={() => handleSave('phone')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--primary-color)',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Save
								</Button>
								<Button
									type='button'
									onClick={() => {
										// Cancel changes: Reset the edited field and exit edit mode
										setEditedOrganization(prev => ({
											...prev,
											phone: organization.org_phone,
										}));
										setEditingField(null);
									}}
									style={{
										padding: '5px 10px',
										backgroundColor: 'red',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Cancel
								</Button>
							</Box>
						) : (
							// View Mode: Show Field Value and Edit Button
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_phone}</Typography>
								<IconButton onClick={() => setEditingField('phone')} sx={{ color: '#047A9A' }}>
									<EditIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>

				{/* Diesel price */}
				<Box
					style={{
						paddingBottom: '20px',
						marginTop: '15px',
						display: 'flex',
						alignItems: 'center',
						borderBottom: 'solid 0.75px gray',
					}}
				>
					<Box style={{ flex: 1, fontWeight: 'light' }}>Diesel Price</Box>
					<Box style={{ flex: 2 }}>
						{editingField === 'org_diesel_price' ? (
							// Edit Mode: Show Input and Save/Cancel Buttons
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<TextField
									type='text'
									value={editedOrganization.org_phone}
									onChange={e => handleFieldChange('org_diesel_price', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								/>
								<Button
									type='button'
									onClick={() => handleSave('org_diesel_price')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--primary-color)',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Save
								</Button>
								<Button
									type='button'
									onClick={() => {
										// Cancel changes: Reset the edited field and exit edit mode
										setEditedOrganization(prev => ({
											...prev,
											org_diesel_price: organization.org_diesel_price,
										}));
										setEditingField(null);
									}}
									style={{
										padding: '5px 10px',
										backgroundColor: 'red',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Cancel
								</Button>
							</Box>
						) : (
							// View Mode: Show Field Value and Edit Button
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_diesel_price}</Typography>

								<IconButton onClick={() => setEditingField('org_diesel_price')} sx={{ color: '#047A9A' }}>
									<EditIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>

				{/* Petrol price */}
				<Box
					style={{
						paddingBottom: '20px',
						marginTop: '15px',
						display: 'flex',
						alignItems: 'center',
						borderBottom: 'solid 0.75px gray',
					}}
				>
					<Box style={{ flex: 1, fontWeight: 'light' }}>Petrol Price</Box>
					<Box style={{ flex: 2 }}>
						{editingField === 'org_petrol_price' ? (
							// Edit Mode: Show Input and Save/Cancel Buttons
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<TextField
									type='text'
									value={editedOrganization.org_phone}
									onChange={e => handleFieldChange('org_petrol_price', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								/>
								<Button
									type='button'
									onClick={() => handleSave('org_petrol_price')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--primary-color)',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Save
								</Button>
								<Button
									type='button'
									onClick={() => {
										// Cancel changes: Reset the edited field and exit edit mode
										setEditedOrganization(prev => ({
											...prev,
											org_petrol_price: organization.org_petrol_price,
										}));
										setEditingField(null);
									}}
									style={{
										padding: '5px 10px',
										backgroundColor: 'red',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Cancel
								</Button>
							</Box>
						) : (
							// View Mode: Show Field Value and Edit Button
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_petrol_price}</Typography>
								<IconButton onClick={() => setEditingField('org_petrol_price')} sx={{ color: '#047A9A' }}>
									<EditIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>

				<Box
					style={{
						paddingBottom: '20px',
						marginTop: '15px',
						display: 'flex',
						alignItems: 'center',
						borderBottom: 'solid 0.75px gray',
					}}
				>
					<h3>Preferences</h3>
				</Box>

				{/* Language */}
				<Box
					style={{
						paddingBottom: '20px',
						marginTop: '15px',
						display: 'flex',
						alignItems: 'center',
						borderBottom: 'solid 0.75px gray',
					}}
				>
					{/* Label Section */}
					<Box style={{ flex: 1, fontWeight: 'light' }}>Language</Box>

					{/* Display or Edit Mode Section */}
					<Box style={{ flex: 2 }}>
						{editingField === 'language' ? (
							// Edit Mode: Show Dropdown and Save/Cancel Buttons
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<Select
									value={editedOrganization.org_lang}
									onChange={e => handleFieldChange('language', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								>
									<MenuItem value='English'>English</MenuItem>
									<MenuItem value='Spanish'>Spanish</MenuItem>
									<MenuItem value='French'>French</MenuItem>
								</Select>
								<Button
									type='button'
									onClick={() => handleSave('language')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--primary-color)',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Save
								</Button>
								<Button
									type='button'
									onClick={() => {
										// Cancel changes: Reset the edited field and exit edit mode
										setEditedOrganization(prev => ({
											...prev,
											language: organization.org_lang,
										}));
										setEditingField(null);
									}}
									style={{
										padding: '5px 10px',
										backgroundColor: 'red',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Cancel
								</Button>
							</Box>
						) : (
							// View Mode: Show Field Value and Edit Button
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_lang}</Typography>
								<IconButton onClick={() => setEditingField('language')} sx={{ color: '#047A9A' }}>
									<EditIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>

				{/* Country */}
				<Box
					style={{
						paddingBottom: '30px',
						display: 'flex',
						alignItems: 'center',
						borderBottom: 'solid 0.75px gray',
					}}
				>
					{/* Label Section */}
					<Box style={{ flex: 1, fontWeight: 'light' }}>Country</Box>

					{/* Display or Edit Mode Section */}
					<Box style={{ flex: 2 }}>
						{editingField === 'country' ? (
							// Edit Mode: Show Dropdown and Save/Cancel Buttons
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<Select
									value={editedOrganization.org_country}
									onChange={e => handleFieldChange('country', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								>
									<MenuItem value='USA'>Kenya</MenuItem>
									<MenuItem value='Canada'>Ghana</MenuItem>
									<MenuItem value='UK'>Other</MenuItem>
								</Select>
								<Button
									type='button'
									onClick={() => handleSave('country')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--primary-color)',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Save
								</Button>
								<Button
									type='button'
									onClick={() => {
										// Cancel changes: Reset the edited field and exit edit mode
										setEditedOrganization(prev => ({
											...prev,
											country: organization.org_country,
										}));
										setEditingField(null);
									}}
									style={{
										padding: '5px 10px',
										backgroundColor: 'red',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Cancel
								</Button>
							</Box>
						) : (
							// View Mode: Show Field Value and Edit Button
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_country}</Typography>
								<IconButton onClick={() => setEditingField('country')} sx={{ color: '#047A9A' }}>
									<EditIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>

				{/* Currency */}
				<Box
					style={{
						paddingBottom: '20px',
						marginTop: '15px',
						marginBottom: '50px',
						display: 'flex',
						alignItems: 'center',
						borderBottom: 'solid 0.75px gray',
					}}
				>
					{/* Label Section */}
					<Box style={{ flex: 1, fontWeight: 'light' }}>Currency</Box>

					{/* Display or Edit Mode Section */}
					<Box style={{ flex: 2 }}>
						{editingField === 'currency' ? (
							// Edit Mode: Show Dropdown and Save/Cancel Buttons
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<Select
									value={editedOrganization.org_currency}
									onChange={e => handleFieldChange('currency', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								>
									<MenuItem value='USD'>Kes</MenuItem>
									<MenuItem value='EUR'>Cedis</MenuItem>
									<MenuItem value='GBP'>Usd</MenuItem>
								</Select>
								<Button
									type='button'
									onClick={() => handleSave('currency')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--primary-color)',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Save
								</Button>
								<Button
									type='button'
									onClick={() => {
										// Cancel changes: Reset the edited field and exit edit mode
										setEditedOrganization(prev => ({
											...prev,
											currency: organization.org_currency,
										}));
										setEditingField(null);
									}}
									style={{
										padding: '5px 10px',
										backgroundColor: 'red',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									Cancel
								</Button>
							</Box>
						) : (
							// View Mode: Show Field Value and Edit Button
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_currency}</Typography>
								<IconButton onClick={() => setEditingField('currency')} sx={{ color: '#047A9A' }}>
									<EditIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>
			</form>
		</Box>
	);
};

export default OrganizationForm;
