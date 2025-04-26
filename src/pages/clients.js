import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../components/onboarding/authProvider';
import { Box, Button, Typography } from '@mui/material';
import ClientTable from '../components/clients/clientsTable';
import EditClientDetails from '../components/clients/editClientDetails';
import AddClientForm from '../components/clients/addClient';
import ClientInvoice from '../components/clients/clientInvoice';

const Clients = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { user_id, org_id } = useAuthContext();

	const [clients, setClients] = useState([]);
	const [editClient, setEditClient] = useState(null);
	const [isSliderOpen, setIsSliderOpen] = useState(false);
	const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
	const [selectedClient, setSelectedClient] = useState(null);
	const [invoices, setInvoices] = useState([]);

	useEffect(() => {
		const apiUrl = `${baseURL}/clients/${org_id}/${user_id}`;
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
	}, [baseURL, org_id, user_id]);

	useEffect(() => {
		const fetchInvoices = async () => {
			try {
				const invoiceUrl = `${baseURL}/clients/invoices/${org_id}/${user_id}/${selectedClient.id}`;
				const response = await fetch(invoiceUrl);
				const data = await response.json();
				setInvoices(data.invoices || []);
			} catch (err) {
				console.error('Failed to fetch invoices:', err);
			}
		};

		fetchInvoices();
	}, [selectedClient, baseURL, org_id, user_id]);

	const handleCancel = () => {
		setShowAddPropertyForm(false);
	};
	const handleAddPropertyClick = () => {
		setShowAddPropertyForm(true);
	};

	//handling edit
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
		const url = `${baseURL}/clients/${org_id}/${user_id}/${updatedClient.id}`;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedClient),
		};
		fetch(url, options)
			.then(response => response.json())
			.then(() => {
				setClients(prevClients => prevClients.map(client => (client.id === updatedClient.id ? updatedClient : client)));
				setEditClient(null);
				setIsSliderOpen(false);
			})
			.catch(error => {
				console.error('Error updating client:', error);
			});
	};

	//handling saving addedClient
	const handleSaveClient = async newClient => {
		const apiUrl = `${baseURL}/clients/${org_id}/${user_id}`;
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newClient),
			});
			const savedClient = await response.json();
			setClients(prev => [...prev, savedClient]);
		} catch (error) {
			console.error('Failed to save client:', error);
		}
	};

	return (
		<Box p={3}>
			<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
				<Typography variant='h5'>Clients</Typography>
				<Button
					onClick={handleAddPropertyClick}
					size='small'
					variant='contained'
					sx={{
						backgroundColor: '#047A9A',
						borderRadius: '5px',
						textTransform: 'none',
						fontSize: '1rem',
						px: 2,
						py: 0.5,
						'&:hover': {
							backgroundColor: '#008F8F',
						},
					}}
				>
					Add Client
				</Button>
			</Box>

			<ClientTable clients={clients} onEditClick={handleEditClick} onClientClick={setSelectedClient} />

			<AddClientForm open={showAddPropertyForm} onCancel={handleCancel} onSave={handleSaveClient} />
			{selectedClient && <ClientInvoice invoices={invoices} selectedClient={selectedClient} />}

			{editClient && isSliderOpen && <EditClientDetails selectedClient={editClient} open={isSliderOpen} onCancel={handleEditCancel} onSave={handleSaveEdit} />}
		</Box>
	);
};

export default Clients;
