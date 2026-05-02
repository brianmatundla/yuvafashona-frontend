'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <Link href="/" className="bg-dark text-white px-6 py-3 rounded-lg hover:bg-gold transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems} items)</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">📷</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gold font-bold">{formatPrice(item.price)}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <Link href="/checkout">
                <button className="w-full bg-dark text-white py-3 rounded-lg mt-6 hover:bg-gold transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}