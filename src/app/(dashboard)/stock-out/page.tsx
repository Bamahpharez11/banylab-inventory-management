'use client';
import { useState } from 'react';
import { useInventoryStore } from '@/lib/store';
import Modal from '@/components/Modal';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function StockOutPage() {
  const { stockOuts, products, customers, recordStockOut } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    productId: '',
    quantityRemoved: 0,
    customerId: ''
  });

  const filteredStockOuts = stockOuts.filter(tx => {
    const product = products.find(p => p.id === tx.productId);
    return product?.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const product = products.find(p => p.id === formData.productId);
    if (!product) return;

    if (formData.quantityRemoved > product.quantity) {
      setError(`Cannot remove ${formData.quantityRemoved}. Only ${product.quantity} in stock.`);
      return;
    }

    recordStockOut(formData);
    setIsModalOpen(false);
    setFormData({ productId: '', quantityRemoved: 0, customerId: '' });
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" style={{ transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="input pl-10" 
            style={{ paddingLeft: '2.5rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-danger gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Record Stock-Out
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date Issued</th>
                <th>Product Name</th>
                <th>Quantity Issued</th>
                <th>Customer</th>
              </tr>
            </thead>
            <tbody>
              {filteredStockOuts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-secondary">No stock-out records found.</td>
                </tr>
              ) : filteredStockOuts.sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()).map(tx => {
                const product = products.find(p => p.id === tx.productId);
                const customer = customers.find(c => c.id === tx.customerId);
                
                return (
                  <tr key={tx.id}>
                    <td>{format(new Date(tx.dateIssued), 'MMM dd, yyyy HH:mm')}</td>
                    <td className="font-medium">{product?.name || 'Unknown'}</td>
                    <td className="text-danger-color font-semibold" style={{ color: 'var(--danger-color)' }}>
                      -{tx.quantityRemoved}
                    </td>
                    <td>{customer?.name || 'Unknown'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setError('');
        }} 
        title="Record Stock-Out / Issue Product"
      >
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Product</label>
            <select 
              className="input" 
              required
              value={formData.productId}
              onChange={e => setFormData({...formData, productId: e.target.value})}
            >
              <option value="" disabled>Select a product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (In stock: {p.quantity})</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Quantity Issued</label>
            <input 
              type="number" 
              className="input" 
              required
              min="1"
              value={formData.quantityRemoved}
              onChange={e => setFormData({...formData, quantityRemoved: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Customer</label>
            <select 
              className="input" 
              required
              value={formData.customerId}
              onChange={e => setFormData({...formData, customerId: e.target.value})}
            >
              <option value="" disabled>Select a customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="btn btn-outline" onClick={() => {
              setIsModalOpen(false);
              setError('');
            }}>Cancel</button>
            <button type="submit" className="btn btn-danger">Issue Stock</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
