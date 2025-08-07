/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { useAuthContext } from '../onboarding/authProvider';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Box, Button, Typography, TextField, Stack, CircularProgress } from '@mui/material';

const Reports = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { org_id, user_id } = useAuthContext();

	const [reports, setReports] = useState({
		trips_listing: [],
		assets_listing: [],
		operators_listing: [],
		tripsByOperator: [],
		FuelExpenseReport: [],
		maintenance_listing: [],
	});
	const [loading, setLoading] = useState(false);

	const today = new Date();
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(today.getDate() - 30);

	const formatDate = date => date.toISOString().split('T')[0];

	const [startDate, setStartDate] = useState(formatDate(thirtyDaysAgo));
	const [endDate, setEndDate] = useState(formatDate(today));
	const [previewReport, setPreviewReport] = useState(null);

	useEffect(() => {
		fetchReports();
		// eslint-disable-next-line
	}, []);

	const fetchReports = async () => {
		if (!org_id) {
			console.error('Organization ID is not available');
			return;
		}

		setLoading(true);

		try {
			const tripsResponse = await axios.get(`${baseURL}/trips/reports/${org_id}`, {
				params: { organization_id: org_id, start_date: startDate, end_date: endDate },
			});
			const assetsResponse = await axios.get(`${baseURL}/assets/reports/${org_id}`, {
				params: { organization_id: org_id, start_date: startDate, end_date: endDate },
			});
			const operatorsResponse = await axios.get(`${baseURL}/operators/reports/${org_id}`, {
				params: { organization_id: org_id, start_date: startDate, end_date: endDate },
			});
			const tripsByOperatorResponse = await axios.get(`${baseURL}/trips/reports/${org_id}`, {
				params: { organization_id: org_id, start_date: startDate, end_date: endDate },
			});
			const fuel_expenseReport = await axios.get(`${baseURL}/fuel/${org_id}/${user_id}/report/`, {
				params: { start_date: startDate, end_date: endDate },
			});
			const maintenanceResponse = await axios.get(`${baseURL}/maintenances/report/${org_id}/${user_id}/`, {
				params: { start_date: startDate, end_date: endDate },
			});

			setReports({
				trips_listing: Array.isArray(tripsResponse.data) ? tripsResponse.data : [],
				assets_listing: Array.isArray(assetsResponse.data) ? assetsResponse.data : [],
				operators_listing: Array.isArray(operatorsResponse.data) ? operatorsResponse.data : [],
				tripsByOperator: Array.isArray(tripsByOperatorResponse.data) ? tripsByOperatorResponse.data : [],
				FuelExpenseReport: Array.isArray(fuel_expenseReport.data) ? fuel_expenseReport.data : [],
				maintenance_listing: Array.isArray(maintenanceResponse.data) ? maintenanceResponse.data : [],
			});
		} catch (error) {
			console.error('Error fetching reports:', error);
		} finally {
			setLoading(false);
		}
	};

	const generatePDF = (reportData, reportName) => {
		const doc = new jsPDF();
		doc.setFontSize(16);
		doc.text(`${reportName} Report`, 14, 15);

		if (reportData.length > 0) {
			const columns = Object.keys(reportData[0]).map(col => col.replace(/_/g, ' ').toUpperCase());
			const rows = reportData.map(item => Object.values(item));

			autoTable(doc, {
				head: [columns],
				body: rows,
				startY: 25,
				styles: { fontSize: 10, cellPadding: 3 },
				headStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: 'bold' },
			});
		} else {
			doc.text('No data available', 14, 25);
		}

		doc.save(`${reportName}_report.pdf`);
	};

	const ReportPDF = ({ report }) => (
		<Document>
			<Page size='A4' style={styles.page}>
				<View style={styles.section}>
					<Text>Report ID: {report.id}</Text>
					<Text>Details: {JSON.stringify(report, null, 2)}</Text>
				</View>
			</Page>
		</Document>
	);

	return (
		<Box sx={{ p: 4 }}>
			<Stack direction='row' spacing={2} alignItems='center' mb={4}>
				<Typography>Start Date:</Typography>
				<TextField type='date' size='small' value={startDate} onChange={e => setStartDate(e.target.value)} />
				<Typography>End Date:</Typography>
				<TextField type='date' size='small' value={endDate} onChange={e => setEndDate(e.target.value)} />
				<Button variant='contained' onClick={fetchReports} disabled={loading}>
					{loading ? 'Loading...' : 'Refresh Reports'}
				</Button>
			</Stack>

			{loading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
					<CircularProgress />
				</Box>
			) : (
				Object.entries(reports).map(([key, data]) => (
					<Box
						key={key}
						sx={{
							mb: 4,
							p: 2,
							border: '1px solid #ddd',
							borderRadius: 2,
						}}
					>
						<Typography variant='h6' fontWeight='bold' gutterBottom>
							{key.replace(/([A-Z])/g, ' $1')}
						</Typography>

						{Array.isArray(data) && data.length > 0 ? (
							<Button variant='outlined' color='success' size='small' sx={{ mt: 1 }}>
								<CSVLink data={data} filename={`${key}_report.csv`} style={{ textDecoration: 'none', color: 'inherit' }}>
									Download CSV
								</CSVLink>
							</Button>
						) : (
							<Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
								No data to download
							</Typography>
						)}

						{/* Uncomment to enable PDF download
						<Button
							variant="outlined"
							color="error"
							size="small"
							onClick={() => generatePDF(data, key)}
							sx={{ ml: 2 }}
						>
							Download PDF
						</Button>
						*/}
					</Box>
				))
			)}

			{previewReport && (
				<Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
					<Typography variant='h6' fontWeight='bold' gutterBottom>
						PDF Preview for Report ID: {previewReport.id}
					</Typography>
					<PDFDownloadLink document={<ReportPDF report={previewReport} />} fileName={`report_${previewReport.id}.pdf`}>
						{({ loading }) => (loading ? 'Loading preview...' : 'Download PDF Preview')}
					</PDFDownloadLink>
				</Box>
			)}
		</Box>
	);
};

const styles = StyleSheet.create({
	page: { padding: 20 },
	section: { marginBottom: 10 },
});

export default Reports;
