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
	const { user_id, org_id } = useAuthContext();

	const [clients, setClients] = useState([]);
	const [editClient, setEditClient] = useState(null);
	const [isSliderOpen, setIsSliderOpen] = useState(false);
	const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
	const [selectedClient, setSelectedClient] = useState(null);
	const [invoices, setInvoices] = useState([]);
	const [showInvoiceForm, setShowInvoiceForm] = useState(false);
	const [invoice_no, setInvoiceNo] = useState('');
	const [ti_amount, setTiAmount] = useState('');
	const [balance, setBalance] = useState('');
	const [ti_status, setTiStatus] = useState('Pending');
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

	useEffect(() => {
		const apiUrl = `${baseURL}/clients/${org_id}/${user_id}/`;
		const fetchClients = async () => {
			try {
				const response = await fetch(apiUrl);
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
	}, [baseURL, org_id, user_id, isSliderOpen]);

	useEffect(() => {
		if (!selectedClient) return;
		const fetchInvoices = async () => {
			try {
				const invoiceUrl = `${baseURL}/clients/invoices/${org_id}/${selectedClient.id}/`;
				const response = await fetch(invoiceUrl);
				const data = await response.json();
				setInvoices(data.invoices || []);
			} catch (err) {
				console.error('Failed to fetch invoices:', err);
			}
		};
		fetchInvoices();
	}, [selectedClient, baseURL, org_id, user_id]);

	const handleCancel = () => setShowAddPropertyForm(false);
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
		const url = `${baseURL}/clients/${org_id}/${user_id}/${updatedClient.id}/`;
		const options = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedClient),
		};

		fetch(url, options)
			.then(response => response.json())
			.then(() => {
				setEditClient(null);
				setIsSliderOpen(false);
			})
			.catch(error => console.error('Error updating client:', error));
	};

	const handleSaveClient = async newClient => {
		const apiUrl = `${baseURL}/clients/${org_id}/${user_id}/`;
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newClient),
			});
			console.log(response);
		} catch (error) {
			console.error('Failed to save client:', error);
		}
	};

	const handleNewInvoiceClick = client => {
		setSelectedClient(client);
		setShowInvoiceForm(true);
	};

	//handling add and saving new invoice
	const handleInvoiceSubmit = async e => {
		const apiUrl = `${baseURL}/clients/invoices/${org_id}/${selectedClient.id}/`;
		e.preventDefault();
		const invoiceData = {
			invoice_no,
			ti_amount: parseFloat(ti_amount),
			balance: parseFloat(balance),
			ti_status,
			date,
			client_id: selectedClient.id,
			org_id,
		};

		try {
			const res = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invoiceData),
			});
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
			{selectedClient && <ClientInvoice invoicesss={invoices} selectedClient={selectedClient} />}

			<Dialog open={showInvoiceForm} onClose={() => setShowInvoiceForm(false)} maxWidth='sm' fullWidth>
				<DialogTitle>New Invoice for {selectedClient?.c_name}</DialogTitle>
				<form onSubmit={handleInvoiceSubmit}>
					<DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<TextField label='Invoice No' value={invoice_no} onChange={e => setInvoiceNo(e.target.value)} required fullWidth />
						<TextField label='Amount' type='number' value={ti_amount} onChange={e => setTiAmount(e.target.value)} required fullWidth />
						<TextField label='Balance' type='number' value={balance} onChange={e => setBalance(e.target.value)} required fullWidth />
						<TextField select label='Status' value={ti_status} onChange={e => setTiStatus(e.target.value)} required fullWidth>
							<MenuItem value='Pending'>Pending</MenuItem>
							<MenuItem value='Paid'>Paid</MenuItem>
							<MenuItem value='Unpaid'>Unpaid</MenuItem>
							<MenuItem value='Overdue'>Overdue</MenuItem>
						</TextField>
						<TextField label='Date' type='date' value={date} onChange={e => setDate(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />
					</DialogContent>

					<DialogActions>
						<Button onClick={() => setShowInvoiceForm(false)}>Cancel</Button>
						<Button type='submit' variant='contained'>
							Save Invoice
						</Button>
					</DialogActions>
				</form>
			</Dialog>

			{editClient && isSliderOpen && <EditClientDetails selectedClient={editClient} open={isSliderOpen} onCancel={handleEditCancel} onSave={handleSaveEdit} />}
		</Box>
	);
};

export default Clients;
