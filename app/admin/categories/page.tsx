'use client';

import { useEffect, useState } from 'react';
import { Tag, Edit, Trash2, Plus, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  product_count?: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('http://localhost:5000/api/admin/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editing 
      ? `http://localhost:5000/api/admin/categories/${editing.id}`
      : 'http://localhost:5000/api/admin/categories';
    
    const res = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      if (editing) {
        setCategories(categories.map(c => c.id === editing.id ? data.data : c));
      } else {
        setCategories([data.data, ...categories]);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ name: '', description: '' });
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Products will lose category.')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setCategories(categories.filter(c => c.id !== id));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage product categories</p>
        </div>
        <button onClick={() => { setEditing(null); setFormData({ name: '', description: '' }); setShowModal(true); }} className="bg-gold text-dark px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-goldDark transition">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Tag size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-xs text-gray-400">{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(category); setFormData({ name: category.name, description: category.description || '' }); setShowModal(true); }} className="p-1 hover:bg-gray-100 rounded">
                  <Edit size={14} className="text-blue-500" />
                </button>
                <button onClick={() => deleteCategory(category.id)} className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>
            {category.description && <p className="text-sm text-gray-500 mt-2">{category.description}</p>}
            <div className="mt-3 pt-2 border-t flex justify-between text-xs text-gray-400">
              <span>Products: {category.product_count || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" required />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"></textarea>
              </div>
              <button type="submit" className="w-full bg-gold text-dark py-2 rounded-lg font-semibold hover:bg-goldDark transition">{editing ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}