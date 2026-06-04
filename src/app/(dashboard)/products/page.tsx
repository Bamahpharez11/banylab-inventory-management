'use client';
import { useState } from 'react';
import { useInventoryStore } from '@/lib/store';
import { Product } from '@/lib/types';
import Modal from '@/components/Modal';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function ProductsPage() {
  const { products, suppliers, addProduct, updateProduct, deleteProduct } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    supplierId: '',
    minStockLevel: 10
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        supplierId: product.supplierId,
        minStockLevel: product.minStockLevel
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: '', quantity: 0, unitPrice: 0, supplierId: suppliers[0]?.id || '', minStockLevel: 10 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" style={{ transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="input pl-10" 
            style={{ paddingLeft: '2.5rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary gap-2" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Unit Price</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-secondary">No products found.</td>
                </tr>
              ) : filteredProducts.map(product => {
                const supplier = suppliers.find(s => s.id === product.supplierId);
                const isLowStock = product.quantity < product.minStockLevel;
                
                return (
                  <tr key={product.id}>
                    <td className="font-medium">{product.name}</td>
                    <td>{product.category}</td>
                    <td>{supplier?.name || 'Unknown'}</td>
                    <td>${product.unitPrice.toFixed(2)}</td>
                    <td className="font-semibold">{product.quantity}</td>
                    <td>
                      <span className={`badge ${isLowStock ? 'badge-danger' : 'badge-success'}`}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          style={{ color: '#2563eb', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                          onClick={() => handleOpenModal(product)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          style={{ color: '#dc2626', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this product?')) {
                              deleteProduct(product.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
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
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input 
              type="text" 
              className="input" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input 
              type="text" 
              className="input" 
              required
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            />
          </div>
          <div className="flex gap-4">
            <div className="form-group flex-1">
              <label className="form-label">Quantity</label>
              <input 
                type="number" 
                className="input" 
                required
                min="0"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Min Stock Level</label>
              <input 
                type="number" 
                className="input" 
                required
                min="0"
                value={formData.minStockLevel}
                onChange={e => setFormData({...formData, minStockLevel: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Unit Price ($)</label>
              <input 
                type="number" 
                className="input" 
                required
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={e => setFormData({...formData, unitPrice: parseFloat(e.target.value) || 0})}
              />
            </div>
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
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
