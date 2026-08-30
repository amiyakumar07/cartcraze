import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ChevronDown, Zap, MapPin, AlertCircle, X } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-white shadow-[0_1px_0_0_#e5e7eb] font-[Inter,sans-serif]">
      {/* ── Row 1: Delivery Speed + Location ── */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        {/* Delivery Speed Pill */}
        <div
          onClick={() => isOutOfCoverageRange ? setShowManagerAddress(true) : setActiveTab('track_order')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer shrink-0 transition-all active:scale-95 ${
            isOutOfCoverageRange
              ? 'bg-red-500 text-white'
              : 'bg-[#0c831f] text-white'
          }`}
        >
          {isOutOfCoverageRange ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <div>
                <p className="text-[9px] font-semibold opacity-80 leading-none">Delivery</p>
                <p className="text-xs font-black leading-none mt-0.5">Out of Range</p>
              </div>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white text-white animate-pulse shrink-0" />
              <div>
                <p className="text-[9px] font-semibold opacity-80 leading-none">Delivery in</p>
                <p className="text-base font-black leading-none mt-0.5">9 mins</p>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-9 bg-gray-200 shrink-0" />

        {/* Address Selector */}
        <button
          onClick={() => setShowManagerAddress(true)}
          className="flex items-center gap-1.5 min-w-0 flex-1 text-left group"
        >
          <MapPin className="w-4 h-4 text-[#0c831f] shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide truncate">
                {activeAddrObj?.label || 'Home'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-600 shrink-0 group-hover:text-gray-900 transition-colors" />
            </div>
            <p className="text-xs font-bold text-gray-900 truncate leading-snug">
              {userProfile.address
                ? userProfile.address.split(',').slice(0, 2).join(', ')
                : 'Set your delivery address'}
            </p>
          </div>
        </button>
      </div>

      {/* ── Active Darkstore Strip ── */}
      {activeStore && (
        <div className="mx-3 mb-2 flex items-center gap-1.5 text-[10px] font-semibold bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-2.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-gray-500 uppercase tracking-wide shrink-0 text-[9px]">Fulfilling:</span>
          <span className="text-gray-900 font-bold truncate">{activeStore.name}</span>
          <span className="text-gray-400 font-normal truncate shrink-1">• {activeStore.address}</span>
        </div>
      )}

      {/* ── Search Bar ── */}
      <div className="px-3 pb-3">
        <div className="relative flex items-center bg-[#f2f3f7] rounded-xl border border-transparent focus-within:border-[#0c831f] focus-within:bg-white transition-all duration-200">
          <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'home' && activeTab !== 'category_detail') {
                setActiveTab('home');
              }
            }}
            placeholder='Search "Apples", "Milk", "Bread"...'
            className="w-full pl-9 pr-8 py-2.5 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddressSearchModal
        isOpen={showSearchAddress}
        onClose={() => setShowSearchAddress(false)}
        onSelectAddress={(selected) => setUserProfile((prev) => ({ ...prev, address: selected }))}
      />
      <AddressManagerModal
        isOpen={showManagerAddress}
        onClose={() => setShowManagerAddress(false)}
      />
    </header>
  );
};
