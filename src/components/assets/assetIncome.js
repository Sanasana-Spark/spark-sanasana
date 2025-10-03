import React, {useEffect} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Paper } from '@mui/material';
import { useAuthContext } from '../onboarding/authProvider';

const AssetIncome = ({  selectedAsset }) => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { apiFetch } = useAuthContext();


	const [incomeData, setIncomeData] = React.useState([]);
	useEffect(() => {
		if (!selectedAsset) return;
		apiFetch(`${baseURL}/trips/asset_income/${selectedAsset.id}/`, { method: 'GET' })
			.then(res => res.json())
			.then(data => {
				setIncomeData(data);
			})
			.catch(err => console.error('Error loading income:', err));
	}, [baseURL, selectedAsset, apiFetch]);

	// if (!selectedAsset) return null;
	return (
		<Box mt={4}>
			<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
				<Typography variant='h6'>
				{incomeData && selectedAsset ? `Income record for  ${selectedAsset.a_license_plate} ` : 'click on a Vehicle to preview income'}</Typography>
				
				<Typography variant='subtitle1' color='textSecondary'>
					
					 </Typography>
			</Box>

			<TableContainer component={Paper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Date</TableCell>
							<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Amount</TableCell>
							<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>type</TableCell>
							<TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Description</TableCell>
						
						</TableRow>
					</TableHead>
					<TableBody>
					{incomeData.length > 0 ? (
						<>
						{incomeData.map(income => (
							<TableRow key={income.id}>
								<TableCell>{new Date(income.ti_created_at).toLocaleDateString('en-GB')}</TableCell>
								<TableCell>{income.ti_amount}</TableCell>
								<TableCell>{income.ti_type}</TableCell>
								<TableCell>{income.ti_description}</TableCell>
								
							</TableRow>
						))}
						</>

					) : (
						<TableRow>
							<TableCell colSpan={4} align='center'>No income data available for this vehicle</TableCell>
						</TableRow>
					)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default AssetIncome;
