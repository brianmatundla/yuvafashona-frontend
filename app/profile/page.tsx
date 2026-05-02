'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      const [profileRes, ordersRes] = await Promise.all([
        fetch('http://localhost:5000/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/user/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const profileData = await profileRes.json();
      const ordersData = await ordersRes.json();

      if (profileData.success) {
        setProfile(profileData.data);
        setFormData({
          full_name: profileData.data.full_name || '',
          phone: profileData.data.phone || '',
          address: profileData.data.address || '',
          city: profileData.data.city || ''
        });
      }
      if (ordersData.success) setOrders(ordersData.data);
      setLoading(false);
    };

    fetchData();
  }, [user, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      setProfile(data.data);
      setEditing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Back Link */}
        <div className="mb-8">
          <Link href="/" className="text-gold hover:underline">← Back to Home</Link>
          <h1 className="text-3xl font-bold mt-4">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👤</span>
                </div>
                <h2 className="text-xl font-bold">{profile?.full_name}</h2>
                <p className="text-gray-500 text-sm">{profile?.email}</p>
                <p className="text-gray-400 text-xs mt-1">Member since {new Date(profile?.created_at || '').getFullYear()}</p>
              </div>
              
              {!editing ? (
                <>
                  <div className="space-y-3 text-sm border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span>{profile?.phone || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address:</span>
                      <span className="text-right">{profile?.address || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">City:</span>
                      <span>{profile?.city || 'Not set'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full mt-6 bg-dark text-white py-2 rounded-lg hover:bg-gold transition"
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-gold text-dark py-2 rounded-lg font-semibold hover:bg-goldDark">Save</button>
                    <button type="button" onClick={() => setEditing(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">My Orders</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders yet.</p>
                  <Link href="/shop" className="inline-block mt-4 text-gold hover:underline">Start Shopping →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <p className="font-semibold text-dark">Order #{order.order_number?.slice(0, 8) || order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gold">{formatPrice(order.total)}</p>
                          <p className="text-xs text-gray-500">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}