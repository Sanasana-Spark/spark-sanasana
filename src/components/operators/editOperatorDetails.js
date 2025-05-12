import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const EditOperatorDetails = ({ selectedOperator, onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({
		id: '',
		o_name: '',
		o_email: '',
		o_role: '',
		o_phone: '',
		o_status: '',
	});

	console.log('formData>>', formData);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

	useEffect(() => {
		if (selectedOperator) {
			setFormData({
				id:selectedOperator.id
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
		setIsConfirmationOpen(false);
		onSave(formData);
	};

	const handleCancelSave = () => {
		setIsConfirmationOpen(false);
	};

	// Helper to get field value (edited or original)
	const getValue = (key) => (formData[key] !== undefined ? formData[key] : selectedOperator[key] || '');


	return (
		<>
			<Dialog open={open} onClose={onCancel}>
				<DialogTitle>Edit Operator</DialogTitle>
				<DialogContent>
					<Box sx={{ padding: 2 }}>
						<TextField label='Full Name' name='o_name'  value={getValue('o_name')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Email' name='o_email' value={getValue('o_email')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
						<TextField label='Position' name='o_role' value={getValue('o_role')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Contact' name='o_phone' value={getValue('o_phone')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
						<TextField label='Status' name='o_status' value={getValue('o_status')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} />
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
