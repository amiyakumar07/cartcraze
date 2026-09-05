import React from 'react';
import { Bike, Wallet, Star, User } from 'lucide-react';
import type { AppTab } from '../../types';

interface Props {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const tabs = [
  {
    id: 'orders' as AppTab,
    label: 'Deliveries',
    icon: Bike,
  },
  {
    id: 'earnings' as AppTab,
    label: 'Earnings',
    icon: Wallet,
  },
  {
    id: 'ratings' as AppTab,
    label: 'Ratings',
    icon: Star,
  },
  {
    id: 'profile' as AppTab,
    label: 'Profile',
    icon: User,
  },
];

export const BottomNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="sticky bottom-0 left-0 right-0 w-full z-50 bg-[#0B1121]/95 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-8px_24px_rgba(0,0,0,0.4)] px-3 py-2 flex items-center justify-around">
      {tabs.map(({ id, label, icon: IconComponent }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`transition-all duration-200 cursor-pointer flex flex-col items-center justify-center relative ${
              isActive
                ? 'bg-amber-500/15 text-amber-400 font-extrabold px-5 py-2 rounded-2xl border border-amber-500/30 shadow-[0_0_16px_rgba(245,158,11,0.2)] active:scale-95'
                : 'text-slate-400 hover:text-slate-200 py-1.5 px-3 active:scale-90'
            }`}
          >
            <IconComponent className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="text-[11px] font-bold leading-tight mt-1 tracking-tight">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
