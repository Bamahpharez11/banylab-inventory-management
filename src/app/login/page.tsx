'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInventoryStore } from '@/lib/store';
import { FlaskConical } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useInventoryStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication
    if (username === 'admin' && password === 'admin') {
      login({ id: '1', username: 'Admin User', role: 'Admin' });
      router.push('/');
    } else if (username === 'staff' && password === 'staff') {
      login({ id: '2', username: 'Staff User', role: 'Staff' });
      router.push('/');
    } else {
      setError('Invalid username or password (try admin/admin or staff/staff)');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="card w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
            <FlaskConical size={32} />
          </div>
          <h1 className="text-2xl font-bold">Banylab IMS</h1>
          <p className="text-secondary text-sm text-center mt-2">Login to manage inventory</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              className="input" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group mb-2">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="input" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full py-2.5 text-base">
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-secondary">
          <p>Demo Credentials:</p>
          <p>Admin: admin / admin</p>
          <p>Staff: staff / staff</p>
        </div>
      </div>
    </div>
  );
}
