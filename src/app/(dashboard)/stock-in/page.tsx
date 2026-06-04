'use client';
import { useState } from 'react';
import { useInventoryStore } from '@/lib/store';
import Modal from '@/components/Modal';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function StockInPage() {
  const { stockIns, products, suppliers, recordStockIn } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    productId: '',
    quantityAdded: 0,
    supplierId: ''
  });

  const filteredStockIns = stockIns.filter(tx => {
    const product = products.find(p => p.id === tx.productId);
    return product?.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordStockIn(formData);
    setIsModalOpen(false);
    setFormData({ productId: '', quantityAdded: 0, supplierId: '' });
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
        <button className="btn btn-primary gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Record Stock-In
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date Received</th>
                <th>Product Name</th>
                <th>Quantity Added</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {filteredStockIns.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-secondary">No stock-in records found.</td>
                </tr>
              ) : filteredStockIns.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime()).map(tx => {
                const product = products.find(p => p.id === tx.productId);
                const supplier = suppliers.find(s => s.id === tx.supplierId);
                
                return (
                  <tr key={tx.id}>
                    <td>{format(new Date(tx.dateReceived), 'MMM dd, yyyy HH:mm')}</td>
                    <td className="font-medium">{product?.name || 'Unknown'}</td>
                    <td className="text-success-color font-semibold" style={{ color: 'var(--success-color)' }}>
                      +{tx.quantityAdded}
                    </td>
                    <td>{supplier?.name || 'Unknown'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Record New Stock-In"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Product</label>
            <select 
              className="input" 
              required
              value={formData.productId}
              onChange={e => {
                const pId = e.target.value;
                const prod = products.find(p => p.id === pId);
                setFormData({...formData, productId: pId, supplierId: prod?.supplierId || formData.supplierId});
              }}
            >
              <option value="" disabled>Select a product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Quantity Added</label>
            <input 
              type="number" 
              className="input" 
              required
              min="1"
              value={formData.quantityAdded}
              onChange={e => setFormData({...formData, quantityAdded: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Supplier</label>
            <select 
              className="input" 
              required
              value={formData.supplierId}
              onChange={e => setFormData({...formData, supplierId: e.target.value})}
            >
              <option value="" disabled>Select a supplier</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Record Stock</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
