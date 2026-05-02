'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, Tag, TrendingUp, Eye, Clock, DollarSign, ArrowUp, ArrowDown, Zap, Star, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import RevenueChart from './components/RevenueChart';

interface DashboardData {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalCategories: number;
    totalRevenue: number;
  };
  recentOrders: any[];
  recentProducts: any[];
  lowStockProducts: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('http://localhost:5000/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setData(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statsCards = [
    { title: 'Total Revenue', value: `KES ${data?.stats.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, gradient: 'from-emerald-500 to-teal-600', change: '+23%', changeType: 'up' },
    { title: 'Total Orders', value: data?.stats.totalOrders || 0, icon: ShoppingCart, gradient: 'from-orange-500 to-red-600', change: '+8%', changeType: 'up' },
    { title: 'Products', value: data?.stats.totalProducts || 0, icon: Package, gradient: 'from-blue-500 to-indigo-600', change: '+12%', changeType: 'up' },
    { title: 'Customers', value: data?.stats.totalUsers || 0, icon: Users, gradient: 'from-purple-500 to-pink-600', change: '+15%', changeType: 'up' },
  ];

  const quickActions = [
    { name: 'Add Product', icon: Package, color: 'bg-emerald-500', href: '/admin/products/new', description: 'Add new product to store' },
    { name: 'View Orders', icon: ShoppingCart, color: 'bg-orange-500', href: '/admin/orders', description: 'Manage customer orders' },
    { name: 'Manage Users', icon: Users, color: 'bg-purple-500', href: '/admin/users', description: 'View all customers' },
    { name: 'Categories', icon: Tag, color: 'bg-pink-500', href: '/admin/categories', description: 'Organize products' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's your store performance overview.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.changeType === 'up' ? <ArrowUp size={12} className="text-green-500" /> : <ArrowDown size={12} className="text-red-500" />}
                  <span className="text-xs font-medium text-green-600">{stat.change}</span>
                  <span className="text-xs text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="text-white" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-gold" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition`}>
                  <action.icon className="text-white" size={20} />
                </div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">{action.name}</p>
                <p className="text-xs text-gray-400 mt-1">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sales Chart with RevenueChart Component */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Sales Overview</h2>
          </div>
          <RevenueChart />
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Star size={18} className="text-yellow-500" /> Top Products
          </h2>
          <div className="space-y-4">
            {data?.recentProducts?.slice(0, 4).map((product: any, idx: number) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">#{idx + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-400">KES {product.price}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gold">{product.sold_count || 0} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-blue-500" /> Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-gold text-sm hover:underline">View All →</Link>
          </div>
          <div className="space-y-3">
            {data?.recentOrders?.map((order: any) => (
              <div key={order.id} className="flex justify-between items-center py-3 border-b dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Truck size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800 dark:text-white">#{order.id?.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">KES {order.total}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {order.status || 'pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Package size={18} className="text-red-500" /> Low Stock Alert
            </h2>
          </div>
          <div className="space-y-3">
            {data?.lowStockProducts?.map((product: any) => (
              <div key={product.id} className="flex justify-between items-center py-3 border-b dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{product.name}</p>
                  <p className="text-xs text-gray-400">Stock: {product.stock_quantity} units</p>
                </div>
                <button className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                  Restock
                </button>
              </div>
            ))}
            {(!data?.lowStockProducts || data.lowStockProducts.length === 0) && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package size={20} className="text-green-600" />
                </div>
                <p className="text-green-600 font-medium">All products have sufficient stock</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <CreditCard size={20} className="text-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800 dark:text-white">COD</p>
          <p className="text-xs text-gray-400">Payment Method</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <Truck size={20} className="text-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800 dark:text-white">Free</p>
          <p className="text-xs text-gray-400">Shipping</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <Star size={20} className="text-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800 dark:text-white">30 Days</p>
          <p className="text-xs text-gray-400">Returns Policy</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <TrendingUp size={20} className="text-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800 dark:text-white">4.8/5</p>
          <p className="text-xs text-gray-400">Customer Rating</p>
        </div>
      </div>
    </div>
  );
}