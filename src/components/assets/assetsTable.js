/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Checkbox, TablePagination } from '@mui/material';

const AssetsTable = ({ assets, onViewUnitsClick }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(Array(assets.length).fill(false));
	const [currentPage, setCurrentPage] = useState(0);
	const rowsPerPage = 7;

	const handleCellClick = rowIndex => {
		setIsDropdownOpen(prevState => {
			const newDropdowns = [...prevState];
			newDropdowns[rowIndex] = !newDropdowns[rowIndex];
			return newDropdowns;
		});
		onViewUnitsClick(rowIndex);
	};

	// Handle pagination change
	const handleChangePage = (event, newPage) => {
		setCurrentPage(newPage);
	};

	const paginatedAssets = assets.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

	// Handle checkbox selection (can be enhanced for more complex selection logic)
	const [selected, setSelected] = useState([]);
	const handleSelectRow = id => {
		const newSelected = selected.includes(id) ? selected.filter(item => item !== id) : [...selected, id];
		setSelected(newSelected);
	};

	return (
		<TableContainer>
			<Table stickyHeader aria-label='sticky table'>
				<TableHead>
					<TableRow backgroundColor='var(--secondary-bg-color)' style={{ backgroundColor: 'var(--secondary-bg-color)' }}>
						<TableCell padding='checkbox'> {/* Replace Action with Checkbox */}</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Reg No</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Driver</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Mileage</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Manufacturer</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Model</TableCell>
						<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Details</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* Render a TableRowItem for each asset in the assets array */}
					{paginatedAssets.map(asset => (
						<TableRow key={asset.id} onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--main-bg-color)')} sx={{ border: 'none' }}>
							<TableCell padding='checkbox'>
								<Checkbox checked={selected.includes(asset.id)} onChange={() => handleSelectRow(asset.id)} />
							</TableCell>
							<TableCell>{asset.a_license_plate}</TableCell>
							<TableCell>{asset.a_status}</TableCell>
							<TableCell> to set</TableCell>
							<TableCell>{asset.a_mileage}</TableCell>
							<TableCell>{asset.a_make}</TableCell>
							<TableCell>
								{asset.a_model}-{asset.a_year}
							</TableCell>
							<TableCell>
								{/* Move Details button here to the right */}
								<Button onClick={() => handleCellClick(asset.id)}>{isDropdownOpen[asset.id] ? 'Back' : 'Details'}</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Pagination Component */}
			<TablePagination
				rowsPerPageOptions={[]} // Hide the rows per page options
				component='div'
				count={assets.length} // Total number of assets
				rowsPerPage={rowsPerPage} // Rows per page
				page={currentPage} // Current page
				onPageChange={handleChangePage} // Page change handler
			/>
		</TableContainer>
	);
};

export default AssetsTable;
