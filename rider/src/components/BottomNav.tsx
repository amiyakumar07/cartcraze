import React from 'react';
import type { AppTab } from '../App';
import { Home, Package, Navigation, DollarSign, Star, User } from 'lucide-react';

interface Props {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  hasActiveOrder?: boolean;
}

export const BottomNav: React.FC<Props> = ({ activeTab, setActiveTab, hasActiveOrder }) => {
  const tabs = [
    {
      id: 'orders' as AppTab,
      label: 'Home',
      icon: Home
    },
    {
      id: 'history' as AppTab,
      label: 'Orders',
      icon: Package
    },
    {
      id: 'delivery' as AppTab,
      label: 'Delivery',
      icon: Navigation,
      badge: hasActiveOrder
    },
    {
      id: 'earnings' as AppTab,
      label: 'Earnings',
      icon: DollarSign
    },
    {
      id: 'ratings' as AppTab,
      label: 'Ratings',
      icon: Star
    },
    {
      id: 'profile' as AppTab,
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-2xl px-2 py-2 flex items-center justify-around font-sans">
      {tabs.map(({ id, label, icon: Icon, badge }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-400 font-black shadow-sm border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {badge && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px] font-extrabold leading-tight mt-1 tracking-tight">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
