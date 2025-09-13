import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton, Typography, Button, TablePagination, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuthContext } from "../onboarding/authProvider";
import InvoicesPreview from './invoices_preview';

const ClientInvoice = ({ selectedClient }) => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { org_currency, apiFetch } = useAuthContext();
	const [currentPage, setCurrentPage] = useState(0);
	const [invoices, setInvoices] = useState([]);
	const [, setLoading] = useState(true);
	const [selectedInvoices, setSelectedInvoices] = useState([]);
	const [previewOpen, setPreviewOpen] = useState(false);

	useEffect(() => {
		if (selectedClient && selectedClient.id) {

			const apiUrl = `${baseURL}/clients/invoices/${selectedClient.id}/`;
			apiFetch(apiUrl, { method: 'GET' })
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					setSelectedInvoices([]);
					setInvoices(data.invoices || []);
					setLoading(false);
				})
				.catch((error) => {
					console.error("Error fetching invoices:", error);
					setLoading(false);
				});
		}
	}, [baseURL, apiFetch, selectedClient]);

	const rowsPerPage = 5;
	// Handle pagination change
	const handleChangePage = (event, newPage) => {
		setCurrentPage(newPage);
	};

	const paginatedInvoices = invoices.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);



	const handleSelectInvoice = (invoice) => {
		const isSelected = selectedInvoices.some(selected => selected.id === invoice.id);
		setSelectedInvoices(prev =>
			isSelected
				? prev.filter(selected => selected.id !== invoice.id)
				: [...prev, invoice]
		);
	};

	const handleClosePreview = () => {
		setPreviewOpen(false);
	};
	const handleOpenPreview = () => {
		if (selectedInvoices.length > 0) {
			setPreviewOpen(true);
		} else {
			alert("Please select at least one invoice to preview.");
		}
	};

	return (
		<Box mt={4}>
			<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
				<Typography variant='subtitle1' gutterBottom>
					Client - {selectedClient.c_name}'s Invoices
				</Typography>
				<Button
					disabled={selectedInvoices.length === 0}
					onClick={handleOpenPreview}
					size='small'
					variant='contained'
					sx={{
						width: '143px',
						height: '44px',
						borderRadius: '5px',
						backgroundColor: '#047A9A',
						textTransform: 'none',
						fontSize: '0.875rem',
						px: 2,
						py: 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '10px',
						'&:hover': {
							backgroundColor: '#008F8F',
						},
					}}
				>
					Preview/Download Invoice
				</Button>
			</Box>

			<TableContainer
				component={Paper}
				sx={{
					// maxWidth: 800,
					// mx: '12',
					boxShadow: 2,
					borderRadius: 2,
				}}
			>
				<Table size='small'>
					<TableHead sx={{ backgroundColor: '#FFFFFF' }}>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}> Select </TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Invoice No</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Paid</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Balance</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Update</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedInvoices.map((invoice, index) => (
							<TableRow key={index} sx={{ backgroundColor: '#f5f5f5', '&:last-child td': { borderBottom: 0 } }}>
								<TableCell padding='checkbox'>
									<Checkbox
										checked={selectedInvoices.includes(invoice)}
										onChange={() => handleSelectInvoice(invoice)}
									/>
								</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', border: 'none' }}>{invoice.id || '-'}</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', border: 'none' }}>
									{invoice.ti_amount ? Number(invoice.ti_amount).toLocaleString(org_currency, { style: 'currency', currency: org_currency }) : '-'}
								</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', border: 'none' }}>
									{invoice.ti_paid ? Number(invoice.ti_paid).toLocaleString(org_currency, { style: 'currency', currency: org_currency }) : Number(0).toLocaleString(org_currency, { style: 'currency', currency: org_currency })}
								</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', border: 'none' }}>
									{invoice.ti_balance ? Number(invoice.ti_balance).toLocaleString(org_currency, { style: 'currency', currency: org_currency }) : Number(0).toLocaleString(org_currency, { style: 'currency', currency: org_currency })}
								</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', border: 'none' }}>{invoice.ti_status}</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', border: 'none' }}>{invoice.ti_created_at ? new Date(invoice.ti_created_at).toLocaleDateString('en-GB') : '-'}</TableCell>
								<TableCell >
									<IconButton size='small' sx={{ color: '#01947A' }}>
										<EditIcon fontSize='inherit' />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{/* Pagination Component */}
				<TablePagination rowsPerPageOptions={[]} component='div' count={invoices.length} rowsPerPage={rowsPerPage} page={currentPage} onPageChange={handleChangePage} />
			</TableContainer>

			{previewOpen && (
				console.log("Selected invoices in preview:", selectedInvoices),
				<InvoicesPreview
					selectedInvoices={selectedInvoices}
					selectedClient={selectedClient}
					onClose={handleClosePreview}
					open={previewOpen}
				/>
			)}
		</Box>
	);
};

export default ClientInvoice;
