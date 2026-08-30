import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ChevronDown, Zap, MapPin, AlertCircle } from 'lucide-react';
import { AddressSearchModal } from './AddressSearchModal';
import { AddressManagerModal } from './AddressManagerModal';

export const Header: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    userProfile, 
    activeTab,
    setActiveTab,
    setUserProfile,
    isOutOfCoverageRange,
    activeStore
  } = useApp();

  const [showSearchAddress, setShowSearchAddress] = useState(false);
  const [showManagerAddress, setShowManagerAddress] = useState(false);

  const activeAddrObj = userProfile.savedAddresses?.find(
    (a) => a.fullAddress === userProfile.address || a.isDefault
  );

  return (
    <header className="pt-3 pb-3 px-4 sticky top-0 bg-white z-20 border-b border-gray-100 shadow-xs font-sans">
      {/* Main Delivery & Location Row */}
      <div className="flex justify-between items-center gap-2 mb-3">
        {/* Delivery Speed Badge / Range Warning */}
        {isOutOfCoverageRange ? (
          <div 
            onClick={() => setShowManagerAddress(true)}
            className="bg-red-500 text-white rounded-full px-3 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-102 transition-transform shrink-0"
            title="No store available within 5km delivery range"
          >
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
            <span className="font-black text-xs">Out of 5km Range</span>
          </div>
        ) : (
          <div 
            onClick={() => setActiveTab('track_order')}
            className="bg-[#fdee24] rounded-full px-3 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-102 transition-transform shrink-0"
          >
            <Zap className="w-4 h-4 fill-black text-black animate-pulse" />
            <span className="font-extrabold text-xs text-black">Delivery in 9 mins</span>
          </div>
        )}

        {/* Detailed Customer Location Pill */}
        <div 
          onClick={() => setShowManagerAddress(true)}
          className="flex items-center gap-2 cursor-pointer group bg-gray-50 hover:bg-gray-100 p-1.5 px-3 rounded-2xl border border-gray-200/80 transition min-w-0 flex-1 justify-end shadow-2xs"
          title="Click to view & change delivery address"
        >
          <div className="p-1.5 bg-amber-400 text-black rounded-xl shrink-0 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 fill-black text-black" />
          </div>

          <div className="min-w-0 text-right flex-1">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">DELIVERING TO</span>
              <span className="text-[9px] bg-slate-900 text-yellow-300 font-black px-1.5 py-0.2 rounded-md uppercase">
                {activeAddrObj?.label || 'CURRENT'}
              </span>
            </div>
            <span className="font-extrabold text-xs text-gray-900 group-hover:text-amber-600 transition-colors truncate block leading-snug">
              {userProfile.address || 'Flat 402, Sunshine Apartments, HSR Layout, Sector 1, Bengaluru'}
            </span>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
        </div>
      </div>

      {/* Active Darkstore Fulfilling Order Location */}
      {activeStore && (
        <div className="mb-3 flex items-center gap-1.5 text-[10px] text-[#8a6d00] font-extrabold bg-[#fef3c7]/60 border border-[#fde047]/60 rounded-xl px-2.5 py-1.5 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="shrink-0 uppercase tracking-wide text-[9px] text-[#7a6000]">Fulfilling Store:</span>
          <span className="text-gray-900 truncate font-black">{activeStore.name}</span>
          <span className="text-gray-500 font-medium truncate shrink-1">• {activeStore.address}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (activeTab !== 'home' && activeTab !== 'category_detail') {
              setActiveTab('home');
            }
          }}
          placeholder='Search "Avocado", "Milk", "Apples", "Bread"...'
          className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-2xl text-xs bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all font-semibold"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Address Search Modal */}
      <AddressSearchModal
        isOpen={showSearchAddress}
        onClose={() => setShowSearchAddress(false)}
        onSelectAddress={(selected) => {
          setUserProfile((prev) => ({ ...prev, address: selected }));
        }}
      />

      {/* Address Manager Modal */}
      <AddressManagerModal
        isOpen={showManagerAddress}
        onClose={() => setShowManagerAddress(false)}
      />
    </header>
  );
};
