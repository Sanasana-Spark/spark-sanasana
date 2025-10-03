import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../components/onboarding/authProvider';
import { Box, Button, Typography } from '@mui/material';
import ClientTable from '../components/clients/clientsTable';
import EditClientDetails from '../components/clients/editClientDetails';
import AddClientForm from '../components/clients/addClient';
import ClientInvoice from '../components/clients/clientInvoice';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';

const Clients = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { apiFetch } = useAuthContext();

	const [clients, setClients] = useState([]);
	const [saving, setSaving] = useState(false);
	const [editClient, setEditClient] = useState(null);
	const [isSliderOpen, setIsSliderOpen] = useState(false);
	const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
	const [selectedClient, setSelectedClient] = useState(null);
	const [showInvoiceForm, setShowInvoiceForm] = useState(false);
	const [ti_ext_inv, setTiExtInv] = useState(null);
	const [ti_amount, setTiAmount] = useState('');
	const [ti_paid_amount, setTiPaidAmount] = useState('');
	const [ti_status, setTiStatus] = useState('Unpaid');
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);


	useEffect(() => {
		const apiUrl = `${baseURL}/clients/`;
		const fetchClients = async () => {
			try {
				const response = await apiFetch(apiUrl, { method: 'GET' });
				const data = await response.json();
				if (data.clients && data.clients.length > 0) {
					setClients(data.clients);
					setSelectedClient(data.clients[0]);
				}
			} catch (error) {
				console.error('Error fetching clients:', error);
			}
		};
		fetchClients();
	}, [baseURL, apiFetch, isSliderOpen, showAddPropertyForm]);

	const handleCancel = () => {
		setShowAddPropertyForm(false);
	};


	const handleAddPropertyClick = () => setShowAddPropertyForm(true);

	const handleEditClick = clientId => {
		const client = clients.find(c => c.id === clientId);
		setEditClient(client);
		setIsSliderOpen(true);
	};

	const handleEditCancel = () => {
		setEditClient(null);
		setIsSliderOpen(false);
	};

	const handleSaveEdit = updatedClient => {
		const url = `${baseURL}/clients/${updatedClient.id}/`;

		apiFetch(url, { method: 'PUT', body: JSON.stringify(updatedClient) })
			.then(response => response.json())
			.then(() => {
				setEditClient(null);
				setIsSliderOpen(false);
			})
			.catch(error => console.error('Error updating client:', error));
	};

	const handleSaveClient = async newClient => {
		const apiUrl = `${baseURL}/clients/`;
		try {
			const response = await apiFetch(apiUrl, {
				method: 'POST',
				body: JSON.stringify(newClient),
			});
			if (response.ok) {
				setShowAddPropertyForm(false);
				console.log('Client saved successfully');
			} else {
				console.error('Failed to save client:', response.statusText);
			}
		} catch (error) {
			console.error('Failed to save client:', error);
		}
	};

	const handleNewInvoiceClick = client => {
		setSelectedClient(client);
		setShowInvoiceForm(true);
	};

	const handleInvoiceCancel = () => {
		setShowInvoiceForm(false);
		setTiAmount('');
		setTiPaidAmount('');
		setTiExtInv(null);
		setTiStatus('Pending');
	};
	
	//handling add and saving new invoice
	const handleInvoiceSubmit = async e => {
		setSaving(true);
		e.preventDefault();
		const apiUrl = `${baseURL}/clients/invoices/${selectedClient.id}/`;
		e.preventDefault();
		const invoiceData = {
			ti_ext_inv,
			ti_amount: parseFloat(ti_amount),
			ti_paid_amount: parseFloat(ti_paid_amount),
			ti_balance: parseFloat(ti_amount) - parseFloat(ti_paid_amount),
			ti_status,
			date,
			ti_type: 'Service',
			ti_description: 'Invoice',
		};

		try {
			const res = await apiFetch(apiUrl, {
				method: 'POST',
				body: JSON.stringify(invoiceData),
			});
			setSaving(false);
			if (!res.ok) {
				throw new Error('Failed to save invoice');
			}
			console.log(res);
		} catch (err) {
			console.error('Failed to save invoice:', err);
		}
	};

	return (
		<Box p={3}>
			<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
				<Typography variant='h5'>Clients</Typography>
				<Button onClick={handleAddPropertyClick} size='small' variant='contained' sx={{ backgroundColor: '#047A9A', borderRadius: '5px', textTransform: 'none', fontSize: '1rem', px: 2, py: 0.5, '&:hover': { backgroundColor: '#008F8F' } }}>
					Add Client
				</Button>
			</Box>

			<ClientTable clients={clients} onEditClick={handleEditClick} onClientClick={setSelectedClient} onNewInvoiceClick={handleNewInvoiceClick} />

			<AddClientForm open={showAddPropertyForm} onCancel={handleCancel} onSave={handleSaveClient} />
			{selectedClient && <ClientInvoice selectedClient={selectedClient} />}

			<Dialog open={showInvoiceForm} onClose={handleInvoiceCancel} maxWidth='sm' fullWidth>
				<DialogTitle>New Invoice for {selectedClient?.c_name}</DialogTitle>
				<form onSubmit={handleInvoiceSubmit}  >
					<DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<TextField label='Ref No(external if applicable)' value={ti_ext_inv} onChange={e => setTiExtInv(e.target.value)}  fullWidth />
						<TextField label='Amount' type='number' value={ti_amount} onChange={e => {setTiAmount(e.target.value); if (ti_status === 'Unpaid') setTiPaidAmount(0);}} required fullWidth />
						<TextField select label='Status' value={ti_status} onChange={e => { const value = e.target.value; setTiStatus(value); if (value === 'Unpaid') setTiPaidAmount(0); if (value === 'Partially Paid') setTiPaidAmount(0); else if (value === 'Paid') setTiPaidAmount(ti_amount); }} required fullWidth>
							<MenuItem value='Paid'>Paid</MenuItem>
							<MenuItem value='Partially Paid'>Partially</MenuItem>
							<MenuItem value='Unpaid'>Unpaid</MenuItem>
						</TextField>
						<TextField label='Paid Amount' type='number' value={ti_paid_amount} onChange={e => setTiPaidAmount(e.target.value)} required fullWidth />
						<TextField label='Date' type='date' value={date} onChange={e => setDate(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />
					</DialogContent>

					<DialogActions>
						<Button onClick={() => setShowInvoiceForm(false)} sx={{ color:'#035f77' }} >Cancel</Button>
						<Button type='submit' variant='contained' sx={{ backgroundColor:'#019678', '&:hover': { backgroundColor: '#008F8F' } }}> 
						{saving ? 'Saving...' : 'Save Invoice'}
						</Button>
					</DialogActions>
				</form>
			</Dialog>

			{editClient && isSliderOpen && <EditClientDetails selectedClient={editClient} open={isSliderOpen} onCancel={handleEditCancel} onSave={handleSaveEdit} />}
		</Box>
	);
};

export default Clients;
