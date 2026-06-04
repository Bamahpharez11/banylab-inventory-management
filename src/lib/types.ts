export type Role = 'Admin' | 'Staff';

export interface User {
  id: string;
  username: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  supplierId: string;
  minStockLevel: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface StockIn {
  id: string;
  productId: string;
  quantityAdded: number;
  supplierId: string;
  dateReceived: string; // ISO String
}

export interface StockOut {
  id: string;
  productId: string;
  quantityRemoved: number;
  customerId: string;
  dateIssued: string; // ISO String
}
