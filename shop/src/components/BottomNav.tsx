import React from 'react';
import { ShoppingBag, Box, Bike, BarChart3, Settings } from 'lucide-react';

export type ShopTab = 'orders' | 'inventory' | 'riders' | 'analytics' | 'settings';

interface Props {
  activeTab: ShopTab;
  setActiveTab: (tab: ShopTab) => void;
  newOrderCount?: number;
}

const tabs = [
  { id: 'orders' as ShopTab, label: 'Orders', Icon: ShoppingBag },
  { id: 'inventory' as ShopTab, label: 'Stock', Icon: Box },
  { id: 'riders' as ShopTab, label: 'Riders', Icon: Bike },
  { id: 'analytics' as ShopTab, label: 'Analytics', Icon: BarChart3 },
  { id: 'settings' as ShopTab, label: 'Settings', Icon: Settings },
];

export const BottomNav: React.FC<Props> = ({ activeTab, setActiveTab, newOrderCount = 0 }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50 bg-white/96 backdrop-blur-lg border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-2xl px-1 py-2 flex items-center justify-around">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        const showBadge = id === 'orders' && newOrderCount > 0;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 py-1 px-2 relative ${
              isActive ? 'scale-105' : 'hover:opacity-80'
            }`}
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors duration-200 relative ${
                isActive ? 'bg-[#ffc800] text-gray-900 shadow-sm' : ''
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
              {showBadge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {newOrderCount > 9 ? '9+' : newOrderCount}
                </span>
              )}
            </div>
            <span className={`text-[9px] font-bold mt-0.5 tracking-tight ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
