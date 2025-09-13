import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, SnackbarContent, Snackbar, MenuItem, InputLabel, Select, FormControl, FormHelperText } from '@mui/material';
import { useAuthContext } from '../onboarding/authProvider';

const EditOperatorDetails = ({ selectedOperator, onCancel, open, onSave }) => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { apiFetch } = useAuthContext();

	const [formData, setFormData] = useState({ id: selectedOperator?.id });
	const [errors, setErrors] = useState({});
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });
	const [assetOptions, setAssetOptions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (selectedOperator) {
			setFormData({
				id: selectedOperator.id,
				o_assigned_asset: selectedOperator.o_assigned_asset || '',
				o_name: selectedOperator.o_name || '',
				o_email: selectedOperator.o_email || '',
				o_phone: selectedOperator.o_phone || '',
				o_status: selectedOperator.o_status || '',
				o_expirence: selectedOperator.o_expirence || '',
				o_lincense_expiry: selectedOperator.o_lincense_expiry || '',
				o_lincense_id: selectedOperator.o_lincense_id || '',
				o_lincense_type: selectedOperator.o_lincense_type || '',
				o_national_id: selectedOperator.o_national_id || '',
			});
		}
	}, [selectedOperator]);

	useEffect(() => {
		if (!open) return;
		const apiUrl = `${baseURL}/assets/`;
		setLoading(true);
		apiFetch(apiUrl, { method: 'GET' })
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
	}, [apiFetch, open, baseURL]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		setErrors(prev => ({ ...prev, [name]: '' }));
	};

	// Validating required fields before saving
	const validateForm = () => {
		const newErrors = {};
		if (!formData.o_assigned_asset) newErrors.o_assigned_asset = 'Required';
		if (!formData.o_name?.trim()) newErrors.o_name = 'Required';
		if (!formData.o_phone?.trim()) newErrors.o_phone = 'Required';
		if (!formData.o_status) newErrors.o_status = 'Required';
		if (!formData.o_lincense_expiry) newErrors.o_lincense_expiry = 'Required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (!validateForm()) return;
		setIsConfirmationOpen(true);
	};

	const handleConfirmSave = () => {
		setIsConfirmationOpen(false);

		onSave(
			formData,
			() => {
				setSnackbar({
					open: true,
					message: 'Driver updated successfully!',
					type: 'success',
				});
				setTimeout(() => {
					onCancel();
				}, 1000);
			},
			() => {
				setSnackbar({
					open: true,
					message: 'Failed to update driver!',
					type: 'error',
				});
			}
		);
	};

	const handleCancelSave = () => setIsConfirmationOpen(false);

	const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

	return (
		<>
			<Dialog open={open} onClose={onCancel}>
				<DialogTitle>Edit Driver</DialogTitle>
				<DialogContent>
					<Box sx={{ padding: 2 }}>
						<FormControl fullWidth sx={{ marginBottom: 2 }} error={!!errors.o_assigned_asset}>
							<InputLabel id='asset-label'>Assigned Vehicle</InputLabel>
							<Select labelId='asset-label' name='o_assigned_asset' value={formData.o_assigned_asset} onChange={handleChange} disabled={loading}>
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
							<FormHelperText>{errors.o_assigned_asset}</FormHelperText>
						</FormControl>

						<TextField label='Full Name' name='o_name' value={formData.o_name} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required error={!!errors.o_name} helperText={errors.o_name} />

						<TextField label='Email' name='o_email' value={formData.o_email} fullWidth disabled sx={{ marginBottom: 2 }} />

						<TextField label='Contact' name='o_phone' value={formData.o_phone} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required error={!!errors.o_phone} helperText={errors.o_phone} />

						<TextField select label='Status' name='o_status' value={formData.o_status} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required error={!!errors.o_status} helperText={errors.o_status}>
							<MenuItem value='Active'>Active</MenuItem>
							<MenuItem value='Inactive'>Inactive</MenuItem>
						</TextField>

						<TextField label='Experience (Years)' name='o_expirence' type='number' value={formData.o_expirence} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />

						<TextField label='License Expiry Date' name='o_lincense_expiry' type='date' InputLabelProps={{ shrink: true }} value={formData.o_lincense_expiry} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required error={!!errors.o_lincense_expiry} helperText={errors.o_lincense_expiry} />

						<TextField label='License ID' name='o_lincense_id' value={formData.o_lincense_id} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />

						<TextField select label='License Type' name='o_lincense_type' value={formData.o_lincense_type} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }}>
							<MenuItem value='Class A'>Class A</MenuItem>
							<MenuItem value='Class B'>Class B</MenuItem>
							<MenuItem value='Class C'>Class C</MenuItem>
							<MenuItem value='Class D'>Class D</MenuItem>
							<MenuItem value='Class E'>Class E</MenuItem>
							<MenuItem value='Class F'>Class F</MenuItem>
						</TextField>

						<TextField label='National ID' name='o_national_id' value={formData.o_national_id} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onCancel}>Cancel</Button>
					<Button onClick={handleSave} color='primary'>
						Save
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={isConfirmationOpen} onClose={handleCancelSave}>
				<DialogTitle>Confirm Changes</DialogTitle>
				<DialogContent>Are you sure you want to save these changes?</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelSave}>Cancel</Button>
					<Button onClick={handleConfirmSave} color='primary'>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
				<SnackbarContent
					style={{
						backgroundColor: snackbar.type === 'success' ? '#e6f4ea' : '#ffebee',
						color: snackbar.type === 'success' ? '#2e7d32' : '#c62828',
						fontWeight: 'bold',
					}}
					message={snackbar.message}
				/>
			</Snackbar>
		</>
	);
};

export default EditOperatorDetails;
