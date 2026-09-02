import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ChevronDown, Zap, MapPin, AlertCircle, X, Mic, User, Bell } from 'lucide-react';
import { AddressSearchModal } from './AddressSearchModal';
import { AddressManagerModal } from './AddressManagerModal';
import { LocationStoreAvailabilitySheet } from './LocationStoreAvailabilitySheet';
import { AuthBottomSheet } from './AuthBottomSheet';

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
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showAuthSheet, setShowAuthSheet] = useState(false);

  const activeAddrObj = userProfile.savedAddresses?.find(
    (a) => a.fullAddress === userProfile.address || a.isDefault
  );

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-emerald-100/60 shadow-xs font-[Inter,sans-serif]">
      {/* ── Top Bar: Location & Profile/Notification ── */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <button
          onClick={() => setShowLocationSheet(true)}
          className="flex items-center gap-2 text-left group min-w-0 flex-1 pr-2"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#006C49] flex items-center justify-center shrink-0 border border-emerald-200/50">
            <MapPin className="w-4 h-4 text-[#006C49]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black text-[#006C49] uppercase tracking-wider">
                Deliver to {activeAddrObj?.label || 'Home'} • 8 Mins
              </span>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-xs font-extrabold text-slate-900 truncate max-w-[200px] leading-tight">
                {userProfile.address
                  ? userProfile.address.split(',').slice(0, 2).join(', ')
                  : 'Patia, Bhubaneswar'}
              </p>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-slate-700 transition-colors" />
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowAuthSheet(true)}
            data-testid="auth_profile_btn"
            className="w-8 h-8 rounded-full bg-emerald-100/80 text-[#00422B] flex items-center justify-center hover:bg-emerald-200 transition-colors shadow-2xs border border-emerald-200/50"
          >
            {userProfile.name ? (
              <span className="font-extrabold text-xs text-[#00422B]">
                {userProfile.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-4 h-4 text-[#00422B]" />
            )}
          </button>
          <button
            data-testid="notification_btn"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Search Bar Input Mockup ── */}
      <div className="px-4 pb-2">
        <div className="relative flex items-center bg-slate-100/90 rounded-2xl border border-slate-200/80 focus-within:border-emerald-600 focus-within:bg-white transition-all shadow-2xs">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'home' && activeTab !== 'category_detail') {
                setActiveTab('home');
              }
            }}
            placeholder="Search groceries, milk, fruits..."
            className="w-full pl-10 pr-9 py-2.5 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Mic className="absolute right-3.5 w-4 h-4 text-[#006C49] pointer-events-none" />
          )}
        </div>
      </div>

      {/* ── Real-Time Dark Store Availability Badge ── */}
      <div className="px-4 pb-2.5">
        <div 
          onClick={() => setShowLocationSheet(true)}
          className={`flex items-center justify-between p-2 px-3 rounded-xl border transition-all cursor-pointer ${
            isOutOfCoverageRange
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 hover:bg-emerald-500/15'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {isOutOfCoverageRange ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <Zap className="w-4 h-4 text-[#006C49] shrink-0 fill-[#006C49] animate-pulse" />
            )}
            <div className="min-w-0">
              <div className="text-[11px] font-black text-[#006C49] leading-none flex items-center gap-1">
                <span>⚡ Delivery in 8-10 Mins</span>
              </div>
              <div className="text-[10px] text-slate-600 font-medium truncate mt-0.5">
                Dispatched from {activeStore ? activeStore.name : 'Patia DarkStore Hub #3'} (1.2 km away)
              </div>
            </div>
          </div>
          <span className="bg-[#006C49] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
            LIVE
          </span>
        </div>
      </div>

      {/* Modals & Sheets */}
      <LocationStoreAvailabilitySheet
        isOpen={showLocationSheet}
        onClose={() => setShowLocationSheet(false)}
        currentAddress={userProfile.address || 'Patia, Bhubaneswar'}
        activeStoreName={activeStore?.name}
        onAddressSelect={(newAddr) => setUserProfile((prev) => ({ ...prev, address: newAddr }))}
      />
      <AuthBottomSheet
        isOpen={showAuthSheet}
        onClose={() => setShowAuthSheet(false)}
      />
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
