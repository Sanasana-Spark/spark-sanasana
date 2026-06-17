import React, { useState } from 'react';
import {TableContainer, Paper, TablePagination, IconButton } from '@mui/material';
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
			<table className="data-table">
				<thead><tr><th>Action</th><th>Name</th><th>T.Balance</th><th>Email</th><th>Phone</th><th>Status</th><th>Delete</th> </tr></thead>
    
				<tbody>
					{paginatedClients.map((client, index) => (
						<tdr
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
							<td>
								<button
								className="btn btn-primary"
									onClick={e => {
										e.stopPropagation();
										onNewInvoiceClick(client);
									}}
								>
									+ Invoice
								</button>
							</td>
							<td>{client.c_name}</td>
							<td>{client.c_name}</td>
							<td>{client.c_email}</td>
							<td>{client.c_phone}</td>
							<td>{client.c_status}</td>
							
							<td>
								<IconButton onClick={() => onDeleteClick(client.id)} style={{ marginLeft: '10px' }}>
									<DeleteForever sx={{ color: 'red' }} />
								</IconButton>
							</td>

							{/* <td>
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
							</td> */}
						</tdr>
					))}
				</tbody>
			</table>
			{/* Pagination Component */}
			<TablePagination rowsPerPageOptions={[]} component='div' count={clients.length} rowsPerPage={rowsPerPage} page={currentPage} onPageChange={handleChangePage} />
		</TableContainer>
	);
};

export default ClientTable;
