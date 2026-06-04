'use client';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';

export default function Header() {
  const pathname = usePathname();
  const { products } = useInventoryStore();

  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/products': return 'Product Management';
      case '/stock-in': return 'Stock-In Management';
      case '/stock-out': return 'Stock-Out Management';
      case '/suppliers': return 'Supplier Management';
      case '/customers': return 'Customer Management';
      case '/reports': return 'Reports Module';
      default: return 'Banylab IMS';
    }
  };

  const lowStockCount = products.filter(p => p.quantity < p.minStockLevel).length;

  return (
    <header className="header">
      <h1 className="text-xl">{getPageTitle()}</h1>
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-secondary" />
          {lowStockCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: 'var(--danger-color)', fontSize: '0.65rem', fontWeight: 'bold' }}
            >
              {lowStockCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
