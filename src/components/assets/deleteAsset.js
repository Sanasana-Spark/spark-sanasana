import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const DeleteAsset = ({ selectedAsset, onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({
		id: selectedAsset.id,
	});

	console.log('formdata', formData);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	useEffect(() => {
		if (selectedAsset) {
			setFormData({
				id: selectedAsset.id,
			});
		}
	}, [selectedAsset]);

	const getValue = key => (formData[key] !== undefined ? formData[key] : selectedAsset[key] || '');

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
				<DialogTitle>Delete Asset</DialogTitle>
				<DialogContent>
					<Box sx={{ padding: 2 }}>
						<p style={{ marginBottom: '16px' }}>Are you sure you want to delete this asset?</p>
						<TextField label='Asset ID' name='id' value={getValue('id')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Reg No' name='a_license_plate' value={getValue('a_license_plate')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Status' name='a_status' value={getValue('a_status')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Mileage' name='a_mileage' value={getValue('a_mileage')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Manufacturer' name='a_make' value={getValue('a_make')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Model' name='a_model' value={getValue('a_model')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onCancel}>No</Button>
					<Button onClick={handleSave} color='error'>
						Yes, Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Confirmation module */}
			<Dialog open={isConfirmationOpen} onClose={handleCancelSave}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<p>Are you sure you want to delete this asset?</p>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelSave} color='primary'>
						No
					</Button>
					<Button onClick={handleConfirmSave} color='error'>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default DeleteAsset;
