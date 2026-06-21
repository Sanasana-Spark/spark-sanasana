import { useState, useEffect } from 'react';
import {  Box, TableContainer,  Pagination, TextField, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuthContext } from '../components/onboarding/authProvider';
import KpiCard from '../components/ui/KpiCard';

const Fuel = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { org_currency, apiFetch } = useAuthContext();

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
		apiFetch(`${baseURL}/fuel/`, { method: 'GET' })
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

	}, [baseURL, apiFetch]);

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
		 <div className="page">
		<div className="page-header">
			<div><div className="page-title">Fuel history</div></div>
			<div className="page-actions">
			<button className="btn btn-secondary" onClick='#'>+ bulk fuel purchase</button>
			<button className="btn btn-primary" onClick="#">+ record fuel expense</button>
			</div>
      	</div>

		<div className="grid-4">
			<KpiCard label="Total Fuel Cost" value= {`${org_currency} - ${totalFuelCost}`} icon="👤" color="var(--lime)"  chipColor="var(--lime-bg)"  footer="3 cities" />
			<KpiCard label="Total Fuel (Litres)"     value={totalLitres} icon="⭐" color="var(--blue)"  chipColor="var(--blue-bg)"  footer="↑ 3 pts vs last month" footerType="up" />
			<KpiCard label="Total Mileage(km)"     value={TotalMileage}  icon="⚠"  color="var(--amber)" chipColor="var(--amber-bg)" footer="This month" />
			<KpiCard label="Total Request"    value={TotalRequests} icon="🏆" color="var(--forest)" chipColor="var(--lime-bg)" footer="Score 96 · 4,220 km" />
		</div>

			

		 <div className="card">
        <div className="card-header">
			<div className="card-title">
			{/* Search & Filters */}
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
			</div>
		</div>


			{/* Table */}
			<TableContainer >
				<table className="data-table">
					<thead><tr><th>Reg-No</th><th>Operator</th><th>Distance</th><th>Fuel Type</th><th>Litres</th><th> Total Cost</th><th>Km/Litre</th><th>Date</th></tr></thead>

					<tbody>
						{paginatedEntries.length > 0 ? (
							paginatedEntries.map(entry => (
								<tr key={entry.id}
								 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg-color)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--main-bg-color)' }
            sx={{ border: 'none' }} 
			>

									<td>{entry.a_license_plate}</td>
									<td>{entry.o_name}</td>
									<td>{entry.f_distance}</td>
									<td>{entry.a_fuel_type}</td>
									<td>{entry.f_litres.toFixed(2)}</td>
									<td>{entry.f_total_cost}</td>
									<td>{entry.f_litres > 0 ? (parseFloat(entry.f_distance) / entry.f_litres).toFixed(2) : '0.00'}</td>
									<td>{new Date(entry.f_created_at).toLocaleDateString('en-GB')}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={8} align='center'>
									No records found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</TableContainer>

			{/* Pagination */}
			<Box sx={{ my: 1, display: 'flex', justifyContent: 'center' }}>
				<Pagination count={totalPages} page={currentPage} onChange={(e, value) => setCurrentPage(value)} color='primary' />
			</Box>

		
		</div>


		</div>
	);
};

export default Fuel;
