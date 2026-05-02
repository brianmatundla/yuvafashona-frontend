'use client';

import { useEffect, useState } from 'react';

interface ChartData {
  labels: string[];
  values: number[];
  totalRevenue: number;
  avgOrderValue: number;
  periods: number;
}

export default function RevenueChart() {
  const [data, setData] = useState<ChartData | null>(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }
        
        const res = await fetch(`http://localhost:5000/api/admin/revenue-chart?period=${period}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await res.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load chart data');
        }
      } catch (err: any) {
        console.error('Chart fetch error:', err);
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [period]);

  const getMaxValue = () => {
    if (!data?.values.length) return 100;
    return Math.max(...data.values) + 1000;
  };

  const getBarHeight = (value: number) => {
    const max = getMaxValue();
    return (value / max) * 200;
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-xs text-gray-400 mt-1">Try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!data || data.labels.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">📊</div>
          <p className="text-gray-500 font-medium">No sales data available</p>
          <p className="text-xs text-gray-400 mt-1">Orders will appear here once customers purchase</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setPeriod('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            period === 'week' ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            period === 'month' ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            period === 'year' ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          This Year
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-80">Total Revenue</p>
          <p className="text-xl font-bold">KES {data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-80">Orders</p>
          <p className="text-xl font-bold">{data.periods}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <p className="text-xs opacity-80">Avg Order Value</p>
          <p className="text-xl font-bold">KES {Math.round(data.avgOrderValue).toLocaleString()}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div>
        <div className="flex items-end gap-2 h-72 mb-4">
          {data.labels.map((label, idx) => {
            const height = getBarHeight(data.values[idx]);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '220px' }}>
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gold to-goldDark rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                    style={{ height: `${height}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                      KES {data.values[idx].toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{label}</span>
              </div>
            );
          })}
        </div>
        
        {/* Chart Legend */}
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gold rounded"></div>
            <span className="text-xs text-gray-500">Revenue (KES)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span className="text-xs text-gray-500">Daily Sales</span>
          </div>
        </div>
      </div>
    </div>
  );
}