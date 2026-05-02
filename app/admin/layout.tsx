'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    if (!token) {
      router.push('/admin/login');
    }
    if (adminUser) {
      try {
        const user = JSON.parse(adminUser);
        setAdminName(user.full_name || 'Admin');
      } catch(e) {}
    }
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin', color: 'text-indigo-500', bgColor: 'bg-indigo-50', gradient: 'from-indigo-500 to-indigo-600' },
    { name: 'Products', icon: Package, href: '/admin/products', color: 'text-emerald-500', bgColor: 'bg-emerald-50', gradient: 'from-emerald-500 to-emerald-600' },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders', color: 'text-orange-500', bgColor: 'bg-orange-50', gradient: 'from-orange-500 to-orange-600' },
    { name: 'Users', icon: Users, href: '/admin/users', color: 'text-purple-500', bgColor: 'bg-purple-50', gradient: 'from-purple-500 to-purple-600' },
    { name: 'Categories', icon: Tag, href: '/admin/categories', color: 'text-pink-500', bgColor: 'bg-pink-50', gradient: 'from-pink-500 to-pink-600' },
    { name: 'Analytics', icon: TrendingUp, href: '/admin/analytics', color: 'text-cyan-500', bgColor: 'bg-cyan-50', gradient: 'from-cyan-500 to-cyan-600' },
    { name: 'Settings', icon: Settings, href: '/admin/settings', color: 'text-gray-500', bgColor: 'bg-gray-100', gradient: 'from-gray-500 to-gray-600' },
  ];

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Top Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-md'} shadow-sm border-b transition-colors duration-300`}>
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Menu size={20} className={darkMode ? 'text-white' : 'text-gray-600'} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-goldDark rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-dark to-gold bg-clip-text text-transparent">
                  Yuvafashona
                </h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className={`hidden md:flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-4 py-2`}>
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className={`bg-transparent border-none outline-none text-sm px-3 w-64 ${darkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-700'}`}
              />
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-600 rounded">⌘K</kbd>
            </div>
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
            </button>
            
            {/* Notifications */}
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <Bell size={18} className={darkMode ? 'text-white' : 'text-gray-600'} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {/* User Menu */}
            <div className="flex items-center gap-3 cursor-pointer group ml-2">
              <div className="w-9 h-9 bg-gradient-to-br from-gold to-goldDark rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-700 dark:text-white">{adminName}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden lg:block" />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed top-[61px] left-0 z-40 w-72 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? `${item.bgColor} ${item.color} shadow-sm` 
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`
                  }`}
                >
                  <item.icon size={18} className={isActive ? item.color : ''} />
                  <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
                  {isActive && (
                    <div className={`ml-auto w-1.5 h-6 rounded-full bg-gradient-to-b ${item.gradient}`}></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-20 p-6">
        {children}
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}