import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button } from '@mui/material';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const OperatorTable = React.memo(({ operators, onViewUnitsClick, onEditClick }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const rowsPerPage = 7;

	useEffect(() => {
		setIsDropdownOpen(Array(operators.length).fill(false));
	}, [operators]);

	const handleCellClick = (rowIndex) => {
		setIsDropdownOpen(prevState => {
			const newDropdowns = [...prevState];
			newDropdowns[rowIndex] = !newDropdowns[rowIndex];
			return newDropdowns;
		});
		onViewUnitsClick(rowIndex);
	};

	const handleChangePage = (event, newPage) => {
		setCurrentPage(newPage);
	};

	const paginatedOperators = Array.isArray(operators) ? operators.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage) : [];

	return (
		<>
			<TableContainer>
				<Table stickyHeader aria-label='sticky table'>
					<TableHead>
						<TableRow style={{ backgroundColor: 'var(--secondary-bg-color)' }}>
							<TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Email address</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Edit</TableCell>

						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedOperators.map((operator, index) => (
							<TableRow key={operator.id} onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--main-bg-color)')} sx={{ border: 'none' }}>
								
								<TableCell>
									<Button onClick={() => handleCellClick(operator.id)} sx={{ color: 'var(--secondary-color)' }} >
										{isDropdownOpen[index] ? 'Close Details' : 'Details'}
										</Button>
								</TableCell>
								<TableCell>{operator.o_name}</TableCell>
								<TableCell>{operator.o_email}</TableCell>
								<TableCell>{operator.o_role}</TableCell>
								<TableCell>{operator.o_phone}</TableCell>
								<TableCell>{operator.o_status}</TableCell>
								
								<TableCell>
									<IconButton onClick={() => onEditClick(operator.id)} sx={{ color: 'var(--secondary-color)' }}  style={{ marginLeft: '10px' }}>
										<EditIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination rowsPerPageOptions={[]} component='div' count={operators.length} rowsPerPage={rowsPerPage} page={currentPage} onPageChange={handleChangePage} />
		</>
	);
});

export default React.memo(OperatorTable);
