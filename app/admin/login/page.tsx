'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      localStorage.setItem('adminToken', data.data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-4" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-6" required />
          <button type="submit" className="w-full bg-dark text-white py-2 rounded-lg hover:bg-gold">Login</button>
        </form>
      </div>
    </div>
  );
}