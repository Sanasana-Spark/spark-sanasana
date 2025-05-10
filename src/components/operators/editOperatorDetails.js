import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const EditOperatorDetails = ({ selectedOperator, onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({
		id:selectedOperator.id
	});
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	useEffect(() => {
		if (selectedOperator) {
			setFormData({
				id:selectedOperator.id,
				o_name: selectedOperator.o_name,
				o_email: selectedOperator.o_email,
				o_role: selectedOperator.o_role ,
				o_phone: selectedOperator.o_phone,
				o_status: selectedOperator.o_status,
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
				<DialogTitle>Edit Operator</DialogTitle>
				<DialogContent>
					<Box sx={{ padding: 2 }}>
						<TextField label='Full Name' name='o_name' value={formData.o_name} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Email' name='o_email' value={formData.o_email} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Position' name='o_role' value={formData.o_role} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Contact' name='o_phone' value={formData.o_phone} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Status' name='o_status' value={formData.o_status} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
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

export default EditOperatorDetails;
