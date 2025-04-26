import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ClientTable = ({ clients, onEditClick, onClientClick }) => {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead sx={{ backgroundColor: '#FFFFFF' }}>
					<TableRow>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Summary</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Name</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Email</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Phone</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Last Inv Date</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Edit</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{clients.map((client, index) => (
						<TableRow key={index} onClick={() => onClientClick(client)} sx={{ cursor: 'pointer', backgroundColor: '#f5f5f5' }}>
							<TableCell>
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
							</TableCell>
							<TableCell sx={{ border: 'none' }}>{client.c_name}</TableCell>
							<TableCell sx={{ border: 'none' }}>{client.c_email}</TableCell>
							<TableCell sx={{ border: 'none' }}>{client.c_phone}</TableCell>
							<TableCell sx={{ border: 'none' }}>{client.c_status}</TableCell>
							<TableCell sx={{ border: 'none' }}>{client.c_last_invoice_date || '-'}</TableCell>
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
									}}
								>
									New Invoice
								</Button>
							</TableCell>

							<TableCell>
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
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ClientTable;
