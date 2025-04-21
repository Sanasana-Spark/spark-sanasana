import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const EditAssetDetails = ({ selectedClient, onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({
		id: null,
		c_name: null,
		c_email: null,
		c_phone: null,
		c_status: null,
		c_last_invoice_date: null,
	});

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	useEffect(() => {
		if (selectedClient) {
			setFormData({
				id: selectedClient.id ?? null,
				c_name: selectedClient.c_name ?? null,
				c_email: selectedClient.c_email ?? null,
				c_phone: selectedClient.c_phone ?? null,
				c_status: selectedClient.c_status ?? null,
				c_last_invoice_date: selectedClient.c_last_invoice_date ?? null,
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
						<TextField label='Name' name='c_name' value={formData.c_name ?? ''} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Email' name='c_email' value={formData.c_email ?? ''} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Phone' name='c_phone' value={formData.c_phone ?? ''} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Status' name='c_status' value={formData.c_status ?? ''} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Last Inv Date' name='c_last_invoice_date' value={formData.c_last_invoice_date ?? ''} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
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
