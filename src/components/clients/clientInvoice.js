import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton, Typography, Button, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuthContext } from "../onboarding/authProvider";

const ClientInvoice = ({ invoicesss, selectedClient }) => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { user_id, org_id } = useAuthContext();

	const [currentPage, setCurrentPage] = useState(0);
	const [invoices, setInvoices] = useState([]);
	const [, setLoading] = useState(true);

	useEffect(() => {
		if (org_id && user_id && selectedClient && selectedClient.id) {
		const apiUrl = `${baseURL}/clients/invoices/${org_id}/${user_id}/${selectedClient.id}/`;
		fetch(apiUrl)
		  .then((response) => {
			if (!response.ok) {
			  throw new Error("Network response was not ok");
			}
			return response.json();
		  })
		  .then((data) => {
			setInvoices(data.invoices || []);
			setLoading(false);
		  })
		  .catch((error) => {
			console.error("Error fetching invoices:", error);
			setLoading(false);
		  });
	  }}, [ baseURL, org_id, user_id, selectedClient]);

	//   if (!selectedClient || invoices.length === 0) return null;

	const rowsPerPage = 5;
	  // Handle pagination change
	const handleChangePage = (event, newPage) => {
		  setCurrentPage(newPage);
	};

	const paginatedInvoices = invoices.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);


	return (
		<Box mt={4}>
			<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
				<Typography variant='subtitle1' gutterBottom>
					Clients - {selectedClient.c_name} Invoices
				</Typography>
				<Button
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
					Preview/Email Invoice
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
							{['Invoice No', 'Amount', 'Balance', 'Status', 'Date', 'Edit'].map(header => (
								<TableCell
									key={header}
									sx={{
										fontWeight: 600,
										fontSize: '0.75rem',
										padding: '4px 8px',
										whiteSpace: 'nowrap',
									}}
								>
									{header}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedInvoices.map((invoice, index) => (
							<TableRow key={index} sx={{ backgroundColor: '#f5f5f5', '&:last-child td': { borderBottom: 0 } }}>
								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.invoice_no || '-'}</TableCell>

								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.ti_amount}</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.ti_balance || invoice.ti_amount}</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.ti_status}</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.ti_created_at ? new Date(invoice.ti_created_at).toLocaleDateString('en-GB') : '-'}</TableCell>

								<TableCell sx={{ padding: '4px 8px', border: 'none' }}>
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
		</Box>
	);
};

export default ClientInvoice;
