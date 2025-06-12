import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';

const AssetIncome = ({ incomeData, selectedAsset }) => {
	if (!selectedAsset) return null;
	return (
		<Box mt={4}>
			<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
				<Typography variant='h6'>Incomes</Typography>
			</Box>

			<TableContainer component={Paper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Client / Trip</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{incomeData.map(income => (
							<TableRow key={income.id}>
								<TableCell>{income.date}</TableCell>
								<TableCell>${income.amount}</TableCell>
								<TableCell>{income.description}</TableCell>
								<TableCell>{income.relatedTo}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default AssetIncome;
