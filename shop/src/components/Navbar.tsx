import React from 'react';
import type { ShopActiveTab } from '../types';
import { Store, Package, Bike, BarChart3, Settings, Bell, Power } from 'lucide-react';

interface NavbarProps {
  activeTab: ShopActiveTab;
  setActiveTab: (tab: ShopActiveTab) => void;
  isStoreOpen: boolean;
  setIsStoreOpen: (open: boolean) => void;
  newOrdersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isStoreOpen,
  setIsStoreOpen,
  newOrdersCount
}) => {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-[#fdee24] text-black font-black text-xl px-3 py-1 rounded-xl shadow-xs tracking-wider uppercase flex items-center gap-1.5">
            <Store className="w-5 h-5 text-black" />
            <span>CartCraze Partner</span>
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white leading-tight">Darkstore #14 — HSR Layout</h1>
            <p className="text-[11px] text-slate-400">9-Minute Delivery Fulfillment Center</p>
          </div>
        </div>

        {/* Store Status Toggle Switch */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-full shadow-inner">
            <span className={`w-2.5 h-2.5 rounded-full ${isStoreOpen ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isStoreOpen ? 'Store Online' : 'Store Paused'}
            </span>
            <button
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className={`ml-2 p-1 rounded-full transition-colors ${
                isStoreOpen ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}
              title="Toggle Store Status"
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Alert Notification Badge */}
          <div className="relative cursor-pointer p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
            <Bell className="w-4 h-4 text-slate-300" />
            {newOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {newOrdersCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 border-t border-slate-800/80">
        <nav className="flex space-x-2 overflow-x-auto py-2 text-xs font-bold no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-[#fdee24] text-black shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Live Orders Queue</span>
            {newOrdersCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {newOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'inventory'
                ? 'bg-[#fdee24] text-black shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Darkstore Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('riders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'riders'
                ? 'bg-[#fdee24] text-black shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Delivery Fleet</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#fdee24] text-black shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Sales Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-[#fdee24] text-black shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
