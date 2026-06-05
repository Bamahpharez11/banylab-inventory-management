'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Users, 
  Contact, 
  FileText,
  LogOut,
  FlaskConical
} from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useInventoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Stock-In', href: '/stock-in', icon: ArrowDownToLine },
    { name: 'Stock-Out', href: '/stock-out', icon: ArrowUpFromLine },
    { name: 'Suppliers', href: '/suppliers', icon: Contact },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <FlaskConical size={24} />
        Banylab IMS
      </div>
      <nav className="sidebar-nav">
        <div className="flex-col gap-2 p-4">
          <div className="text-sm font-semibold text-secondary mb-2">MANAGEMENT</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold" style={{ backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '50%' }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-semibold text-sm">{user?.username || 'Guest'}</div>
            <div className="text-xs text-secondary">{user?.role || 'Role'}</div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="btn btn-outline w-full justify-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
