'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  Award, 
  Clock, 
  Headphones,
  ArrowRight,
  Heart,
  Eye,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Gift,
  Zap,
  ChevronLeft,
  ChevronRight
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
  is_new?: boolean;
  rating?: number;
  sold_count?: number;
  category: { name: string; slug: string };
}

export default function Home() {
  const { user } = useAuth();
  const { addToCart, totalItems } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>();
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 12, minutes: 30, seconds: 45 });
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  // Banner Slides
  const banners = [
    { id: 1, title: 'Summer Sale', subtitle: 'Up to 50% Off', description: 'On selected footwear & accessories', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600', cta: 'Shop Now', link: '/category/shoes', color: 'from-orange-500/90 to-red-600/90' },
    { id: 2, title: 'New Perfumes', subtitle: 'Fresh Arrivals', description: 'Discover luxury scents from around the world', image: 'https://images.unsplash.com/photo-1594035910382-f1b2f7ec3a54?w=1600', cta: 'Explore', link: '/category/perfumes', color: 'from-purple-500/90 to-pink-600/90' },
    { id: 3, title: 'Flash Sale', subtitle: 'Limited Time', description: 'Up to 60% off on premium collection', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1600', cta: 'Grab Deal', link: '/shop', color: 'from-red-500/90 to-orange-600/90' },
    { id: 4, title: 'Beauty Edit', subtitle: 'Clean Beauty', description: 'Natural ingredients for radiant skin', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=1600', cta: 'Shop Beauty', link: '/category/beauty-care', color: 'from-pink-500/90 to-rose-600/90' },
    { id: 5, title: 'Home Decor', subtitle: 'New Collection', description: 'Elevate your living space', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600', cta: 'Explore', link: '/category/home-living', color: 'from-emerald-500/90 to-teal-600/90' },
    { id: 6, title: 'Accessories', subtitle: 'Complete Your Look', description: 'Bags, jewelry & more', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1600', cta: 'Shop Now', link: '/category/accessories', color: 'from-amber-500/90 to-yellow-600/90' },
    { id: 7, title: 'Weekend Deal', subtitle: 'Limited Edition', description: 'Exclusive pieces just for you', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600', cta: 'Shop Now', link: '/shop', color: 'from-indigo-500/90 to-purple-600/90' }
  ];

  // Categories
  const categories = [
    { name: 'Perfumes', slug: 'perfumes', icon: '🌸', color: 'from-pink-500 to-rose-500', productCount: 48, bgColor: 'bg-pink-50' },
    { name: 'Heels', slug: 'heels', icon: '👠', color: 'from-purple-500 to-indigo-500', productCount: 36, bgColor: 'bg-purple-50' },
    { name: 'Sandals', slug: 'sandals', icon: '👡', color: 'from-yellow-500 to-orange-500', productCount: 52, bgColor: 'bg-yellow-50' },
    { name: 'Shoes', slug: 'shoes', icon: '👞', color: 'from-blue-500 to-cyan-500', productCount: 44, bgColor: 'bg-blue-50' },
    { name: 'Beauty', slug: 'beauty-care', icon: '💄', color: 'from-rose-500 to-pink-500', productCount: 38, bgColor: 'bg-rose-50' },
    { name: 'Accessories', slug: 'accessories', icon: '👜', color: 'from-amber-500 to-orange-500', productCount: 64, bgColor: 'bg-amber-50' },
    { name: 'Home', slug: 'home-living', icon: '🏠', color: 'from-emerald-500 to-green-500', productCount: 42, bgColor: 'bg-emerald-50' }
  ];

  // Trust Badges
  const trustBadges = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders 2000+', color: 'bg-blue-500' },
    { icon: Shield, title: 'Secure Payment', desc: '100% encrypted', color: 'bg-green-500' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30-day policy', color: 'bg-orange-500' },
    { icon: Award, title: 'Best Price', desc: 'Price match guarantee', color: 'bg-purple-500' },
    { icon: Gift, title: 'Gift Ready', desc: 'Free luxury packaging', color: 'bg-pink-500' },
    { icon: Headphones, title: '24/7 Support', desc: 'Always here to help', color: 'bg-indigo-500' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        const allProducts = data.data || [];
        
        setFeaturedProducts(allProducts.filter((p: Product) => p.is_featured === true).slice(0, 8));
        setNewArrivals(allProducts.slice(0, 8));
        setTopSelling(allProducts.slice(0, 4));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
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

  const getDiscount = (product: Product) => {
    if (product.compare_price && product.compare_price > product.price) {
      return Math.round(((product.compare_price - product.price) / product.compare_price) * 100);
    }
    return 0;
  };

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <>
      {/* SEO Head */}
      <Head>
        <title>Yuvafashona - Luxury Fashion E-commerce | Premium Perfumes, Shoes & Accessories</title>
        <meta name="description" content="Discover luxury fashion at Yuvafashona. Shop premium perfumes, designer shoes, elegant heels, beauty products, and accessories. Free shipping on orders over 2000 KES." />
        <meta name="keywords" content="luxury fashion, perfumes, shoes, heels, beauty products, accessories, Kenya fashion, online shopping" />
        <meta name="author" content="Yuvafashona" />
        <meta property="og:title" content="Yuvafashona - Luxury Fashion E-commerce" />
        <meta property="og:description" content="Discover luxury fashion at Yuvafashona. Premium quality products at affordable prices." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yuvafashona.com" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-dark shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gold to-goldDark bg-clip-text text-transparent">
                YUVAFASHONA
              </h1>
            </Link>
            <div className="flex gap-4 items-center">
              <Link href="/cart" className="relative text-white hover:text-gold transition">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-dark text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <span className="text-white text-sm hidden md:inline">Hi, {user.full_name?.split(' ')[0]}</span>
                  <Link href="/profile" className="text-white hover:text-gold transition">
                    <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-gold text-sm font-bold">{user.full_name?.charAt(0) || 'U'}</span>
                    </div>
                  </Link>
                </>
              ) : (
                <Link href="/login" className="text-white hover:text-gold transition text-sm">Login</Link>
              )}
            </div>
          </div>
        </header>

        {/* Hero Carousel */}
        <div className="relative overflow-hidden">
          <div className="relative h-[500px] md:h-[600px]">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentBanner ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10"></div>
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} z-20`}></div>
                
                <div className="relative z-30 h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 w-full">
                    <div className={`max-w-2xl transform transition-all duration-700 delay-300 ${
                      index === currentBanner ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                      <span className="text-gold uppercase tracking-wider text-sm font-semibold">{banner.subtitle}</span>
                      <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 leading-tight">{banner.title}</h2>
                      <p className="text-lg md:text-xl text-gray-200 mt-4">{banner.description}</p>
                      <Link href={banner.link}>
                        <button className="inline-flex items-center gap-2 bg-gold text-dark px-6 md:px-8 py-3 rounded-full font-semibold mt-6 hover:bg-goldDark transition group">
                          {banner.cta}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button onClick={prevBanner} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={nextBanner} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentBanner ? 'w-8 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white border-b py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="text-center group cursor-pointer">
                  <div className={`w-12 h-12 ${badge.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition`}>
                    <badge.icon className={`w-6 h-6 text-${badge.color.replace('bg-', '')}`} />
                  </div>
                  <p className="font-semibold text-dark text-sm">{badge.title}</p>
                  <p className="text-xs text-gray-500">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-gold text-sm uppercase tracking-wider font-semibold">Collections</span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mt-2">Shop by Category</h2>
              <p className="text-gray-500 mt-2">Explore our premium collections</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`}>
                  <div className="group bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition">{cat.icon}</div>
                    <p className="font-semibold text-gray-800 group-hover:text-gold text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{cat.productCount} items</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Flash Sale Timer */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-white" />
                <div>
                  <h3 className="text-white font-bold text-xl">Flash Sale</h3>
                  <p className="text-white/80 text-sm">Up to 60% off</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center bg-white/20 backdrop-blur rounded-xl px-4 py-2 min-w-[70px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
                  <div className="text-xs text-white/80">Days</div>
                </div>
                <div className="text-center bg-white/20 backdrop-blur rounded-xl px-4 py-2 min-w-[70px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-xs text-white/80">Hours</div>
                </div>
                <div className="text-center bg-white/20 backdrop-blur rounded-xl px-4 py-2 min-w-[70px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-xs text-white/80">Mins</div>
                </div>
                <div className="text-center bg-white/20 backdrop-blur rounded-xl px-4 py-2 min-w-[70px]">
                  <div className="text-2xl font-bold text-white">{timeLeft.seconds}</div>
                  <div className="text-xs text-white/80">Secs</div>
                </div>
              </div>
              <Link href="/shop">
                <button className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
                  Shop Flash Sale
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-dark">Featured Products</h2>
                <p className="text-gray-500 mt-1">Hand-picked just for you</p>
              </div>
              <Link href="/shop?featured=true">
                <button className="text-gold font-semibold hover:underline flex items-center gap-1">
                  View All <ArrowRight size={16} />
                </button>
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredProducts.map((product) => {
                  const discount = getDiscount(product);
                  return (
                    <div key={product.id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300">
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">📷</div>
                        )}
                        {discount > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">-{discount}%</div>
                        )}
                        {product.is_featured && (
                          <div className="absolute top-3 right-3 bg-gold text-dark text-xs px-2 py-1 rounded-full font-bold">Featured</div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                          <button className="p-2 bg-white rounded-full hover:bg-gold transition"><Heart size={18} /></button>
                          <button onClick={() => addToCart(product)} className="p-2 bg-white rounded-full hover:bg-gold transition"><ShoppingBag size={18} /></button>
                          <Link href={`/product/${product.id}`}><button className="p-2 bg-white rounded-full hover:bg-gold transition"><Eye size={18} /></button></Link>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-gold text-gold" />)}
                          <span className="text-xs text-gray-400 ml-1">(128)</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-gold">{formatPrice(product.price)}</span>
                            {product.compare_price && <span className="ml-2 text-sm text-gray-400 line-through">{formatPrice(product.compare_price)}</span>}
                          </div>
                          <button onClick={() => addToCart(product)} className="bg-dark text-white px-3 py-1 rounded-lg text-sm hover:bg-gold transition">Add</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* New Arrivals */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-dark">New Arrivals</h2>
                <p className="text-gray-500 mt-1">Fresh from the runway</p>
              </div>
              <Link href="/shop?sort=newest">
                <button className="text-gold font-semibold hover:underline flex items-center gap-1">
                  View All <ArrowRight size={16} />
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <div key={product.id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition" /> : <div className="w-full h-full flex items-center justify-center text-2xl">📷</div>}
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">New</div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                    <div className="mt-1 flex justify-between items-center">
                      <span className="font-bold text-gold">{formatPrice(product.price)}</span>
                      <button onClick={() => addToCart(product)} className="bg-dark text-white p-1 rounded-full hover:bg-gold transition"><ShoppingBag size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-dark py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">Join the Yuvafashona Club</h2>
            <p className="text-gray-400 mb-6">Get 10% off your first order + exclusive offers</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 px-5 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-gold" />
              <button type="submit" className="bg-gold text-dark px-8 py-3 rounded-full font-semibold hover:bg-goldDark transition disabled:opacity-50">
                {newsletterStatus === 'loading' ? 'Subscribing...' : newsletterStatus === 'success' ? 'Subscribed! 🎉' : 'Subscribe'}
              </button>
            </form>
            <p className="text-gray-500 text-xs mt-4">No spam, unsubscribe anytime</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-gold mb-4">Yuvafashona</h3>
                <p className="text-sm">Luxury fashion for the modern connoisseur. Quality products, exceptional service.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/shop" className="hover:text-gold">Shop All</Link></li>
                  <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
                  <li><Link href="/blog" className="hover:text-gold">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Categories</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/category/perfumes" className="hover:text-gold">Perfumes</Link></li>
                  <li><Link href="/category/shoes" className="hover:text-gold">Shoes</Link></li>
                  <li><Link href="/category/accessories" className="hover:text-gold">Accessories</Link></li>
                  <li><Link href="/category/beauty-care" className="hover:text-gold">Beauty</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Contact</h4>
                <ul className="space-y-2 text-sm">
                  <li>📧 support@yuvafashona.com</li>
                  <li>📞 +254 700 000 000</li>
                  <li>📍 Nairobi, Kenya</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-xs">
              <p>&copy; {new Date().getFullYear()} Yuvafashona. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}