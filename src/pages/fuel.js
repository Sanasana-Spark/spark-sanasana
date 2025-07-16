import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, TextField, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuthContext } from '../components/onboarding/authProvider';

const Fuel = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { org_id, org_currency, user_id } = useAuthContext();

	const [loading, setLoading] = useState(true);
	console.log(loading);
	const [fuelEntries, setFuelEntries] = useState([]);
	const [search, setSearch] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [vehicle, setVehicle] = useState('');
	const [paginatedEntries, setPaginatedEntries] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [totalPages, setTotalPages] = useState(0);
	const [filteredEntries, setFilteredEntries] = useState([]);

	useEffect(() => {
		if (org_id && user_id) {
			const apiUrl = `${baseURL}/fuel/${org_id}/${user_id}`;
			fetch(apiUrl)
				.then(response => {
					if (!response.ok) throw new Error('Network response was not ok');
					return response.json();
				})
				.then(data => {
					setFuelEntries(data);
					setLoading(false);
				})
				.catch(error => {
					console.error('Error fetching data:', error);
					setLoading(false);
				});
		}
	}, [baseURL, org_id, user_id]);

	useEffect(() => {
		let filtered = fuelEntries;

		if (search) {
			filtered = filtered.filter(entry => entry.a_license_plate.toLowerCase().includes(search.toLowerCase()) || entry.o_name.toLowerCase().includes(search.toLowerCase()));
		}

		if (startDate) {
			filtered = filtered.filter(entry => entry.f_created_at && new Date(entry.f_created_at) >= new Date(startDate));
		}

		if (endDate) {
			filtered = filtered.filter(entry => entry.f_created_at && new Date(entry.f_created_at) <= new Date(endDate));
		}

		if (vehicle) {
			filtered = filtered.filter(entry => entry.a_license_plate === vehicle);
		}

		setFilteredEntries(filtered);
	}, [search, startDate, endDate, vehicle, fuelEntries]);

	useEffect(() => {
		setTotalPages(Math.ceil(filteredEntries.length / itemsPerPage));
		setPaginatedEntries(filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
	}, [filteredEntries, currentPage, itemsPerPage]);

	const TotalMileage = filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.f_distance), 0).toFixed(2);
	const TotalRequests = filteredEntries.length;
	const totalLitres = filteredEntries.reduce((sum, entry) => sum + entry.f_litres, 0).toFixed(2);
	const totalFuelCost = filteredEntries.reduce((sum, entry) => sum + entry.f_total_cost, 0);

	return (
		<Container maxWidth={false} disableGutters sx={{ px: 2 }}>

				<Typography variant='subtitle1' sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', marginBottom: 3 }} gutterBottom>
					Fuel history
				</Typography>
			

			{/* Search & Filters */}
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
				<TextField
					variant='outlined'
					label='Search by Reg-No or Operator'
					border='1px solid var(--secondary-color)'
					placeholder='Search'
					value={search}
					onChange={e => setSearch(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon />
							</InputAdornment>
						),
					}}
					sx={{ flex: 1, maxWidth: '400px' }}
				/>
				<TextField variant='outlined' type='date' label='Start Date' value={startDate} onChange={e => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
				<TextField variant='outlined' type='date' label='End Date' value={endDate} onChange={e => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
				<TextField select variant='outlined' label='Vehicle' value={vehicle} onChange={e => setVehicle(e.target.value)} sx={{ minWidth: '200px' }}>
					<MenuItem value=''>All Vehicles</MenuItem>
					{[...new Set(fuelEntries.map(entry => entry.a_license_plate))].map(plate => (
						<MenuItem key={plate} value={plate}>
							{plate}
						</MenuItem>
					))}
				</TextField>
			</Box>

			{/* Cards Grid */}
			<Box sx={{ overflowX: 'auto', marginBottom: 3 }}>
				<Grid container spacing={2}>
					{[
						{ label: 'Total Fuel Cost', value: `${org_currency}${totalFuelCost}`, bg: '#E3F5FF' },
						{ label: 'Total Fuel (Litres)', value: totalLitres, bg: '#E5ECF6' },
						{ label: 'Total Mileage(km)', value: TotalMileage, bg: '#E3F5FF' },
						{ label: 'Total Request', value: TotalRequests, bg: '#E5ECF6' }
					].map((card, index) => (
						<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
							<Paper
								sx={{
									backgroundColor: card.bg,
									padding: 2,
									textAlign: 'center',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									minHeight: 100,
									overflow: 'hidden',
									wordBreak: 'break-word',
								}}
							>
								<Typography
									variant='subtitle1'
									sx={{
										fontWeight: 'bold',
										fontSize: '1rem',
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										maxWidth: '100%',
									}}
								>
									{card.label}
								</Typography>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 'light',
										fontSize: '1.5rem',
										overflowWrap: 'break-word',
										wordBreak: 'break-word',
										maxWidth: '100%',
									}}
								>
									{card.value}
								</Typography>
							</Paper>
						</Grid>
					))}
				</Grid>
			</Box>

			{/* Table */}
			<TableContainer >
				<Table  stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow backgroundColor='var(--secondary-bg-color)' style={{ backgroundColor: 'var(--secondary-bg-color)' }} >
							{['Reg-No', 'Operator', 'Distance', 'Fuel Type', 'Litres', 'Total Cost', 'Km/Litre', 'Date'].map(header => (
								<TableCell key={header} >
									{header}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedEntries.length > 0 ? (
							paginatedEntries.map(entry => (
								<TableRow key={entry.id}
								 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-bg-color)' }
            sx={{ border: 'none' }} 
			>

									<TableCell>{entry.a_license_plate}</TableCell>
									<TableCell>{entry.o_name}</TableCell>
									<TableCell>{entry.f_distance}</TableCell>
									<TableCell>{entry.a_fuel_type}</TableCell>
									<TableCell>{entry.f_litres.toFixed(2)}</TableCell>
									<TableCell>{entry.f_total_cost}</TableCell>
									<TableCell>{entry.f_litres > 0 ? (parseFloat(entry.f_distance) / entry.f_litres).toFixed(2) : '0.00'}</TableCell>
									<TableCell>{new Date(entry.f_created_at).toLocaleDateString('en-GB')}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={8} align='center'>
									No records found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Pagination */}
			<Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
				<Pagination count={totalPages} page={currentPage} onChange={(e, value) => setCurrentPage(value)} color='primary' />
			</Box>
		</Container>
	);
};

export default Fuel;
