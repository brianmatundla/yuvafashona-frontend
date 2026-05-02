'use client';

import { useState } from 'react';
import { Settings, Bell, Lock, Palette, Globe, Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Yuvafashona',
    siteEmail: 'admin@yuvafashona.com',
    currency: 'KES',
    darkMode: false,
    notifications: true,
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your store configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="space-y-1">
              <button className="w-full text-left px-4 py-2 rounded-lg bg-gold/10 text-gold font-medium flex items-center gap-3">
                <Settings size={18} /> General
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-3">
                <Bell size={18} /> Notifications
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-3">
                <Palette size={18} /> Appearance
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-3">
                <Globe size={18} /> Localization
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-3">
                <Lock size={18} /> Security
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">General Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <input type="email" value={settings.siteEmail} onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-700">Dark Mode</p>
                  <p className="text-xs text-gray-500">Enable dark theme for admin panel</p>
                </div>
                <button onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })} className={`w-12 h-6 rounded-full transition ${settings.darkMode ? 'bg-gold' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-700">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive order alerts via email</p>
                </div>
                <button onClick={() => setSettings({ ...settings, notifications: !settings.notifications })} className={`w-12 h-6 rounded-full transition ${settings.notifications ? 'bg-gold' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
            </div>
            
            <button onClick={handleSave} className="mt-6 bg-gold text-dark px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-goldDark transition">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}