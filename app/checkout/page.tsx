'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate order processing
    setTimeout(() => {
      const order = {
        id: Date.now(),
        items: items,
        total: totalPrice,
        customer: formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // Save order to localStorage (will connect to backend later)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      clearCart();
      router.push(`/checkout/success?orderId=${order.id}`);
    }, 1500);
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                      />
                      <span>💵 Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer opacity-50">
                      <input type="radio" disabled />
                      <span>💳 Card Payment (Coming Soon)</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark text-white py-3 rounded-lg mt-6 hover:bg-gold transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Place Order - ${formatPrice(totalPrice)}`}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}