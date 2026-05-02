'use client';

import { useEffect, useState } from 'react';
import { Users, Crown, User, Calendar, Mail, Phone } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('http://localhost:5000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.data);
        setLoading(false);
      });
  }, []);

  const toggleAdmin = async (id: string, isAdmin: boolean) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ is_admin: !isAdmin })
    });
    setUsers(users.map(u => u.id === id ? { ...u, is_admin: !isAdmin } : u));
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.is_admin).length,
    customers: users.filter(u => !u.is_admin).length,
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <Users size={24} className="text-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow-sm text-center">
          <Crown size={24} className="text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
          <p className="text-sm text-purple-600">Administrators</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm text-center">
          <User size={24} className="text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">{stats.customers}</p>
          <p className="text-sm text-blue-600">Customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={14} className="text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{user.full_name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{user.phone || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${user.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.is_admin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {!user.is_admin && (
                      <button onClick={() => toggleAdmin(user.id, user.is_admin)} className="px-3 py-1 bg-gold/10 text-gold rounded-lg text-xs font-medium hover:bg-gold/20 transition">
                        Make Admin
                      </button>
                    )}
                    {user.is_admin && user.email !== 'admin@yuvafashona.com' && (
                      <button onClick={() => toggleAdmin(user.id, user.is_admin)} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                        Remove Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}