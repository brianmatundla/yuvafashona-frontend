import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

export const metadata: Metadata = {
  title: 'Yuvafashona',
  description: 'Luxury Fashion E-commerce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}