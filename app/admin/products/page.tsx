'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Edit, Trash2, Plus, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  category: { name: string };
  created_at: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5000/api/admin/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setProducts(data.data);
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchProducts();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * 10, currentPage * 10);
  const totalPages = Math.ceil(filteredProducts.length / 10);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/new">
          <button className="bg-gold text-dark px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-goldDark transition">
            <Plus size={16} /> Add New Product
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Active Products</p>
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.is_active).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Low Stock</p>
          <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.stock_quantity < 10).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock_quantity === 0).length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Filter</button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Date Added</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package size={14} className="text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.category?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${product.stock_quantity < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(product.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/product/${product.id}`} target="_blank">
                        <button className="p-1 hover:bg-gray-100 rounded"><Eye size={16} className="text-gray-500" /></button>
                      </Link>
                      <button className="p-1 hover:bg-gray-100 rounded"><Edit size={16} className="text-blue-500" /></button>
                      <button onClick={() => deleteProduct(product.id)} className="p-1 hover:bg-gray-100 rounded"><Trash2 size={16} className="text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}