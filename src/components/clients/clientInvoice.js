import React, { useState, useEffect } from 'react';
import { TableContainer, Paper, Box, IconButton, TablePagination, Checkbox } from '@mui/material';
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
				<div className="page-title">
					Client - {selectedClient.c_name}'s Invoices
				</div>
				<button
					className="btn btn-primary"
					disabled={selectedInvoices.length === 0}
					onClick={handleOpenPreview}
				
				>
					Preview/Download Invoice
				</button>
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
				 <table className="data-table">
					<thead><tr><th>Select</th><th>Invoice No</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Status</th><th>Date</th><th>Update</th>  </tr></thead>
        
					<tbody>
						{paginatedInvoices.map((invoice, index) => (
							<tdr key={index} sx={{ backgroundColor: '#f5f5f5', '&:last-child td': { borderBottom: 0 } }}>
								<td padding='checkbox'>
									<Checkbox
										checked={selectedInvoices.includes(invoice)}
										onChange={() => handleSelectInvoice(invoice)}
									/>
								</td>
								<td >{invoice.id || '-'}</td>
								<td >
									{invoice.ti_amount ? Number(invoice.ti_amount).toLocaleString(org_currency, { style: 'currency', currency: org_currency }) : '-'}
								</td>
								<td >
									{invoice.ti_paid ? Number(invoice.ti_paid).toLocaleString(org_currency, { style: 'currency', currency: org_currency }) : Number(0).toLocaleString(org_currency, { style: 'currency', currency: org_currency })}
								</td>
								<td >
									{invoice.ti_balance ? Number(invoice.ti_balance).toLocaleString(org_currency, { style: 'currency', currency: org_currency }) : Number(0).toLocaleString(org_currency, { style: 'currency', currency: org_currency })}
								</td>
								<td >{invoice.ti_status}</td>
								<td >{invoice.ti_created_at ? new Date(invoice.ti_created_at).toLocaleDateString('en-GB') : '-'}</td>
								<td >
									<IconButton size='small' sx={{ color: '#01947A' }}>
										<EditIcon fontSize='inherit' />
									</IconButton>
								</td>
							</tdr>
						))}
					</tbody>
				</table>
				{/* Pagination Component */}
				<TablePagination rowsPerPageOptions={[]} component='div' count={invoices.length} rowsPerPage={rowsPerPage} page={currentPage} onPageChange={handleChangePage} />
			</TableContainer>

			{previewOpen && (
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
