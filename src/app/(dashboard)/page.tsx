'use client';

import { useInventoryStore } from '@/lib/store';
import { Package, Contact, Users, AlertTriangle, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { products, suppliers, customers, stockIns, stockOuts } = useInventoryStore();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockItems = products.filter(p => p.quantity < p.minStockLevel);
  const totalSuppliers = suppliers.length;
  const totalCustomers = customers.length;

  const recentStockIns = [...stockIns].sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime()).slice(0, 5);
  const recentStockOuts = [...stockOuts].sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()).slice(0, 5);

  return (
    <div className="flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid-cards mb-6">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Total Products</p>
            <h3 className="text-2xl font-bold">{totalProducts}</h3>
          </div>
        </div>
        
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Total Stock</p>
            <h3 className="text-2xl font-bold">{totalStock}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <Contact size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Total Suppliers</p>
            <h3 className="text-2xl font-bold">{totalSuppliers}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary font-medium">Total Customers</p>
            <h3 className="text-2xl font-bold">{totalCustomers}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Low Stock Alerts */}
        <div className="card flex-1">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-warning-color" size={20} style={{ color: 'var(--warning-color)' }} />
            <h3 className="text-lg font-bold">Low Stock Alerts</h3>
          </div>
          
          {lowStockItems.length === 0 ? (
            <p className="text-sm text-secondary">All products are sufficiently stocked.</p>
          ) : (
            <div className="flex-col gap-3">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-md" style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#92400e' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: '#b45309' }}>Min Level: {item.minStockLevel}</p>
                  </div>
                  <div className="badge badge-danger">
                    {item.quantity} in stock
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Recent Stock In */}
        <div className="card flex-1">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownToLine className="text-success-color" size={20} style={{ color: 'var(--success-color)' }} />
            <h3 className="text-lg font-bold">Recent Stock-In</h3>
          </div>
          
          {recentStockIns.length === 0 ? (
            <p className="text-sm text-secondary">No recent stock-in transactions.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStockIns.map(tx => {
                    const product = products.find(p => p.id === tx.productId);
                    return (
                      <tr key={tx.id}>
                        <td className="font-medium text-sm">{product?.name || 'Unknown'}</td>
                        <td className="text-sm">+{tx.quantityAdded}</td>
                        <td className="text-xs text-secondary">{format(new Date(tx.dateReceived), 'MMM dd, yyyy')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Stock Out */}
        <div className="card flex-1">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpFromLine className="text-danger-color" size={20} style={{ color: 'var(--danger-color)' }} />
            <h3 className="text-lg font-bold">Recent Stock-Out</h3>
          </div>
          
          {recentStockOuts.length === 0 ? (
            <p className="text-sm text-secondary">No recent stock-out transactions.</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStockOuts.map(tx => {
                    const product = products.find(p => p.id === tx.productId);
                    return (
                      <tr key={tx.id}>
                        <td className="font-medium text-sm">{product?.name || 'Unknown'}</td>
                        <td className="text-sm">-{tx.quantityRemoved}</td>
                        <td className="text-xs text-secondary">{format(new Date(tx.dateIssued), 'MMM dd, yyyy')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
