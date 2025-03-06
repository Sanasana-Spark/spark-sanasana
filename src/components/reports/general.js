import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAuthContext } from "../onboarding/authProvider";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Reports = () => {
    const baseURL = process.env.REACT_APP_BASE_URL;
    const { org_id } = useAuthContext();
    const [reports, setReports] = useState({ 
        trips_listing: [], 
        assets_listing: [],
        operators_listing: [], 
         tripsByOperator: [] 
        });
    console.log(reports)
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [previewReport, setPreviewReport] = useState(null);

    useEffect(() => {
        fetchReports();
    },
    // eslint-disable-next-line 
     []);

    const fetchReports = async () => {
        if (!org_id) {
            console.error("Organization ID is not available");
            return;
        }

        try {
            const tripsResponse = await axios.get(`${baseURL}/trips/reports/${org_id}`, {
                params: { organization_id: org_id, start_date: startDate, end_date: endDate }
            });
            const assetsResponse = await axios.get(`${baseURL}/assets/reports/${org_id}`, {
                params: { organization_id: org_id, start_date: startDate, end_date: endDate }
            });
            const operatorsResponse = await axios.get(`${baseURL}/operators/reports/${org_id}`, {
                params: { organization_id: org_id, start_date: startDate, end_date: endDate }
            });
            const tripsByOperatorResponse = await axios.get(`${baseURL}/trips/reports/${org_id}`, {
                params: { organization_id: org_id, start_date: startDate, end_date: endDate }
            });

            setReports({
                trips_listing: tripsResponse.data,
                assets_listing: assetsResponse.data,
                operators_listing: operatorsResponse.data,
                tripsByOperator: tripsByOperatorResponse.data
            });
        } catch (error) {
            console.error("Error fetching reports:", error);
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
                headStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: 'bold' }
            });
        } else {
            doc.text("No data available", 14, 25);
        }

        doc.save(`${reportName}_report.pdf`);
    };


    const ReportPDF = ({ report }) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Report ID: {report.id}</Text>
                    <Text>Details: {JSON.stringify(report, null, 2)}</Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <div className="p-4">
            <div className="mb-4">
                <span> Start date: </span>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span> End date: </span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <span></span>
                <button onClick={fetchReports} className="bg-blue-500 text-white px-4 py-2">Refresh Reports</button>
            </div>
            <br/>
            

{Object.entries(reports).map(([key, data]) => (
                <div key={key} className="mb-6 p-4 border rounded-lg shadow-md">
                
                    <h4 className="text-lg font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                 

                    <button  className="bg-red-500 text-white px-4 py-2 ml-2 rounded">
                    <CSVLink data={data} filename={`${key}_report.csv`} className="bg-green-500 text-white px-4 py-2 rounded">
                        Download CSV
                    </CSVLink>

                    </button>

                    <button onClick={() => generatePDF(data, key)} className="bg-red-500 text-white px-4 py-2 ml-2 rounded">
                    Download PDF
                    </button>
                </div>
            ))}





            {previewReport && (
                <div className="p-4 border mt-6">
                    <h3 className="text-lg font-bold">PDF Preview for Report ID: {previewReport.id}</h3>
                    <PDFDownloadLink document={<ReportPDF report={previewReport} />} fileName={`report_${previewReport.id}.pdf`}>
                        {({ loading }) => (loading ? "Loading preview..." : "Download PDF Preview")}
                    </PDFDownloadLink>
                </div>
            )}
        </div>
    );
};

const styles = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 }
});

export default Reports;
