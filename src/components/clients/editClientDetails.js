import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const EditAssetDetails = ({ selectedClient, onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({
		id: selectedClient.id,
	});

	console.log('formData', formData);

	const getValue = key => (formData[key] !== undefined ? formData[key] : selectedClient[key] || '');

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	useEffect(() => {
		if (selectedClient) {
			setFormData({
				id: selectedClient.id,
			});
		}
	}, [selectedClient]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSave = () => {
		setIsConfirmationOpen(true);
	};

	const handleConfirmSave = () => {
		onSave(formData);
		setIsConfirmationOpen(false);
	};

	const handleCancelSave = () => {
		setIsConfirmationOpen(false);
	};

	return (
		<>
			<Dialog open={open} onClose={onCancel}>
				<DialogTitle>Edit Client</DialogTitle>
				<DialogContent>
					<Box sx={{ padding: 2 }}>
						<TextField label='Name' name='c_name' value={getValue('c_name')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Email' name='c_email' value={getValue('c_email')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Phone' name='c_phone' value={getValue('c_phone')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Status' name='c_status' value={getValue('c_status')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Last Inv Date' name='c_last_invoice_date' value={getValue('c_last_invoice_date')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
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
				<DialogContent>
					<p>Are you sure you want to save these changes?</p>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelSave} color='secondary'>
						Cancel
					</Button>
					<Button onClick={handleConfirmSave} color='primary'>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default EditAssetDetails;
