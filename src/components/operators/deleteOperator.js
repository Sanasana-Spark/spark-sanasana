import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const DeleteOperator = ({ selectedOperator, onCancel, open, onSave }) => {
    const [formData, setFormData] = useState({
        id:selectedOperator.id
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
                <DialogTitle>Delete Operator</DialogTitle>
                <DialogContent>
                    <p style={{ marginBottom: '16px' }}>Are you sure you want to delete this operator?</p>
                    <Box sx={{ padding: 2 }}>
                        <TextField label='Full Name' name='o_name' value={getValue('o_name')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
                        <TextField label='Email' name='o_email' value={getValue('o_email')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
                        <TextField label='Position' name='o_role' value={getValue('o_role')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
                        <TextField label='Contact' name='o_phone' value={getValue('o_phone')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
                        <TextField label='Status' name='o_status' value={getValue('o_status')} onChange={handleChange} fullWidth sx={{ marginBottom: 2 }} disabled />
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
                    <p>Are you sure you want to delete this operator?</p>
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

export default DeleteOperator;
