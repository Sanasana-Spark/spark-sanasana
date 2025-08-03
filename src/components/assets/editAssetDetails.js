import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert } from '@mui/material';

const EditAssetDetails = ({ selectedAsset, onCancel, open, onSave }) => {
	const [formData, setFormData] = useState({ id: selectedAsset.id });
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	useEffect(() => {
		if (selectedAsset) {
			setFormData({ id: selectedAsset.id });
		}
	}, [selectedAsset]);

	const getValue = key => (formData[key] !== undefined ? formData[key] : selectedAsset[key] || '');

	const handleChange = e => {
		const { name, value, type, files } = e.target;
		const val = type === 'file' ? files[0] : value;
		setFormData(prev => ({
			...prev,
			[name]: val,
		}));
	};

	const handleSave = () => {
		setIsConfirmationOpen(true);
	};

	const handleConfirmSave = () => {
		onSave(formData); // send only modified fields
		setIsConfirmationOpen(false);
		setShowSuccess(true);
	};

	const handleCancelSave = () => {
		setIsConfirmationOpen(false);
	};

	return (
		<>
			<Dialog open={open} onClose={onCancel} maxWidth='md' fullWidth>
				<DialogTitle>Edit Vehicle</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr', p: 2 }}>
						<TextField label='Reg No' name='a_license_plate' value={getValue('a_license_plate')} fullWidth disabled />
						<TextField label='Make' name='a_make' value={getValue('a_make')} fullWidth disabled />
						<TextField label='Model' name='a_model' value={getValue('a_model')} fullWidth disabled />
						<TextField label='Year' name='a_year' value={getValue('a_year')} fullWidth disabled />

						<TextField label='Status' name='a_status' value={getValue('a_status')} onChange={handleChange} fullWidth required />
						<TextField label='Mileage' name='a_mileage' value={getValue('a_mileage')} onChange={handleChange} type='number' fullWidth required />
						<TextField label='Tank Size' name='a_tank_size' value={getValue('a_tank_size')} onChange={handleChange} type='number' fullWidth required />
						<TextField label='Fuel Type' name='a_fuel_type' value={getValue('a_fuel_type')} onChange={handleChange} fullWidth required />
						<TextField label='Displacement' name='a_displacement' value={getValue('a_displacement')} onChange={handleChange} type='number' fullWidth required />
						<TextField label='Insurance Expiry' name='a_insurance_expiry' value={getValue('a_insurance_expiry')} onChange={handleChange} type='date' fullWidth InputLabelProps={{ shrink: true }} required />

						{/* Optional fields */}
						<TextField label='Acceleration' name='a_acceleration' value={getValue('a_acceleration')} onChange={handleChange} type='number' fullWidth />
						<TextField label='Accumulated Depreciation' name='a_accumulated_dep' value={getValue('a_accumulated_dep')} onChange={handleChange} type='number' fullWidth />
						<TextField label='Appreciation Rate' name='a_apreciation_rate' value={getValue('a_apreciation_rate')} onChange={handleChange} type='number' fullWidth />
						<TextField label='Chassis No' name='a_chasis_no' value={getValue('a_chasis_no')} onChange={handleChange} fullWidth />
						<TextField label='Cost' name='a_cost' value={getValue('a_cost')} onChange={handleChange} type='number' fullWidth />
						<TextField label='Depreciation Rate' name='a_depreciation_rate' value={getValue('a_depreciation_rate')} onChange={handleChange} type='number' fullWidth />
						<TextField label='Efficiency Rate' name='a_efficiency_rate' value={getValue('a_efficiency_rate')} onChange={handleChange} type='number' fullWidth />
						<TextField label='Engine Size' name='a_engine_size' value={getValue('a_engine_size')} onChange={handleChange} type='number' fullWidth />
						<TextField label='Horsepower' name='a_horsepower' value={getValue('a_horsepower')} onChange={handleChange} type='number' fullWidth />
						<TextField label='MSRP' name='a_msrp' value={getValue('a_msrp')} onChange={handleChange} type='number' fullWidth />
						<TextField label='Asset Name' name='a_name' value={getValue('a_name')} onChange={handleChange} fullWidth />
						<TextField label='Asset Type' name='a_type' value={getValue('a_type')} onChange={handleChange} fullWidth />
						<TextField label='Asset Value' name='a_value' value={getValue('a_value')} onChange={handleChange} type='number' fullWidth />
						<input type='file' name='a_image' accept='image/*' onChange={handleChange} style={{ marginTop: '16px' }} />
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

			<Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
				<Alert onClose={() => setShowSuccess(false)} severity='success' sx={{ width: '100%' }}>
					Details modified successfully
				</Alert>
			</Snackbar>
		</>
	);
};

export default EditAssetDetails;
