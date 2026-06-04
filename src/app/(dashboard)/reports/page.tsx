'use client';
import { useState } from 'react';
import { useInventoryStore } from '@/lib/store';
import { FileText, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ReportType = 'products' | 'stock-in' | 'stock-out' | 'suppliers' | 'customers' | 'low-stock';

export default function ReportsPage() {
  const { products, stockIns, stockOuts, suppliers, customers } = useInventoryStore();
  const [selectedReport, setSelectedReport] = useState<ReportType>('products');

  const getReportData = () => {
    switch (selectedReport) {
      case 'products':
        return {
          title: 'Product Inventory Report',
          columns: ['ID', 'Name', 'Category', 'Quantity', 'Unit Price ($)', 'Total Value ($)'],
          rows: products.map(p => [
            p.id.slice(0, 8), p.name, p.category, p.quantity.toString(), p.unitPrice.toFixed(2), (p.quantity * p.unitPrice).toFixed(2)
          ])
        };
      case 'low-stock':
        const low = products.filter(p => p.quantity < p.minStockLevel);
        return {
          title: 'Low Stock Alert Report',
          columns: ['ID', 'Name', 'Current Qty', 'Min Level', 'Deficit'],
          rows: low.map(p => [
            p.id.slice(0, 8), p.name, p.quantity.toString(), p.minStockLevel.toString(), (p.minStockLevel - p.quantity).toString()
          ])
        };
      case 'stock-in':
        return {
          title: 'Stock-In Transaction Report',
          columns: ['Date', 'Product', 'Quantity Added', 'Supplier'],
          rows: stockIns.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime()).map(tx => {
            const product = products.find(p => p.id === tx.productId);
            const supplier = suppliers.find(s => s.id === tx.supplierId);
            return [format(new Date(tx.dateReceived), 'MMM dd, yyyy HH:mm'), product?.name || 'Unknown', tx.quantityAdded.toString(), supplier?.name || 'Unknown'];
          })
        };
      case 'stock-out':
        return {
          title: 'Stock-Out Transaction Report',
          columns: ['Date', 'Product', 'Quantity Issued', 'Customer'],
          rows: stockOuts.sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()).map(tx => {
            const product = products.find(p => p.id === tx.productId);
            const customer = customers.find(c => c.id === tx.customerId);
            return [format(new Date(tx.dateIssued), 'MMM dd, yyyy HH:mm'), product?.name || 'Unknown', tx.quantityRemoved.toString(), customer?.name || 'Unknown'];
          })
        };
      case 'suppliers':
        return {
          title: 'Suppliers Directory Report',
          columns: ['Name', 'Phone', 'Email', 'Address'],
          rows: suppliers.map(s => [s.name, s.phone, s.email, s.address])
        };
      case 'customers':
        return {
          title: 'Customers Directory Report',
          columns: ['Name', 'Phone', 'Email', 'Address'],
          rows: customers.map(c => [c.name, c.phone, c.email, c.address])
        };
      default:
        return { title: '', columns: [], rows: [] };
    }
  };

  const currentReport = getReportData();

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Banylab IMS - ${currentReport.title}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 22);
    
    autoTable(doc, {
      startY: 30,
      head: [currentReport.columns],
      body: currentReport.rows,
    });
    
    doc.save(`Banylab_${selectedReport}_report.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-col gap-6">
      <div className="card mb-6 flex flex-wrap gap-4 items-center justify-between hide-on-print">
        <div className="flex gap-4 items-center">
          <label className="font-semibold">Select Report Type:</label>
          <select 
            className="input w-auto min-w-[200px]"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value as ReportType)}
          >
            <option value="products">Product Inventory</option>
            <option value="low-stock">Low Stock Alerts</option>
            <option value="stock-in">Stock-In History</option>
            <option value="stock-out">Stock-Out History</option>
            <option value="suppliers">Suppliers Directory</option>
            <option value="customers">Customers Directory</option>
          </select>
        </div>
        
        <div className="flex gap-3">
          <button className="btn btn-outline gap-2" onClick={handlePrint}>
            <Printer size={16} /> Print
          </button>
          <button className="btn btn-primary gap-2" onClick={handleExportPDF}>
            <Download size={16} /> Export to PDF
          </button>
        </div>
      </div>

      <div className="card report-container">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <FileText size={40} className="text-primary-color" style={{ color: 'var(--primary-color)' }} />
          </div>
          <h2 className="text-2xl font-bold">{currentReport.title}</h2>
          <p className="text-secondary text-sm">Generated on {format(new Date(), 'MMMM dd, yyyy HH:mm')}</p>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                {currentReport.columns.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentReport.rows.length === 0 ? (
                <tr>
                  <td colSpan={currentReport.columns.length} className="text-center py-6 text-secondary">
                    No data available for this report.
                  </td>
                </tr>
              ) : (
                currentReport.rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>{cell}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .sidebar, .header, .hide-on-print {
            display: none !important;
          }
          .dashboard-layout, .main-content, .content-area {
            display: block !important;
            padding: 0 !important;
            background: white !important;
          }
          .card {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
