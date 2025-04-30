import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AddClientForm = ({ onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({
		c_name: '',
		c_email: '',
		c_phone: '',
	});

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (!formData.c_name || !formData.c_email || !formData.c_phone) {
			alert('Please fill in all fields.');
			return;
		}
		onSave(formData);
		setFormData({ c_name: '', c_email: '', c_phone: '' });
		onCancel();
	};

	return (
		<Modal open={open} onClose={onCancel} sx={{ zIndex: 100 }}>
			<Box
				component='form'
				onSubmit={handleSubmit}
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 500,
					bgcolor: 'background.paper',
					boxShadow: 24,
					p: 4,
					borderRadius: 2,
				}}
			>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Typography variant='h6'>Add Client</Typography>
					<IconButton onClick={onCancel}>
						<CloseIcon />
					</IconButton>
				</Box>

				<TextField fullWidth label='Name' name='c_name' value={formData.c_name} onChange={handleChange} margin='normal' required />
				<TextField fullWidth label='Email' name='c_email' value={formData.c_email} onChange={handleChange} margin='normal' required />
				<TextField fullWidth label='Phone' name='c_phone' value={formData.c_phone} onChange={handleChange} margin='normal' required />

				<Button type='submit' variant='contained' sx={{ mt: 3, backgroundColor: '#047A9A', '&:hover': { backgroundColor: '#008F8F' } }} fullWidth>
					Save Client
				</Button>
			</Box>
		</Modal>
	);
};

export default AddClientForm;
