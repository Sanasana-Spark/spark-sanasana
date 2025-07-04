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
		country: 'Ghana',
		currency: 'Cedis',
		petrol_price:0,
		diesel_price:0
	});

	const [editingField, setEditingField] = useState(null);
	const [editedOrganization, setEditedOrganization] = useState({});
	const [saving, setSaving] = useState(false);

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
							setEditedOrganization(data[0]);
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
	}, [baseURL, org_id, user_id ]);

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
			org_country: editedOrganization.org_country,
			org_phone: editedOrganization.org_phone,
			org_lang: editedOrganization.org_lang,
			org_diesel_price: editedOrganization.org_diesel_price,
			org_petrol_price: editedOrganization.org_petrol_price,
			org_logo: editedOrganization.org_logo,
			org_email: editedOrganization.org_email,
			org_name: editedOrganization.org_name,
			org_size: editedOrganization.org_size,
			org_fiscal_start: editedOrganization.org_fiscal_start,
			org_fiscal_stop: editedOrganization.org_fiscal_stop,
		};
		console.log('Payload Data:', data);

		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};
		fetch(url, options)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to update details');
				}
				console.log('updated successfully');
				setEditingField(null);
				setSaving(false);
			})
			.catch(error => {
				console.error('Error saving :', error);
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
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								{/* Preview the uploaded image */}
								{editedOrganization.org_logo && <img src={editedOrganization.org_logo} alt='Preview' style={{ width: '60px', height: '60px', borderRadius: '50%' }} />}

								{/* File input */}
								<input
									type='file'
									accept='image/*'
									onChange={e => {
										const file = e.target.files[0];
										if (file) {
											const reader = new FileReader();
											reader.onloadend = () => {
												handleFieldChange('org_logo', reader.result); // base64 string
											};
											reader.readAsDataURL(file);
										}
									}}
								/>

								<Button
									type='button'
									onClick={() => handleSave('org_logo')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--secondary-color)',
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
										setEditedOrganization(prev => ({
											...prev,
											org_logo: organization.org_logo,
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
							<Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								{organization.org_logo ? (
									<img
										src={organization.org_logo}
										alt='Logo'
										style={{
											width: '100px',
											height: 'auto',
											borderRadius: '50%',
											marginRight: '10px',
										}}
									/>
								) : (
									<Typography style={{ fontStyle: 'italic' }}>No logo</Typography>
								)}
								<IconButton onClick={() => setEditingField('logo')} sx={{ color: 'var(--secondary-color)' }}>
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
										backgroundColor: 'var(--secondary-color)',
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
								<IconButton onClick={() => setEditingField('name')} sx={{ color: 'var(--secondary-color)' }}>
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
									onChange={e => handleFieldChange('org_email', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								/>
								<Button
									type='button'
									onClick={() => handleSave('org_email')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--secondary-color)',
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
											org_email: organization.org_email,
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
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_email}</Typography>
								<IconButton onClick={() => setEditingField('email')} sx={{ color: 'var(--secondary-color)' }}>
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
							// Edit Mode
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<TextField
									type='text'
									value={editedOrganization.org_phone}
									onChange={e => handleFieldChange('org_phone', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								/>
								<Button
									type='button'
									onClick={() => handleSave('org_phone')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--secondary-color)',
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
										setEditedOrganization(prev => ({
											...prev,
											org_phone: organization.org_phone,
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
							// View Mode
							<Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_phone || 'Not set'}</Typography>
								<IconButton onClick={() => setEditingField('phone')} sx={{ color: 'var(--secondary-color)' }}>
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
						{editingField === 'diesel_price' ? (
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<TextField
									type='text'
									value={editedOrganization.org_diesel_price}
									onChange={e => handleFieldChange('org_diesel_price', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								/>
								<Button
									type='button'
									onClick={() => {
										setSaving(true);
										handleSave('org_diesel_price');
									}}
									disabled={saving}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--secondary-color)',
										color: 'white',
										border: 'none',
										borderRadius: '3px',
									}}
								>
									{saving ? 'Saving...' : 'Save'}
								</Button>
								<Button
									type='button'
									onClick={() => {
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
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_diesel_price}</Typography>

								<IconButton onClick={() => setEditingField('diesel_price')} sx={{ color: 'var(--secondary-color)' }}>
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
						{editingField === 'petrol_price' ? (
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<TextField
									type='number'
									value={editedOrganization.org_petrol_price}
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
										backgroundColor: 'var(--secondary-color)',
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
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_petrol_price}</Typography>
								<IconButton onClick={() => setEditingField('petrol_price')} sx={{ color: 'var(--secondary-color)' }}>
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
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<Select
									value={editedOrganization.org_lang}
									onChange={e => handleFieldChange('org_lang', e.target.value)}
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
									onClick={() => handleSave('org_lang')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--secondary-color)',
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
										setEditedOrganization(prev => ({
											...prev,
											org_lang: organization.org_lang,
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
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_lang}</Typography>
								<IconButton onClick={() => setEditingField('language')} sx={{ color: 'var(--secondary-color)' }}>
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
					<Box style={{ flex: 1, fontWeight: 'light' }}>Country</Box>

					<Box style={{ flex: 2 }}>
						{editingField === 'country' ? (
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<Select value={editedOrganization.org_country} onChange={e => handleFieldChange('org_country', e.target.value)} style={{ flex: 1, padding: '5px' }}>
									<MenuItem value='Kenya'>Kenya</MenuItem>
									<MenuItem value='Ghana'>Ghana</MenuItem>
									<MenuItem value='Ethiopia'>Ethiopia</MenuItem>
									<MenuItem value='Nigeria'>Nigeria</MenuItem>
									<MenuItem value='Uganda'>Uganda</MenuItem>
									<MenuItem value='Tanzania'>Tanzania</MenuItem>
									<MenuItem value='USA'>USA</MenuItem>
									<MenuItem value='Other'>Other</MenuItem>
								</Select>

								<Button
									type='button'
									onClick={() => handleSave('org_country')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--secondary-color)',
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
										setEditedOrganization(prev => ({
											...prev,
											org_country: organization.org_country,
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
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_country}</Typography>
								<IconButton onClick={() => setEditingField('country')} sx={{ color: 'var(--secondary-color)' }}>
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
							<Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<Select
									value={editedOrganization.org_currency}
									onChange={e => handleFieldChange('org_currency', e.target.value)}
									style={{
										flex: 1,
										padding: '5px',
									}}
								>
									<MenuItem value='KES'>Kes</MenuItem>
									<MenuItem value='GHS'>Cedis</MenuItem>
									<MenuItem value='NGN'>Naira</MenuItem>
									<MenuItem value='UGX'>Ush</MenuItem>
									<MenuItem value='TZS'>Tsh</MenuItem>
									<MenuItem value='Birr'>Birr</MenuItem>
									<MenuItem value='USD'>Usd</MenuItem>
								</Select>

								<Button
									type='button'
									onClick={() => handleSave('org_currency')}
									style={{
										padding: '5px 10px',
										backgroundColor: 'var(--secondary-color)',
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
										setEditedOrganization(prev => ({
											...prev,
											org_currency: organization.org_currency,
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
							<Box
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Typography style={{ margin: 0, flex: 1 }}>{organization.org_currency}</Typography>
								<IconButton onClick={() => setEditingField('currency')} sx={{ color: 'var(--secondary-color)' }}>
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
