import React from 'react';
import { useApp } from '../context/AppContext';
import type { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, getCartCount, getCartTotal, serviceabilityStatus } = useApp();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'categories', label: 'Categories', icon: 'category' },
    { id: 'cart', label: 'Cart', icon: 'shopping_bag' },
    { id: 'track_order', label: 'Orders', icon: 'receipt_long' },
    { id: 'account', label: 'Account', icon: 'account_circle' }
  ];

  return (
    <div className="sticky bottom-0 z-30 w-full mt-auto shrink-0">
      {/* Floating Gradient Cart Bar */}
      {cartCount > 0 && activeTab !== 'cart' && activeTab !== 'order_confirmed' && serviceabilityStatus !== 'UNAVAILABLE' && (
        <div className="px-3 pb-2">
          <div 
            onClick={() => setActiveTab('cart')}
            className="bg-gradient-to-r from-[#00676d] to-[#00828a] text-white rounded-xl p-2.5 shadow-xl flex flex-col gap-1.5 cursor-pointer transform active:scale-[0.99] transition-transform"
          >
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#fb7800] h-full w-[62%] rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{cartCount} Items • ₹{cartTotal}</span>
                  <span className="bg-[#fb7800] text-white text-[9px] px-1.5 py-0.2 rounded font-extrabold">SAVED ₹44</span>
                </div>
                <p className="text-[10px] text-[#e2e7ff] truncate">Add items for FREE fast delivery</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('cart');
                }}
                className="flex items-center gap-1 bg-white text-[#00676d] text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm"
              >
                <span>View Cart</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-2px_12px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex justify-around items-center h-16 px-xs">
          {navItems.map((item, idx) => {
            const isActive = 
              item.id === activeTab ||
              (item.id === 'categories' && activeTab === 'category_detail') ||
              (item.id === 'track_order' && (activeTab === 'track_order' || activeTab === 'order_confirmed'));

            return (
              <button
                key={idx}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-xs min-w-[56px] h-touch-target transition-all cursor-pointer ${
                  isActive 
                    ? 'text-primary font-bold' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span className={`material-symbols-outlined text-[22px] ${isActive ? 'scale-105' : ''}`}>
                    {item.icon}
                  </span>
                  {item.id === 'track_order' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-surface animate-pulse"></span>
                  )}
                  {item.id === 'cart' && cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 px-1.5 py-0.5 rounded-full bg-tertiary-container text-white text-[9px] font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="font-label-caps text-label-caps">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
