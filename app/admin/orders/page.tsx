'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Eye, Truck, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: string;
  order_number: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  user_id: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('http://localhost:5000/api/admin/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.data);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      case 'shipped': return <Truck size={16} className="text-blue-500" />;
      case 'processing': return <Clock size={16} className="text-yellow-500" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (search && !order.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and track customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
          <p className="text-sm text-blue-600">Processing</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          <p className="text-sm text-green-600">Delivered</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-sm text-red-600">Cancelled</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'all' ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Pending</button>
            <button onClick={() => setFilter('processing')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'processing' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Processing</button>
            <button onClick={() => setFilter('shipped')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'shipped' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Shipped</button>
            <button onClick={() => setFilter('delivered')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Delivered</button>
            <button onClick={() => setFilter('cancelled')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Cancelled</button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search order ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="px-2 py-1 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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