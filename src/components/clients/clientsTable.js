import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, IconButton } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

const ClientTable = ({ clients, onEditClick, onClientClick, onNewInvoiceClick, onDeleteClick }) => {
	const [currentPage, setCurrentPage] = useState(0);
	const rowsPerPage = 5;
	// Handle pagination change
	const handleChangePage = (event, newPage) => {
		setCurrentPage(newPage);
	};
	const paginatedClients = clients.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead sx={{ backgroundColor: '#FFFFFF' }}>
					<TableRow>
						{/* <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Summary</TableCell> */}
						<TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
						<TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
						<TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
						<TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
						<TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
						{/* <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Edit</TableCell>  */}
					</TableRow>
				</TableHead>
				<TableBody>
					{paginatedClients.map((client, index) => (
						<TableRow
							key={index}
							onClick={() => onClientClick(client)}
							sx={{
								cursor: 'pointer',
								backgroundColor: client.isActive ? 'var(--secondary-color)' : '#f5f5f5', // Set active row color
								'&:hover': {
									backgroundColor: client.isActive ? 'var(--secondary-color-hover)' : '#e0e0e0',
								},
							}}
						>
							{/* <TableCell>
														<Button
															size='small'
															variant='contained'
															sx={{
																backgroundColor: '#01947A',
																borderRadius: '20px',
																textTransform: 'none',
																fontSize: '0.8rem',
																px: 2,
																py: 0.5,
																'&:hover': {
																	backgroundColor: '#008F8F',
																},
															}}
														>
															View
														</Button>
													</TableCell> */}
							<TableCell sx={{ border: 'none' }}>{client.c_name}</TableCell>
							<TableCell sx={{ border: 'none' }}>{client.c_email}</TableCell>
							<TableCell sx={{ border: 'none' }}>{client.c_phone}</TableCell>
							<TableCell sx={{ border: 'none' }}>{client.c_status}</TableCell>
							<TableCell>
								<Button
									size='small'
									variant='contained'
									sx={{
										width: '80px',
										height: '30px',
										borderRadius: '100px',
										backgroundColor: '#01947A',
										textTransform: 'none',
										fontSize: '0.78rem',
										letterSpacing: '-0.3px',
										whiteSpace: 'nowrap',
										minHeight: 'unset',
										gap: '8px',
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										'&:hover': {
											backgroundColor: '#008F8F',
										},
									}}
									onClick={e => {
										e.stopPropagation();
										onNewInvoiceClick(client);
									}}
								>
									New Invoice
								</Button>
							</TableCell>
							<TableCell>
								<IconButton onClick={() => onDeleteClick(client.id)} style={{ marginLeft: '10px' }}>
									<DeleteForever sx={{ color: 'red' }} />
								</IconButton>
							</TableCell>

							{/* <TableCell>
								<IconButton
									sx={{ color: '#01947A' }}
									size='small'
									onClick={e => {
										e.stopPropagation();
										onEditClick(client.id);
									}}
									style={{ marginLeft: '10px' }}
								>
									<EditIcon />
								</IconButton>
							</TableCell> */}
						</TableRow>
					))}
				</TableBody>
			</Table>
			{/* Pagination Component */}
			<TablePagination rowsPerPageOptions={[]} component='div' count={clients.length} rowsPerPage={rowsPerPage} page={currentPage} onPageChange={handleChangePage} />
		</TableContainer>
	);
};

export default ClientTable;
