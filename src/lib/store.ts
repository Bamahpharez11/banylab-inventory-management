import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Supplier, Customer, StockIn, StockOut, User } from './types';


// Initial mock data
const initialProducts: Product[] = [
  { id: 'p1', name: 'Microscope Slides', category: 'Consumables', quantity: 50, unitPrice: 12.5, supplierId: 's1', minStockLevel: 20 },
  { id: 'p2', name: 'Petri Dishes', category: 'Consumables', quantity: 15, unitPrice: 5.0, supplierId: 's1', minStockLevel: 50 }, // Low stock
  { id: 'p3', name: 'Beaker 250ml', category: 'Glassware', quantity: 120, unitPrice: 8.0, supplierId: 's2', minStockLevel: 30 },
];

const initialSuppliers: Supplier[] = [
  { id: 's1', name: 'LabCorp Supplies', phone: '123-456-7890', email: 'sales@labcorp.com', address: '123 Science Way' },
  { id: 's2', name: 'GlassCo Inc.', phone: '987-654-3210', email: 'orders@glassco.com', address: '456 Industrial Blvd' },
];

const initialCustomers: Customer[] = [
  { id: 'c1', name: 'City Hospital', phone: '555-123-4567', email: 'procurement@cityhospital.com', address: '789 Medical Center Dr' },
];

interface InventoryState {
  user: User | null;
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  stockIns: StockIn[];
  stockOuts: StockOut[];
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  recordStockIn: (stockIn: Omit<StockIn, 'id' | 'dateReceived'>) => void;
  recordStockOut: (stockOut: Omit<StockOut, 'id' | 'dateIssued'>) => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      user: null,
      products: initialProducts,
      suppliers: initialSuppliers,
      customers: initialCustomers,
      stockIns: [],
      stockOuts: [],
      
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: crypto.randomUUID() }]
      })),
      
      updateProduct: (id, updated) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updated } : p)
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      
      addSupplier: (supplier) => set((state) => ({
        suppliers: [...state.suppliers, { ...supplier, id: crypto.randomUUID() }]
      })),
      
      updateSupplier: (id, updated) => set((state) => ({
        suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updated } : s)
      })),
      
      deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter(s => s.id !== id)
      })),
      
      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, { ...customer, id: crypto.randomUUID() }]
      })),
      
      updateCustomer: (id, updated) => set((state) => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...updated } : c)
      })),
      
      deleteCustomer: (id) => set((state) => ({
        customers: state.customers.filter(c => c.id !== id)
      })),
      
      recordStockIn: (stockIn) => set((state) => {
        // Find product and update quantity
        const products = state.products.map(p => {
          if (p.id === stockIn.productId) {
            return { ...p, quantity: p.quantity + stockIn.quantityAdded };
          }
          return p;
        });
        
        return {
          products,
          stockIns: [
            ...state.stockIns, 
            { ...stockIn, id: crypto.randomUUID(), dateReceived: new Date().toISOString() }
          ]
        };
      }),
      
      recordStockOut: (stockOut) => set((state) => {
        // Find product and update quantity
        const products = state.products.map(p => {
          if (p.id === stockOut.productId) {
            return { ...p, quantity: p.quantity - stockOut.quantityRemoved };
          }
          return p;
        });
        
        return {
          products,
          stockOuts: [
            ...state.stockOuts,
            { ...stockOut, id: crypto.randomUUID(), dateIssued: new Date().toISOString() }
          ]
        };
      }),
    }),
    {
      name: 'banylab-inventory-storage',
    }
  )
);
