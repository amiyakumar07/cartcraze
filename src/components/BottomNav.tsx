import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import type { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, getCartCount, getCartTotal } = useApp();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'cart', label: 'Cart', icon: ShoppingBag },
    { id: 'account', label: 'Account', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto z-40 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] rounded-t-2xl">
      {/* Floating Mini Cart Notification Bar (if items in cart and not currently on cart/checkout page) */}
      {cartCount > 0 && activeTab !== 'cart' && activeTab !== 'order_confirmed' && (
        <div 
          onClick={() => setActiveTab('cart')}
          className="mx-3 -mt-4 mb-1 bg-gray-900 text-white rounded-xl p-2.5 flex justify-between items-center shadow-lg cursor-pointer hover:bg-black transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#fdee24] text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
              {cartCount}
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">View Basket</p>
              <p className="text-[10px] text-gray-300">Free delivery applicable</p>
            </div>
          </div>
          <div className="flex items-center gap-1 font-bold text-xs">
            <span>₹{cartTotal}</span>
            <span className="text-[#fdee24]">→</span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
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
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-gray-900' : ''}`} />
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
