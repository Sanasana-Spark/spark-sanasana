import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TableHead, TableBody, TableRow, TableCell, Divider, Table } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuthContext } from '../onboarding/authProvider';



const InvoicesPreview = ({ selectedInvoices, selectedClient, onClose, open }) => {
    console.log("selectedClient in InvoicesPreview:", selectedClient);

    const { user_id, user_email } = useAuthContext();
    const [orgDetails, setOrgDetails] = useState(null);
    const logoURL = orgDetails?.org_logo ? `https://spark-backend-1-2fdc.onrender.com/media/${orgDetails.org_logo}` : null;

    console.log("orgDetails state:", orgDetails);

    useEffect(() => {
        const fetchOrgDetails = async () => {
            try {
                const response = await fetch(`https://spark-backend-1-2fdc.onrender.com/organizations/user_org/?user_id=${user_id}&user_email=${user_email}`);
                const data = await response.json();
                console.log("Fetched organization data:", data);

                setOrgDetails(data);
            } catch (error) {
                console.error("Failed to fetch organization details:", error);
            }
        };

        if (user_id && user_email) {
            fetchOrgDetails();
        }
    }, [user_id, user_email]);

    const generatePDF = async () => {
        const element = document.getElementById('invoice-preview');
        if (!element) return;

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoices.pdf');
    };



    const handleClosePreview = () => {
        onClose();
    }
    console.log("First selected invoice details:", selectedInvoices[0]);

    return (
        <Dialog open={open} onClose={handleClosePreview} maxWidth="md" fullWidth>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogContent>
                {selectedInvoices.map((invoice) => (
                    console.log("Invoice keys:", Object.keys(invoice)),
                    <Box key={invoice.id} id="invoice-preview" sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, background: '#fafafa', mb: 4 }}>
                        {logoURL && (
                            <Box mb={2} display="flex" justifyContent="flex-end">
                                <img src={logoURL} alt="Company Logo" style={{ height: 60 }} />
                            </Box>
                        )}

                        {/* Header */}
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            {/* Client Address */}
                            <Box>
                                <Typography variant="h6">{invoice.c_name}</Typography>
                                <Typography variant="body2">{selectedClient?.c_email || 'No email'}</Typography>
                                <Typography variant="body2">{selectedClient?.c_phone || 'No phone'}</Typography>

                            </Box>

                            {/* Organization Address */}
                            <Box textAlign="right">
                                <Typography variant="h6">{orgDetails?.org_name}</Typography>
                                <Typography variant="body2">{orgDetails?.org_country || '[Country]'}</Typography>
                                <Typography variant="body2">{orgDetails?.org_email || '[Email]'}</Typography>
                                <Typography variant="body2">{orgDetails?.org_phone || '[Phone]'}</Typography>

                            </Box>

                        </Box>

                        {/* Bill To + Invoice Info */}
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Box >
                                <Typography variant="body2"><strong>Invoice No:</strong> {invoice.id}</Typography>
                                <Typography variant="body2"><strong>Date:</strong> {invoice.ti_created_at ? new Date(invoice.ti_created_at).toLocaleDateString('en-GB') : '-'}</Typography>
                                <Typography variant="body2"><strong>Status:</strong> {invoice.ti_status} </Typography>

                            </Box>
                            <Box>
                                <Typography variant="body2"><strong>Bill To:</strong> {invoice.c_name}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2"><strong>Please Make Payable To :</strong> {orgDetails?.org_name}</Typography>
                            </Box>


                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Invoice Table */}
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Invoice No</strong></TableCell>
                                    <TableCell><strong>Amount </strong></TableCell>
                                    <TableCell><strong>Balance</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{invoice.id}</TableCell>
                                    <TableCell>${invoice.ti_amount}</TableCell>
                                    <TableCell>${invoice.ti_balance}</TableCell>
                                    <TableCell>{invoice.ti_status}</TableCell>

                                </TableRow>
                            </TableBody>
                        </Table>

                        {/* Totals */}
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Box textAlign="right">
                                <Typography>Subtotal: ${invoice.ti_amount}</Typography>
                                <Typography variant="h6">Amount Due: ${parseFloat(invoice.ti_amount) + (invoice.ti_balance)}</Typography>
                            </Box>
                        </Box>

                        <Typography mt={2}><strong>Thank you for your business!</strong></Typography>
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClosePreview} color="primary">
                    Close
                </Button>
                <Button onClick={generatePDF} variant="contained" sx={{ backgroundColor: '#047A9A' }}>
                    Download PDF
                </Button>
            </DialogActions>

        </Dialog>
    );

}
export default InvoicesPreview;