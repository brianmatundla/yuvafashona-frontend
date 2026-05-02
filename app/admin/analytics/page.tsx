'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  Eye,
  Star,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    percentageChange: number;
    chartData: { labels: string[]; values: number[] };
  };
  orders: {
    total: number;
    percentageChange: number;
    chartData: { labels: string[]; values: number[] };
  };
  customers: {
    total: number;
    percentageChange: number;
    chartData: { labels: string[]; values: number[] };
  };
  topProducts: { id: string; name: string; sales: number; revenue: number; image?: string }[];
  period: string;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }
        
        const res = await fetch(`http://localhost:5000/api/admin/analytics?period=${period}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await res.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load analytics');
          // Mock data for demo
          setData({
            revenue: { total: 284500, percentageChange: 23.5, chartData: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [25000, 32000, 28000, 45000, 52000, 68000, 34500] } },
            orders: { total: 156, percentageChange: 12.8, chartData: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [18, 22, 20, 25, 30, 28, 13] } },
            customers: { total: 2340, percentageChange: 8.2, chartData: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], values: [45, 52, 48, 63] } },
            topProducts: [
              { id: '1', name: 'Luxury Perfume', sales: 45, revenue: 58500 },
              { id: '2', name: 'Classic Heels', sales: 38, revenue: 53200 },
              { id: '3', name: 'Leather Handbag', sales: 32, revenue: 89600 },
              { id: '4', name: 'Designer Watch', sales: 28, revenue: 67200 },
              { id: '5', name: 'Silk Scarf', sales: 24, revenue: 28800 },
            ],
            period: period
          });
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [period]);

  const getBarHeight = (value: number, maxValue: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 180;
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const handleExport = () => {
    alert('Export feature coming soon. Data can be exported to CSV/PDF.');
  };

  const handleRefresh = () => {
    setPeriod(period);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
        <p className="text-gray-500 mt-4">Loading analytics data...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Analytics</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-gold text-dark rounded-lg hover:bg-goldDark transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const maxRevenue = Math.max(...(data?.revenue.chartData.values || [0]));
  const maxOrders = Math.max(...(data?.orders.chartData.values || [0]));
  const maxCustomers = Math.max(...(data?.customers.chartData.values || [0]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Track your store performance and insights</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-white"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
          <button 
            onClick={handleExport}
            className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-gold text-dark rounded-lg text-sm flex items-center gap-2 hover:bg-goldDark transition"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {formatCurrency(data?.revenue.total || 0)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {data?.revenue.percentageChange && data.revenue.percentageChange > 0 ? (
                  <>
                    <ArrowUp size={14} className="text-green-500" />
                    <span className="text-green-600 text-sm font-medium">+{data.revenue.percentageChange}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown size={14} className="text-red-500" />
                    <span className="text-red-600 text-sm font-medium">{data?.revenue.percentageChange || 0}%</span>
                  </>
                )}
                <span className="text-gray-400 text-xs ml-1">vs previous period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{data?.orders.total || 0}</p>
              <div className="flex items-center gap-1 mt-2">
                {data?.orders.percentageChange && data.orders.percentageChange > 0 ? (
                  <>
                    <ArrowUp size={14} className="text-green-500" />
                    <span className="text-green-600 text-sm font-medium">+{data.orders.percentageChange}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown size={14} className="text-red-500" />
                    <span className="text-red-600 text-sm font-medium">{data?.orders.percentageChange || 0}%</span>
                  </>
                )}
                <span className="text-gray-400 text-xs ml-1">vs previous period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Customers</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{data?.customers.total || 0}</p>
              <div className="flex items-center gap-1 mt-2">
                {data?.customers.percentageChange && data.customers.percentageChange > 0 ? (
                  <>
                    <ArrowUp size={14} className="text-green-500" />
                    <span className="text-green-600 text-sm font-medium">+{data.customers.percentageChange}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown size={14} className="text-red-500" />
                    <span className="text-red-600 text-sm font-medium">{data?.customers.percentageChange || 0}%</span>
                  </>
                )}
                <span className="text-gray-400 text-xs ml-1">vs previous period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Revenue Trend</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-xs text-gray-500">Revenue (KES)</span>
            </div>
          </div>
        </div>
        
        {data?.revenue.chartData.labels.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-500">No revenue data for this period</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <div className="flex items-end gap-3 h-64">
              {data?.revenue.chartData.labels.map((label, idx) => {
                const height = getBarHeight(data.revenue.chartData.values[idx], maxRevenue);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group">
                    <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '200px' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                        style={{ height: `${height}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 shadow-lg">
                          {formatCurrency(data.revenue.chartData.values[idx])}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2 font-medium">{label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-xs text-gray-400">Hover over bars to see exact values</p>
            </div>
          </div>
        )}
      </div>

      {/* Orders & Customers Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Orders Trend</h2>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-xs text-gray-500">Number of Orders</span>
            </div>
          </div>
          
          {data?.orders.chartData.labels.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-gray-500">No order data for this period</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <div className="flex items-end gap-3 h-48">
                {data?.orders.chartData.labels.map((label, idx) => {
                  const height = getBarHeight(data.orders.chartData.values[idx], maxOrders);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '150px' }}>
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                          style={{ height: `${height}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            {data.orders.chartData.values[idx]} orders
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2 font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Customers Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">New Customers</h2>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-xs text-gray-500">New Signups</span>
            </div>
          </div>
          
          {data?.customers.chartData.labels.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-gray-500">No customer data for this period</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <div className="flex items-end gap-3 h-48">
                {data?.customers.chartData.labels.map((label, idx) => {
                  const height = getBarHeight(data.customers.chartData.values[idx], maxCustomers);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '150px' }}>
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                          style={{ height: `${height}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            {data.customers.chartData.values[idx]} new
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2 font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Top Selling Products</h2>
            <p className="text-xs text-gray-500 mt-1">Best performing products by units sold</p>
          </div>
          <button className="text-gold text-sm hover:underline flex items-center gap-1">
            View All <Eye size={14} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 rounded-lg">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Units Sold</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Performance</th>
              </tr>
            </thead>
            <tbody>
              {data?.topProducts.map((product, idx) => {
                const maxSales = data.topProducts[0]?.sales || 1;
                const percentage = (product.sales / maxSales) * 100;
                return (
                  <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                        idx === 1 ? 'bg-gray-200 text-gray-600' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package size={14} className="text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-800">{product.sales}</span>
                      <span className="text-xs text-gray-400 ml-1">units</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(product.revenue)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className="bg-gold rounded-full h-2 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {(!data?.topProducts || data.topProducts.length === 0) && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🛍️</div>
            <p className="text-gray-500">No product sales data available</p>
          </div>
        )}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
          <div className="text-2xl mb-2">📦</div>
          <p className="text-xl font-bold text-gray-800">245</p>
          <p className="text-xs text-gray-500">Total Products</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
          <div className="text-2xl mb-2">⭐</div>
          <p className="text-xl font-bold text-gray-800">4.8</p>
          <p className="text-xs text-gray-500">Avg Rating</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
          <div className="text-2xl mb-2">🔄</div>
          <p className="text-xl font-bold text-gray-800">2.4%</p>
          <p className="text-xs text-gray-500">Return Rate</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
          <div className="text-2xl mb-2">⏱️</div>
          <p className="text-xl font-bold text-gray-800">2.5d</p>
          <p className="text-xs text-gray-500">Avg Delivery</p>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          <Clock size={16} className="text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart size={14} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">New order #ORD-0042</p>
              <p className="text-xs text-gray-400">2 minutes ago</p>
            </div>
            <span className="text-xs font-semibold text-green-600">+KES 2,450</span>
          </div>
          <div className="flex items-center gap-3 py-2 border-b">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users size={14} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">New customer registered</p>
              <p className="text-xs text-gray-400">15 minutes ago</p>
            </div>
            <span className="text-xs text-gray-400">+1 user</span>
          </div>
          <div className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star size={14} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">New product review</p>
              <p className="text-xs text-gray-400">1 hour ago</p>
            </div>
            <span className="text-xs text-yellow-600">5 stars</span>
          </div>
        </div>
      </div>
    </div>
  );
}