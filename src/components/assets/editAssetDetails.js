import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const EditAssetDetails = ({ selectedAsset, onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({
		id: selectedAsset.id 
	});
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	useEffect(() => {
		if (selectedAsset) {
			setFormData({
				id: selectedAsset.id ,
				a_license_plate: selectedAsset.a_license_plate ,
				a_status: selectedAsset.a_status,
				a_mileage: selectedAsset.a_mileage,
				a_make: selectedAsset.a_make ,
				a_model: selectedAsset.a_model ,
				a_year: selectedAsset.a_year,
			});
		}
	}, [selectedAsset]);

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
						<TextField label='Reg No' name='a_license_plate' value={formData.a_license_plate} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Status' name='a_status' value={formData.a_status} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Mileage' name='a_mileage' value={formData.a_mileage} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Manufacturer' name='a_make' value={formData.a_make} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Model' name='a_model' value={formData.a_model} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
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
