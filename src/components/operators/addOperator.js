import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useAuthContext } from '../onboarding/authProvider';

const AddAssetForm = ({ onSubmit, onCancel, open }) => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { user_id, org_id } = useAuthContext();
	const [saving, setSaving] = useState(false);
	const [assetOptions, setAssetOptions] = useState([]);
	const [loading, setLoading] = useState(true);

	const [operator, setOperator] = useState({
		o_status: 'Active',
		o_cum_mileage: 0,
		o_role: 'Driver',
		o_class: 'Class B',
		o_email: null,
		o_phone: null,
		o_lincense_id: null,
		o_national_id: null,
	});

	const [errors, setErrors] = useState({
		o_email: null,
		o_phone: null,
	});


	useEffect(() => {
		if (!open) return; // Only fetch when dialog is open
		if (org_id && user_id) {
			const apiUrl = `${baseURL}/assets/${org_id}/${user_id}`;
			setLoading(true);
			fetch(apiUrl)
				.then(response => {
					if (!response.ok) throw new Error('Network response was not ok');
					return response.json();
				})
				.then(data => {
					setAssetOptions(data.assets || []);
					setLoading(false);
				})
				.catch(error => {
					console.error('Error fetching assets:', error);
					setLoading(false);
				});
		}
	},
	// eslint-disable-next-line
	 [org_id, user_id, open]);

	const handleChange = e => {
		const { name, value } = e.target;

		if (name === 'o_email') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			setErrors(prev => ({
				...prev,
				o_email: emailRegex.test(value) ? '' : 'Enter a valid email address',
			}));
		}

		if (name === 'o_phone') {
			setErrors(prev => ({
				...prev,
				o_phone: /^\d+$/.test(value) ? '' : 'Phone must be numeric',
			}));
		}

		setOperator(prevAsset => ({
			...prevAsset,
			[name]: value,
		}));
	};

	const handleSubmit = e => {
		e.preventDefault();
		setSaving(true);
		onSubmit(operator);
	};

	// const handleFileChange = e => {
	// 	const { name, files } = e.target;
	// 	const file = files[0];

	// 	setOperator(prev => ({
	// 		...prev,
	// 		[name]: file,
	// 	}));
	// };

	return (
		<Dialog open={open} onClose={onCancel} aria-labelledby='form-dialog-title'>
			<DialogTitle id='form-dialog-title'>Add Driver</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2} paddingTop={1}>
					
						{/* fix if you want to add an image upload feature */}
						{/* <Grid item xs={12}>
							<FormControl fullWidth>
								<FormLabel>Profile</FormLabel>
								<input accept='image/*' type='file' onChange={handleFileChange} name='o_image' />
							</FormControl>
						</Grid> */}

						<Grid item xs={12} sm={6}>
							<TextField fullWidth required label='Operators Name' name='o_name' value={operator.o_name} onChange={handleChange} />
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField fullWidth required label='Email' name='o_email' type='email' value={operator.o_email} onChange={handleChange} error={!!errors.o_email} helperText={errors.o_email} />
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField fullWidth required  label='Phone' name='o_phone' value={operator.o_phone} onChange={handleChange} error={!!errors.o_phone} helperText={errors.o_phone} />
						</Grid>

							<Grid item xs={12} sm={6}>
							<FormControl required fullWidth>
								<InputLabel id='asset-label'>Assigned Vehicle</InputLabel>
								<Select
									labelId='asset-label'
									name='o_assigned_asset'
									value={operator.o_assigned_asset || ''}
									onChange={handleChange}
									label='Assigned Vehicle'
									disabled={loading}
								>
									{loading ? (
										<MenuItem disabled>Loading vehicles...</MenuItem>
									) : assetOptions.length > 0 ? (
										assetOptions.map(asset => (
											<MenuItem key={asset.id} value={asset.id}>
												{asset.a_license_plate} - {asset.a_status}
											</MenuItem>
										))
									) : (
										<MenuItem disabled>No vehicles found</MenuItem>
									)}
								</Select>
							</FormControl>
						</Grid>


					

						<Grid item xs={12} sm={6}>
							<FormControl required fullWidth>
								<TextField select label='License Type' name='o_class' value={operator.o_class} onChange={handleChange}>
									<MenuItem value='Class A'>Class A</MenuItem>
									<MenuItem value='Class B'>Class B</MenuItem>
									<MenuItem value='Class C'>Class C</MenuItem>
									<MenuItem value='Class D'>Class D</MenuItem>
									<MenuItem value='Class E'>Class E</MenuItem>
									<MenuItem value='Class F'>Class F</MenuItem>
								</TextField>
							</FormControl>
						</Grid>

						{/* <Grid item xs={12} sm={6}>
							<FormControl required fullWidth>
								<TextField select label='Role' name='o_role' value={operator.o_role} onChange={handleChange} disabled>
									<MenuItem value='Driver'>Driver</MenuItem>
									<MenuItem value='Others'>Others</MenuItem>
								</TextField>
							</FormControl>
						</Grid> */}

						<Grid item xs={12} sm={6}>
							<TextField fullWidth required label='License Expiry' name='o_lincense_expiry' type='date' value={operator.o_lincense_expiry || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />
						</Grid>

							<Grid item xs={12} sm={6}>
							<TextField fullWidth label='National ID' name='o_national_id' value={operator.o_national_id} onChange={handleChange} />
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField fullWidth label='License ID' name='o_lincense_id' value={operator.o_lincense_id} onChange={handleChange} />
						</Grid>

					

						{/* <Grid item xs={12} sm={6}>
							<FormControl required fullWidth>
								<InputLabel id='status-label'>Status</InputLabel>
								<Select labelId='status-label' name='o_status' value={operator.o_status} onChange={handleChange} label='Status'>
									{statusOptions.length > 0
										? statusOptions.map(status => (
												<MenuItem key={status.id} value={status.o_name}>
													{status.o_name}
												</MenuItem>
										  ))
										: loading && <MenuItem disabled>Loading status...</MenuItem>}
								</Select>
							</FormControl>
						</Grid> */}

						{/* <Grid item xs={12}>
							<FormControl fullWidth>
								<FormLabel>Attachment</FormLabel>
								<input accept='application/pdf' type='file' onChange={handleFileChange} name='o_attachment1' />
							</FormControl>
						</Grid> */}
					</Grid>

					<DialogActions>
						<Button variant='contained' color='primary' onClick={() => {
                  onCancel();
                  setSaving(false);
                }}
				>
							Cancel
						</Button>
						<Button type='submit' variant='contained' disabled={saving} sx={{ backgroundColor: 'var(--secondary-color)', color: 'white' }}>
							{saving ? 'Submitting...' : 'Submit'}
						</Button>
					</DialogActions>
				</form>
			</DialogContent>
		</Dialog>
	);
};


export default AddAssetForm;
