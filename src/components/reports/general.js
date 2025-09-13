/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../onboarding/authProvider';
import { Box, Button, Typography, TextField, Stack, Table, TableHead, TableRow, TableCell, TableBody, Modal } from '@mui/material';

const Reports = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { org_id, apiFetch } = useAuthContext();
	const [loading, setLoading] = useState(false);
	const today = new Date();
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(today.getDate() - 30);
	const formatDate = date => date.toISOString().split('T')[0];

	const [startDate, setStartDate] = useState(formatDate(thirtyDaysAgo));
	const [endDate, setEndDate] = useState(formatDate(today));
	const [previewUrl, setPreviewUrl] = useState(null);
	const [fileType, setFileType] = useState('excel');
	const [reportData, setReportData] = useState([]);
	const [activeReport, setActiveReport] = useState(null);

	const reports_urls_param = [
		{id:1, report_name: "trip_listing_report", url: `${baseURL}/reports/trip-listing/`,
		params: {start_date: startDate, end_date: endDate, export:fileType } },
		{id:2, report_name: "assets_listing_report", url: `${baseURL}/reports/assets-listing/`,
		params: {start_date: startDate, end_date: endDate, export:fileType } },
		{id:3, report_name: "new_assets_report", url: `${baseURL}/reports/new-asset-listing/`,
		params: {start_date: startDate, end_date: endDate, export:fileType } },
		{id:4, report_name: "fuel_requests_expense_report", url: `${baseURL}/reports/fuel-requests-expense/`,
		params: {start_date: startDate, end_date: endDate, export:fileType } },
		{id:5, report_name: "maintenance_listing_report", url: `${baseURL}/reports/maintenance-listing/`,
		params: {start_date: startDate, end_date: endDate, export:fileType } },
		{id:6, report_name: "operators_listing_report", url: `${baseURL}/reports/operators-listing/`,
		params: {start_date: startDate, end_date: endDate, export:fileType } },
		{id:7, report_name: "new_operators_listing_report", url: `${baseURL}/reports/new-operators-listing/`,
		params: {start_date: startDate, end_date: endDate, export:fileType } },
	];

	useEffect(() => {
		if (org_id && reports_urls_param.length > 0) {
			setActiveReport(reports_urls_param[0]);
		}
	}, [org_id]);

	useEffect(() => {
		if (activeReport) {
			fetchReport();
		}
	}, [activeReport]);

	const fetchReport = async () => {
		if (!activeReport) return;
		setLoading(true);

		// Build query string from params
		const params = new URLSearchParams();
		Object.entries(activeReport.params).forEach(([key, value]) => {
			if (typeof value === 'object') {
				Object.entries(value).forEach(([subKey, subValue]) => {
					params.append(`${key}[${subKey}]`, subValue);
				});
			} else {
				params.append(key, value);
			}
		});

		const urlWithParams = `${activeReport.url}?${params.toString()}`;
		apiFetch(urlWithParams, { method: 'GET' })
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then(data => {
				setReportData(data);
				setLoading(false);
			})
			.catch(error => {
				console.error("Error fetching report:", error);
				setLoading(false);
			});

	};

	const buildReportUrl = (report, fileType) => {
		const params = new URLSearchParams({
			...report.params,
			export: fileType,
			start_date: startDate,
			end_date: endDate
		});
		return `${report.url}?${params.toString()}`;
	};
	const handleDownload = (id, fileType) => {
		const report = reports_urls_param.find(r => r.id === id);
		if (report) {
			const updatedReport = {
				...report,
				params: {
					...report.params,
					export: fileType
				}
			};
			setActiveReport(updatedReport);
			const downloadUrl = buildReportUrl(report, fileType);
			// Trigger browser download by opening in a new tab
			window.open(downloadUrl, "_blank");
		}
	};

	const handlePreview = (id, fileType) => {
		const report = reports_urls_param.find(r => r.id === id);
		if (!report) return;

		const url = buildReportUrl(report, fileType);

		setLoading(true);
		fetch(url)
			.then(res => {
			if (!res.ok) throw new Error("Failed to fetch PDF");
			return res.blob();
			})
			.then(blob => {
			const fileURL = URL.createObjectURL(blob);
			setPreviewUrl(fileURL); // now iframe can use it
			})
			.catch(err => console.error("Error fetching PDF preview:", err))
			.finally(() => setLoading(false));
		};
		console.log('Preview URL:', previewUrl);

  	
	return (
		<Box sx={{ p: 4 }}>
			<Stack direction='row' spacing={2} alignItems='center' mb={4}>
				<Typography>Start Date:</Typography>
				<TextField type='date' size='small' value={startDate} onChange={e => setStartDate(e.target.value)} />
				<Typography>End Date:</Typography>
				<TextField type='date' size='small' value={endDate} onChange={e => setEndDate(e.target.value)} />
				{/* <Button variant='contained' onClick={fetchReports} disabled={loading}>
					{loading ? 'Loading...' : 'Refresh Reports'}
				</Button> */}
			</Stack>

			   {/* Reports List */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Report Name</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports_urls_param.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.report_name}</TableCell>
            
              <TableCell>
                <Button onClick={() => handleDownload(r.id, 'pdf')}>PDF↓</Button>
                <Button onClick={() => handleDownload(r.id, 'excel')}>XLSX↓</Button>
				<Button onClick={() => handlePreview(r.id, 'pdf')}></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Preview Modal */}
      {previewUrl && (
        <Modal onClose={() => setPreviewUrl(null)}>
          <Box sx={{ p: 2, backgroundColor: '#fff', width: '80%', height: '80%', margin: 'auto', mt: 4 }}>
      <iframe
        src={previewUrl}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </Box>
        </Modal>
      )}

		</Box>
	);
};

export default Reports;
