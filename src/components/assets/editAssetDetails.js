import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const EditAssetDetails = ({ selectedAsset, onCancel, open, onSave }) => {
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
				<DialogTitle>Edit Asset</DialogTitle>
				<DialogContent>
					<Box sx={{ padding: 2 }}>
						<TextField label='Reg No' name='a_license_plate' value={getValue('a_license_plate')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Status' name='a_status' value={getValue('a_status')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Mileage' name='a_mileage' value={getValue('a_mileage')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Manufacturer' name='a_make' value={getValue('a_make')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Model' name='a_model' value={getValue('a_model')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onCancel}>Cancel</Button>
					<Button onClick={handleSave} color='primary'>
						Save
					</Button>
				</DialogActions>
			</Dialog>

			{/* Confirmation module */}
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
