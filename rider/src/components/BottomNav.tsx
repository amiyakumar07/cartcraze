import React from 'react';
import type { AppTab } from '../App';

interface Props {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isDarkMode?: boolean;
}

const tabs = [
  {
    id: 'orders' as AppTab,
    label: 'Deliveries',
    icon: 'moped',
  },
  {
    id: 'earnings' as AppTab,
    label: 'Earnings',
    icon: 'payments',
  },
  {
    id: 'ratings' as AppTab,
    label: 'Ratings',
    icon: 'star',
  },
  {
    id: 'profile' as AppTab,
    label: 'Profile',
    icon: 'person',
  },
];

export const BottomNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <nav className="sticky bottom-0 left-0 right-0 w-full z-50 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl px-4 py-2 flex items-center justify-around">
        {tabs.map(({ id, label, icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                isActive
                  ? 'bg-[#FFC000] text-[#251A00] font-extrabold px-6 py-2 rounded-full shadow-xs active:scale-95'
                  : 'text-slate-500 hover:text-slate-900 py-1 px-3 active:scale-90'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              <span className="text-[10px] font-bold leading-tight mt-0.5 tracking-tight">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
