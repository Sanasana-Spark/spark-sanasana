/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { useAuthContext } from '../onboarding/authProvider';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Stack } from '@mui/material';

const Reports = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { org_id } = useAuthContext();
	const [reports, setReports] = useState({
		trips_listing: [],
		assets_listing: [],
		operators_listing: [],
		tripsByOperator: [],
	});
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [operator, setOperator] = useState('');
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

		try {
			const params = { organization_id: org_id, start_date: startDate, end_date: endDate, operator };
			const [trips, assets, operators, tripsByOperator] = await Promise.all([axios.get(`${baseURL}/trips/reports/${org_id}`, { params }), axios.get(`${baseURL}/assets/reports/${org_id}`, { params }), axios.get(`${baseURL}/operators/reports/${org_id}`, { params }), axios.get(`${baseURL}/trips/reports/${org_id}`, { params })]);

			setReports({
				trips_listing: trips.data,
				assets_listing: assets.data,
				operators_listing: operators.data,
				tripsByOperator: tripsByOperator.data,
			});
		} catch (error) {
			console.error('Error fetching reports:', error);
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
			<Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap' mb={4}>
				<TextField type='date' label='Start Date' value={startDate} onChange={e => setStartDate(e.target.value)} size='small' InputLabelProps={{ shrink: true }} />
				<TextField type='date' label='End Date' value={endDate} onChange={e => setEndDate(e.target.value)} size='small' InputLabelProps={{ shrink: true }} />
				<FormControl size='small' sx={{ minWidth: 200 }}>
					<InputLabel>Filter by Operator</InputLabel>
					<Select value={operator} label='Filter by Operator' onChange={e => setOperator(e.target.value)}>
						<MenuItem value=''>All Operators</MenuItem>
						{reports.operators_listing.map(op => (
							<MenuItem key={op.id} value={op.id}>
								{op.o_name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button variant='contained' onClick={fetchReports}>
					Refresh Reports
				</Button>
			</Stack>

			{Object.entries(reports).map(([key, data]) => (
				<Box
					key={key}
					sx={{
						mb: 4,
						p: 2,
						border: '1px solid #ccc',
						borderRadius: 2,
					}}
				>
					<Typography variant='h6' fontWeight='bold' gutterBottom>
						{key.replace(/([A-Z])/g, ' $1')}
					</Typography>

					<Stack direction='row' spacing={2} mt={1}>
						<Button variant='outlined' color='success' size='small'>
							<CSVLink data={data} filename={`${key}_report.csv`} style={{ textDecoration: 'none', color: 'inherit' }}>
								Download CSV
							</CSVLink>
						</Button>

						<Button variant='outlined' color='error' size='small' onClick={() => generatePDF(data, key)}>
							Download PDF
						</Button>
					</Stack>
				</Box>
			))}

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
