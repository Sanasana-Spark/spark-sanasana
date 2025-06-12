import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Paper, FormControl, FormLabel, Select, MenuItem, InputLabel } from '@mui/material';
import { useAuthContext } from '../onboarding/authProvider';

const AddAssetForm = ({ onSubmit, onCancel, open }) => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { user_id, org_id } = useAuthContext();
	const [statusOptions, setStatusOptions] = useState([]);
	const [assetOptions, setAssetOptions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const apiUrl = `${baseURL}/operators/status`;
		fetch(apiUrl)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				setStatusOptions(data);
				setLoading(false);
			})
			.catch(error => {
				console.error('Error fetching data:', error);
				setLoading(false);
			});
	}, [baseURL]);

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
					setAssetOptions(data);
					setLoading(false);
				})
				.catch(error => {
					console.error('Error fetching data:', error);
					setLoading(false);
				});
		}
	}, [baseURL, org_id, user_id, open]); // Empty dependency array ensures this effect runs only once when the component mounts

	//   const classes = useStyles();
	const [operator, setOperator] = useState({
		o_status: 'Active',
		o_cum_mileage: 0,
		o_role: 'Driver',
		o_class: 'Class B',
	});

	const handleChange = e => {
		const { name, value } = e.target;
		setOperator(prevAsset => ({
			...prevAsset,
			[name]: value,
		}));
	};

	const handleSubmit = e => {
		e.preventDefault();
		onSubmit(operator);
		// Optionally, you can reset the form after submission
	};

	const handleFileChange = e => {
		setOperator({
			...operator,
			[e.target.name]: e.target.files[0],
		});
	};

	return (
		<Dialog open={open} onClose={onCancel} aria-labelledby='form-dialog-title'>
			<DialogTitle id='form-dialog-title'>Add Operator</DialogTitle>
			<DialogContent>
				<Paper className={'classes.paper'}>
					<form onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<FormLabel>Profile</FormLabel>
									<input accept='image/*' type='file' onChange={handleFileChange} name='o_image' />
								</FormControl>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField required label='Operators Name' name='o_name' value={operator.o_name} onChange={handleChange} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField required label='Email' name='o_email' type='email' value={operator.o_email} onChange={handleChange} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField required label='Phone' name='o_phone' value={operator.o_phone} onChange={handleChange} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField label='National id' name='o_national_id' value={operator.o_national_id} onChange={handleChange} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField label='License Id' name='o_lincense_id' value={operator.o_lincense_id} onChange={handleChange} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl required sx={{ width: '225px' }} variant='outlined'>
									<TextField select label='Licence Type' name='o_class' value={operator.o_class} onChange={handleChange} variant='outlined'>
										<MenuItem value='Class A'>Class A</MenuItem>
										<MenuItem value='Class B'>Class B</MenuItem>
										<MenuItem value='Class C'>Class C</MenuItem>
										<MenuItem value='Class D'>Class D</MenuItem>
										<MenuItem value='Class E'>Class E</MenuItem>
										<MenuItem value='Class F'>Class F</MenuItem>
									</TextField>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl required sx={{ width: '225px' }} variant='outlined'>
									<TextField select label='Role' name='o_role' value={operator.o_role} onChange={handleChange} variant='outlined'>
										<MenuItem value='Driver'>Driver</MenuItem>
										<MenuItem value='Others'>Others</MenuItem>
									</TextField>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField sx={{ width: '225px' }} required id='status-label' label='License Expiry' name='o_lincense_expiry' type='date' value={operator.o_lincense_expiry} onChange={handleChange} InputLabelProps={{ shrink: true }} />
							</Grid>

							<Grid item xs={12} sm={6}>
								<FormControl required sx={{ width: '225px' }}>
									<InputLabel id='asset-label'>Assigned Vehicle</InputLabel>
									<Select labelId='asset-label' id='assigned-vehicle-select' label='Assigned Vehicle' name='o_assigned_asset' value={operator.o_assigned_asset} onChange={handleChange}>
										{assetOptions && assetOptions.length > 0
											? assetOptions.map(asset => (
													<MenuItem key={asset.id} value={asset.id}>
														{asset.a_license_plate} - {asset.a_status}
													</MenuItem>
											  ))
											: loading && <MenuItem disabled>Loading Vehicle...</MenuItem>}
									</Select>
								</FormControl>
							</Grid>

							<Grid item xs={12} sm={6}>
								<FormControl required sx={{ width: '225px' }} variant='outlined'>
									<InputLabel id='status-label'>Status</InputLabel>
									<Select labelId='status-label' id='status' name='o_status' value={operator.o_status} onChange={handleChange} label='Status'>
										{statusOptions && statusOptions.length > 0
											? statusOptions.map(status => (
													<MenuItem key={status.id} value={status.o_name}>
														{status.o_name}
													</MenuItem>
											  ))
											: loading && <MenuItem disabled>Loading status...</MenuItem>}
									</Select>
								</FormControl>
							</Grid>

							<Grid item xs={12}>
								<FormControl fullWidth>
									<FormLabel>Attachment </FormLabel>
									<input accept='application/pdf' type='file' onChange={handleFileChange} name='o_attachment1' />
								</FormControl>
							</Grid>
						</Grid>
						<DialogActions>
							<Button type='submit' variant='contained' color='primary'>
								Submit
							</Button>
							<Button variant='contained' color='primary' onClick={onCancel}>
								Cancel
							</Button>
						</DialogActions>
					</form>
				</Paper>
			</DialogContent>
		</Dialog>
	);
};

AddAssetForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default AddAssetForm;
