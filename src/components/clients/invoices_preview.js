import { Dialog, DialogTitle, DialogContent, DialogActions,
     Button, Typography, Box, TableHead, TableBody, TableRow, TableCell, Divider, Table } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuthContext } from '../onboarding/authProvider';


const InvoicesPreview = ({ selectedInvoices, selectedClient, onClose, open }) => {
    const {org_currency, org_logo, org_country, org_phone, org_name, org_email } = useAuthContext();
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
    };
    const today = new Date().toLocaleDateString();
    console.log("First selected invoice details:", selectedInvoices[0]);

    // Calculate totals
    const subtotal = selectedInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.ti_amount || 0), 0);
    const totalBalance = selectedInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.ti_balance || 0), 0);

    return (
        <Dialog open={open} onClose={handleClosePreview} maxWidth="md" fullWidth>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogContent>
                <Box id="invoice-preview" sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, background: '#fafafa', mb: 4 }}>
                    {org_logo && (
                        <Box mb={2} display="flex" justifyContent="flex-end">
                            <img src={org_logo} alt="Company Logo" style={{ height: 60 }} />
                        </Box>
                    )}

                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        {/* Client Address */}
                        <Box>
                            <Typography variant="h6">{selectedClient.c_name}</Typography>
                            <Typography variant="body2">{selectedClient?.c_email || 'No email'}</Typography>
                            <Typography variant="body2">{selectedClient?.c_phone || 'No phone'}</Typography>
                        </Box>

                        {/* Organization Address */}
                        <Box textAlign="right">
                            <Typography variant="h6">{org_name}</Typography>
                            <Typography variant="body2">{org_country || '[Country]'}</Typography>
                            <Typography variant="body2">{org_email || '[Email]'}</Typography>
                            <Typography variant="body2">{org_phone || '[Phone]'}</Typography>
                        </Box>
                    </Box>

                    {/* Bill To + Invoice Info */}
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Box>
                            <Typography variant="body2"><strong>Date:</strong> {today}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2"><strong>Bill To:</strong> {selectedClient.c_name}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2"><strong>Please Make Payable To :</strong> {org_name}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Invoice Table */}
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Invoice No</strong></TableCell>
                                <TableCell><strong>Description</strong></TableCell>
                                 <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Total</strong></TableCell>
                                <TableCell><strong>Paid</strong></TableCell>
                                <TableCell><strong>Due Balance</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.id}</TableCell>
                                    <TableCell>{invoice.ti_description}</TableCell>
                                     <TableCell>{invoice.ti_status}</TableCell>
                                    <TableCell>
                                    {invoice.ti_amount ? Number(invoice.ti_amount).toLocaleString(org_currency, { style: 'currency', currency: org_currency }) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {parseFloat( invoice.ti_balance || 0).toLocaleString(org_currency, { style: 'currency', currency: org_currency })}
                                    </TableCell>
                                    <TableCell>
                                        {org_currency} {}
                                        {parseFloat(invoice.ti_balance || 0).toLocaleString(org_currency, { style: 'currency', currency: org_currency })}
                                    </TableCell>
                                   
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Totals */}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box textAlign="right">
                            <Typography>Subtotal: {(subtotal).toLocaleString(org_currency, { style: 'currency', currency: org_currency })}</Typography>
                            <Typography variant="h6">Amount Due: {(totalBalance).toLocaleString(org_currency, { style: 'currency', currency: org_currency })}</Typography>
                        </Box>
                    </Box>

                    <Typography mt={2}><strong>Thank you for your business!</strong></Typography>
                </Box>
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