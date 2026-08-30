import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, ShoppingCart, User } from 'lucide-react';
import type { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, getCartCount, getCartTotal } = useApp();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home',       label: 'Home',       icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'cart',       label: 'Cart',       icon: ShoppingCart },
    { id: 'account',    label: 'Account',    icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto z-40 bg-white border-t border-[#e8e8e8] font-[Inter,sans-serif]">
      {/* ── Floating Cart Bar (Blinkit green) ── */}
      {cartCount > 0 && activeTab !== 'cart' && activeTab !== 'order_confirmed' && (
        <div
          onClick={() => setActiveTab('cart')}
          className="mx-3 -mt-4 mb-1.5 bg-[#0c831f] text-white rounded-2xl px-3 py-2.5 flex justify-between items-center shadow-[0_4px_16px_rgba(12,131,31,0.4)] cursor-pointer hover:bg-[#0a7019] transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="bg-white text-[#0c831f] text-[11px] font-black w-6 h-6 rounded-lg flex items-center justify-center">
              {cartCount}
            </div>
            <div>
              <p className="text-[13px] font-bold leading-tight">View Basket</p>
              <p className="text-[10px] text-white/70">Free delivery applicable</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-black text-[13px]">
            <span>₹{cartTotal}</span>
            <span className="text-white/80">›</span>
          </div>
        </div>
      )}

      {/* ── Nav Buttons ── */}
      <nav className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'categories' && activeTab === 'category_detail') ||
            (item.id === 'cart' && (activeTab === 'track_order' || activeTab === 'order_confirmed'));

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-[#0c831f]' : 'text-[#8f8f8f] hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-[22px] h-[22px] transition-all ${
                    isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'
                  }`}
                />
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#0c831f] text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? 'text-[#0c831f] font-bold' : 'text-[#8f8f8f]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
