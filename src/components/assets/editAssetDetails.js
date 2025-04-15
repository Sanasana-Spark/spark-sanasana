import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const EditAssetDetails = ({ selectedOperator, onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({
		o_name: '',
		o_status: '',
		o_mileage: '',
		o_make: '',
		o_model: '',
	});
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	useEffect(() => {
		if (selectedOperator) {
			setFormData({
				o_name: selectedOperator.a_license_plate || '',
				o_status: selectedOperator.a_status || '',
				o_mileage: selectedOperator.a_mileage || '',
				o_make: selectedOperator.a_make || '',
				o_model: `${selectedOperator.a_model}-${selectedOperator.a_year}` || '',
			});
		}
	}, [selectedOperator]);

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
						<TextField label='Reg No' name='o_name' value={formData.o_name} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Status' name='o_status' value={formData.o_status} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Mileage' name='o_mileage' value={formData.o_mileage} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Manufacturer' name='o_make' value={formData.o_make} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Model' name='o_model' value={formData.o_model} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
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
