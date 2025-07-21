import React from "react";  
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoicesPreview = ({ selectedInvoices, onClose, open }) => {
    console.log("Selected Invoices:", selectedInvoices);

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
    return (
        <Dialog open={open} onClose={handleClosePreview} maxWidth="md" fullWidth>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogContent>
                {selectedInvoices.map((invoice) => (
                    <div key={invoice.id} id="invoice-preview" style={{ marginBottom: '20px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fafafa' }}>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#047A9A' }}>Invoice No: {invoice.id}</h2>
                        <p><strong>Amount:</strong> {invoice.ti_amount}</p>
                        <p><strong>Balance:</strong> {invoice.ti_balance || invoice.ti_amount}</p>
                        <p><strong>Status:</strong> {invoice.ti_status}</p>
                        <p><strong>Date:</strong> {invoice.ti_created_at ? new Date(invoice.ti_created_at).toLocaleDateString('en-GB') : '-'}</p>
                    </div>
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