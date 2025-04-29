import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ClientInvoice = ({ invoices, selectedClient }) => {
	if (!selectedClient || invoices.length === 0) {
		return null;
	}

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
							{['Invoice No', 'Amt', 'Balance', 'Status', 'Date', 'Edit'].map(header => (
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
						{invoices.map((invoice, index) => (
							<TableRow
								key={index}
								sx={{
									backgroundColor: '#f5f5f5',
									'&:last-child td': { borderBottom: 0 },
								}}
							>
								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.id || '-'}</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.ti_amount}</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.ti_balance || invoice.ti_amount}</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.ti_status}</TableCell>
								<TableCell sx={{ fontSize: '0.75rem', padding: '4px 8px', border: 'none' }}>{invoice.ti_created_at || '-'}</TableCell>
								<TableCell sx={{ padding: '4px 8px', border: 'none' }}>
									<IconButton size='small' sx={{ color: '#01947A' }}>
										<EditIcon fontSize='inherit' />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default ClientInvoice;
