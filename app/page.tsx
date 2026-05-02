'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { 
  Star, Truck, Shield, RotateCcw, Award, Clock, Headphones,
  ArrowRight, Heart, Eye, ShoppingBag, Sparkles, Zap,
  ChevronLeft, ChevronRight, Gift, TrendingUp, Flame,
  Crown, Rocket
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  compare_price: number;
  description: string;
  images: string[];
  stock_quantity: number;
  is_featured: boolean;
  category: { name: string; slug: string };
}

export default function Home() {
  const { user } = useAuth();
  const { addToCart, totalItems } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [affordableProducts, setAffordableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const banners = [
    { id: 1, title: '50% OFF', subtitle: 'Summer Sale', description: 'Selected footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600', cta: 'Shop', link: '/category/shoes', color: 'from-orange-500/70 to-red-600/70', badge: '🔥 SALE', badgeColor: 'bg-red-500' },
    { id: 2, title: 'New Scents', subtitle: 'Premium Perfumes', description: 'From 2,500 KES', image: 'https://images.unsplash.com/photo-1594035910382-f1b2f7ec3a54?w=1600', cta: 'Explore', link: '/category/perfumes', color: 'from-purple-500/70 to-pink-600/70', badge: '✨ NEW', badgeColor: 'bg-purple-500' },
    { id: 3, title: 'Buy 1 Get 1', subtitle: 'Accessories', description: 'Limited offer', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1600', cta: 'Grab', link: '/category/accessories', color: 'from-amber-500/70 to-yellow-600/70', badge: '⭐ DEAL', badgeColor: 'bg-amber-500' },
    { id: 4, title: 'Free Shipping', subtitle: 'Orders 2,000+', description: 'Nationwide', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600', cta: 'Shop', link: '/shop', color: 'from-emerald-500/70 to-teal-600/70', badge: '🚚 FREE', badgeColor: 'bg-emerald-500' }
  ];

  const categories = [
    { name: 'Perfumes', slug: 'perfumes', icon: '🌸', productCount: 48 },
    { name: 'Heels', slug: 'heels', icon: '👠', productCount: 36 },
    { name: 'Sandals', slug: 'sandals', icon: '👡', productCount: 52 },
    { name: 'Shoes', slug: 'shoes', icon: '👞', productCount: 44 },
    { name: 'Beauty', slug: 'beauty-care', icon: '💄', productCount: 38 },
    { name: 'Accessories', slug: 'accessories', icon: '👜', productCount: 64 },
    { name: 'Home', slug: 'home-living', icon: '🏠', productCount: 42 }
  ];

  const features = [
    { icon: Rocket, title: 'Fast Delivery', desc: '1-3 business days', color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, title: 'Secure Payment', desc: '100% encrypted', color: 'from-green-500 to-emerald-500' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30-day policy', color: 'from-orange-500 to-red-500' },
    { icon: Crown, title: 'Premium Quality', desc: 'Authentic products', color: 'from-purple-500 to-pink-500' },
    { icon: Gift, title: 'Free Gift Wrap', desc: 'On all orders', color: 'from-rose-500 to-pink-500' },
    { icon: Headphones, title: '24/7 Support', desc: 'Always here', color: 'from-indigo-500 to-blue-500' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        const data = await res.json();
        const allProducts = data.data || [];
        
        setFeaturedProducts(allProducts.filter((p: Product) => p.is_featured === true).slice(0, 8));
        setTrendingProducts(allProducts.slice(4, 12));
        
        // Flash Deals - random 4 products
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        setFlashDeals(shuffled.slice(0, 4));
        
        // Affordable Products - under 1000 KES
        const under1000 = allProducts.filter((p: Product) => p.price <= 1000);
        setAffordableProducts(under1000.slice(0, 8));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus(''), 3000);
    }, 1000);
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const getDiscount = (product: Product) => {
    if (product.compare_price && product.compare_price > product.price) {
      return Math.round(((product.compare_price - product.price) / product.compare_price) * 100);
    }
    return 0;
  };

  const getFlashDiscount = () => Math.floor(Math.random() * 40) + 20;

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <h1 className={`text-xl md:text-2xl font-bold transition-all duration-300 ${
              scrolled ? 'bg-gradient-to-r from-gold to-goldDark bg-clip-text text-transparent' : 'text-white'
            }`}>
              YUVAFASHONA
            </h1>
          </Link>
          <div className="flex gap-3 items-center">
            <Link href="/cart" className="relative">
              <div className={`p-2 rounded-full transition-all duration-300 ${
                scrolled ? 'bg-gray-100 text-dark' : 'bg-white/20 text-white'
              }`}>
                <ShoppingBag size={18} />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-dark text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <Link href="/profile">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'bg-gray-200 text-dark' : 'bg-white/20 text-white'
                }`}>
                  <span className="text-sm font-bold">{user.full_name?.charAt(0) || 'U'}</span>
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <button className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  scrolled ? 'bg-dark text-white' : 'bg-white text-dark'
                }`}>
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mx-4 mt-20">
        <div className="relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ${
                index === currentBanner ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 z-10"></div>
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} z-20 opacity-50`}></div>
              
              <div className="relative z-30 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <div className={`max-w-md transform transition-all duration-500 ${
                    index === currentBanner ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  }`}>
                    <span className={`${banner.badgeColor} text-white text-[10px] px-2 py-0.5 rounded-full inline-block mb-2`}>
                      {banner.badge}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{banner.title}</h1>
                    <p className="text-white/90 text-sm">{banner.subtitle}</p>
                    <p className="text-white/70 text-xs mb-3">{banner.description}</p>
                    <Link href={banner.link}>
                      <button className="inline-flex items-center gap-1 bg-gold text-dark px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-goldDark transition">
                        {banner.cta} <ArrowRight size={12} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={prevBanner} className="absolute left-6 top-1/2 transform -translate-y-1/2 z-40 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40">
          <ChevronLeft size={14} className="text-white" />
        </button>
        <button onClick={nextBanner} className="absolute right-6 top-1/2 transform -translate-y-1/2 z-40 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40">
          <ChevronRight size={14} className="text-white" />
        </button>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-40 flex gap-1">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`transition-all rounded-full ${
                index === currentBanner ? 'w-4 h-1 bg-gold' : 'w-1.5 h-1 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Strip */}
      <div className="bg-gradient-to-r from-dark to-gray-800 py-3 overflow-hidden mt-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...features, ...features].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 mx-6">
              <div className={`w-6 h-6 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center`}>
                <feature.icon className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-xs">{feature.title}</p>
                <p className="text-white/60 text-[10px]">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale Banner with Timer */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 py-4 mx-4 mt-4 rounded-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-white animate-pulse" />
              <div>
                <h3 className="text-white font-bold text-lg">FLASH SALE</h3>
                <p className="text-white/80 text-xs">Up to 60% OFF</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-1 text-center min-w-[60px]">
                <div className="text-xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] text-white/80">Hours</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-1 text-center min-w-[60px]">
                <div className="text-xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] text-white/80">Mins</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-1 text-center min-w-[60px]">
                <div className="text-xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] text-white/80">Secs</div>
              </div>
            </div>
            <Link href="/shop">
              <button className="bg-white text-red-600 px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition">
                Shop Now →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Flash Deals Products Grid */}
      {!loading && flashDeals.length > 0 && (
        <div className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-dark">🔥 Flash Deals</h2>
              <Link href="/shop">
                <button className="text-red-500 text-xs font-semibold">View All →</button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {flashDeals.map((product) => {
                const discount = getFlashDiscount();
                const discountedPrice = product.price * (1 - discount / 100);
                return (
                  <div key={product.id} className="group bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3 hover:shadow-lg transition hover:-translate-y-1">
                    <div className="relative h-32 mb-2">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center text-2xl">📷</div>
                      )}
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        -{discount}%
                      </div>
                    </div>
                    <h3 className="font-semibold text-xs line-clamp-1">{product.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-red-600 text-sm">{formatPrice(discountedPrice)}</span>
                        <span className="ml-1 text-[10px] text-gray-400 line-through">{formatPrice(product.price)}</span>
                      </div>
                      <button onClick={() => addToCart(product)} className="bg-red-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-semibold hover:bg-red-700">
                        Buy
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <Sparkles className="w-6 h-6 text-gold mx-auto mb-2" />
            <h2 className="text-xl font-bold text-dark">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className="bg-gray-50 rounded-xl p-3 text-center hover:shadow-md transition hover:-translate-y-1">
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <p className="font-medium text-dark text-xs">{cat.name}</p>
                  <p className="text-xs text-gray-400">{cat.productCount} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Crown className="w-4 h-4 text-gold" />
                <span className="text-gold text-xs font-semibold">Curated</span>
              </div>
              <h2 className="text-xl font-bold text-dark">Featured Products</h2>
            </div>
            <Link href="/shop?featured=true">
              <button className="text-gold text-sm">View All →</button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="bg-gray-200 rounded-xl h-56 animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 4).map((product) => {
                const discount = getDiscount(product);
                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="relative h-40 overflow-hidden">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">📷</div>
                      )}
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">-{discount}%</div>
                      )}
                      <button onClick={() => toggleWishlist(product.id)} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                        <Heart size={12} className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                      </button>
                    </div>
                    <div className="p-2">
                      <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(4)].map((_, i) => <Star key={i} size={10} className="fill-gold text-gold" />)}
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="font-bold text-gold text-sm">{formatPrice(product.price)}</span>
                        <button onClick={() => addToCart(product)} className="bg-dark text-white p-1 rounded-full hover:bg-gold transition">
                          <ShoppingBag size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Affordable Products - Under 1000 KES */}
      {!loading && affordableProducts.length > 0 && (
        <div className="py-8 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-emerald-600 text-sm font-bold">💰</span>
                  <span className="text-emerald-600 text-xs font-semibold">Budget Friendly</span>
                </div>
                <h2 className="text-xl font-bold text-dark">Under <span className="text-emerald-600">1,000 KES</span></h2>
              </div>
              <Link href="/shop?maxPrice=1000">
                <button className="text-emerald-600 text-sm font-semibold">View All →</button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {affordableProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border-2 border-emerald-200 relative">
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full rotate-12">
                    Best Value
                  </div>
                  <div className="relative h-36 overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">📷</div>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="font-semibold text-xs line-clamp-1">{product.name}</h3>
                    <div className="mt-1 flex justify-between items-center">
                      <span className="font-bold text-emerald-600 text-sm">{formatPrice(product.price)}</span>
                      <button onClick={() => addToCart(product)} className="bg-emerald-600 text-white p-1 rounded-full hover:bg-emerald-700 transition">
                        <ShoppingBag size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="bg-dark py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <Gift size={24} className="text-gold mx-auto mb-2" />
          <h2 className="text-lg font-bold text-white mb-1">Get 10% Off</h2>
          <p className="text-gray-400 text-xs mb-3">Subscribe for exclusive offers</p>
          <form onSubmit={handleNewsletter} className="flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="flex-1 px-3 py-1.5 rounded-full bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-gold" />
            <button type="submit" className="bg-gold text-dark px-4 py-1.5 rounded-full text-sm font-semibold">
              {newsletterStatus === 'loading' ? '...' : newsletterStatus === 'success' ? '✓' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Yuvafashona. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}