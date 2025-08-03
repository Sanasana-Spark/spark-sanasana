import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar } from '@mui/material';

const EditOperatorDetails = ({ selectedOperator, onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({ id: selectedOperator?.id });
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [successOpen, setSuccessOpen] = useState(false);

	useEffect(() => {
		if (selectedOperator) {
			setFormData({
				id: selectedOperator.id,
				o_assigned_asset: selectedOperator.o_assigned_asset || '',
				o_cum_mileage: selectedOperator.o_cum_mileage || '',
				o_expirence: selectedOperator.o_expirence || '',
				o_lincense_expiry: selectedOperator.o_lincense_expiry || '',
				o_lincense_id: selectedOperator.o_lincense_id || '',
				o_lincense_type: selectedOperator.o_lincense_type || '',
				o_name: selectedOperator.o_name || '',
				o_national_id: selectedOperator.o_national_id || '',
				o_phone: selectedOperator.o_phone || '',
				o_status: selectedOperator.o_status || '',
				o_email: selectedOperator.o_email || '',
			});
		}
	}, [selectedOperator]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSave = () => setIsConfirmationOpen(true);

	const handleConfirmSave = () => {
		setIsConfirmationOpen(false);
		onSave(formData);
		setSuccessOpen(true);
	};

	const handleCancelSave = () => setIsConfirmationOpen(false);

	const handleCloseSnackbar = () => setSuccessOpen(false);

	return (
		<>
			<Dialog open={open} onClose={onCancel}>
				<DialogTitle>Edit Driver</DialogTitle>
				<DialogContent>
					<Box sx={{ padding: 2 }}>
						<TextField label='Assigned Asset (Vehicle ID)' name='o_assigned_asset' type='number' value={formData.o_assigned_asset} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required />

						<TextField label='Full Name' name='o_name' value={formData.o_name} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required />

						<TextField label='Email' name='o_email' value={formData.o_email} fullWidth disabled sx={{ marginBottom: 2 }} />

						<TextField label='Contact' name='o_phone' value={formData.o_phone} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required />

						<TextField label='Status' name='o_status' value={formData.o_status} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required />

						<TextField label='Cumulative Mileage' name='o_cum_mileage' type='number' value={formData.o_cum_mileage} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required />

						<TextField label='Experience (Years)' name='o_expirence' type='number' value={formData.o_expirence} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />

						<TextField label='License Expiry Date' name='o_lincense_expiry' type='date' InputLabelProps={{ shrink: true }} value={formData.o_lincense_expiry} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} required />

						<TextField label='License ID' name='o_lincense_id' value={formData.o_lincense_id} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />

						<TextField label='License Type' name='o_lincense_type' value={formData.o_lincense_type} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />

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

			{/* Confirmation Dialog */}
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

			{/* Success Snackbar */}
			<Snackbar open={successOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} message='Driver updated successfully!' anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
		</>
	);
};

export default EditOperatorDetails;
