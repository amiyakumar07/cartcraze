import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddressSearchModal } from './AddressSearchModal';

interface ServiceUnavailableViewProps {
  onSearchNewAddress?: () => void;
}

export const ServiceUnavailableView: React.FC<ServiceUnavailableViewProps> = ({ onSearchNewAddress }) => {
  const { 
    userProfile, 
    setUserProfile, 
    setUserCoords, 
    checkStoreCoverage,
    setActiveTab 
  } = useApp();

  const [isNotified, setIsNotified] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(1420);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [switchedToast, setSwitchedToast] = useState<string | null>(null);

  // Address parsing
  const rawAddr = userProfile.address || 'Selected Location (Outside 5km Zone)';
  const pinMatch = rawAddr.match(/\b\d{6}\b/);
  const locationPincode = pinMatch ? pinMatch[0] : '751024';
  const addrParts = rawAddr.split(',').map((s) => s.trim()).filter(Boolean);
  const locationAreaName = addrParts.length >= 2 
    ? `${addrParts[0]}, ${addrParts[1]}` 
    : (addrParts[0] || 'Your Area');

  const toggleNotify = () => {
    const nextNotified = !isNotified;
    setIsNotified(nextNotified);
    if (nextNotified && userProfile.phone && userProfile.phone.length === 10) {
      fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userProfile.phone,
          name: userProfile.name || 'Valued Customer',
          address: rawAddr,
          pincode: locationPincode
        })
      }).catch(() => {});
    }
  };

  const handleVote = () => {
    if (hasVoted) return;
    setHasVoted(true);
    setVoteCount((prev) => prev + 1);
    fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: userProfile.phone || '9999999999',
        name: 'Neighborhood Voter',
        address: rawAddr,
        pincode: locationPincode
      })
    }).catch(() => {});
  };

  const switchToAddress = async (name: string, lat: number, lon: number, fullAddress: string) => {
    setUserProfile((prev) => ({ ...prev, address: fullAddress }));
    localStorage.setItem('cartcraze_user_selected_address', fullAddress);
    setUserCoords({ lat, lon });
    localStorage.setItem('cartcraze_user_coords', JSON.stringify({ lat, lon }));
    localStorage.setItem('cartcraze_location_granted', 'true');
    setSwitchedToast(name);
    setTimeout(() => setSwitchedToast(null), 2800);
    await checkStoreCoverage(lat, lon);
    setActiveTab('home');
  };

  const handleExploreJaydevVihar = () => {
    switchToAddress(
      'Store #01 Jaydev Vihar',
      20.3015,
      85.8240,
      'Jaydev Vihar Square, Bhubaneswar, Odisha 751015'
    );
  };

  return (
    <div className="flex flex-col w-full pb-8 bg-gradient-to-b from-[#f4fbf4] via-[#f7faf8] to-[#edf7ee] min-h-full animate-fadeIn font-sans">
      <div className="flex flex-col w-full px-4 pb-8 space-y-4">
        
        {/* ── Top Notice Banner ── */}
        <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-900 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-700">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-950">Store #01 Delivering in Jaydev Vihar</p>
            <p className="text-[11px] text-amber-800/80 truncate">15-minute quick delivery is active within 5 km of our Bhubaneswar darkstore.</p>
          </div>
        </div>

        {/* ── Hero Card ── */}
        <div className="flex flex-col items-center text-center pt-2 w-full bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
          <div className="relative w-36 h-36 flex items-center justify-center mb-2">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl"></div>
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-[#e6f6ee] via-[#d5f0e3] to-[#c1ebd6] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[56px] text-[#006c49]">electric_moped</span>
            </div>
            <div className="absolute bottom-1 right-2 bg-[#006c49] text-white rounded-full p-1.5 shadow-md flex items-center justify-center ring-2 ring-white">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
            </div>
          </div>

          {/* Badge + Headline + Description */}
          <span className="text-[10px] font-black uppercase text-[#006c49] tracking-wider mb-1 px-3 py-1 bg-emerald-100/70 rounded-full">
            Darkstore Coverage Zone
          </span>
          <h1 className="text-xl font-black text-gray-900 mb-1 tracking-tight">
            We haven't reached your street yet!
          </h1>
          <p className="text-xs text-gray-600 mb-5 leading-relaxed px-2 max-w-sm">
            CartCraze 15-minute express grocery delivery is currently active around{' '}
            <strong className="text-gray-900 font-bold">Jaydev Vihar (5 km)</strong>. You can still explore the live catalog, view fresh prices, or change delivery address.
          </p>

          {/* ── CTA Buttons ── */}
          <div className="w-full space-y-2.5">
            {/* Primary Action: Explore Active Darkstore in Demo Mode */}
            <button
              onClick={handleExploreJaydevVihar}
              className="w-full h-12 bg-gradient-to-r from-[#006c49] to-[#005237] hover:from-[#005a3d] hover:to-[#00402b] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#006c49]/25 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">explore</span>
              <span>Explore Jaydev Vihar Store (Live Demo)</span>
            </button>

            <button 
              className="w-full h-11 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer" 
              onClick={() => {
                if (onSearchNewAddress) onSearchNewAddress();
                else setShowSearchModal(true);
              }}
            >
              <span className="material-symbols-outlined text-[18px] text-[#006c49]">search</span>
              <span>Change or Search Delivery Address</span>
            </button>

            <button 
              className={`w-full h-10 ${
                isNotified 
                  ? 'bg-emerald-50 text-[#006c49] border border-emerald-200' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              } rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
              onClick={toggleNotify}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isNotified ? 'check_circle' : 'notifications'}
              </span>
              <span>
                {isNotified ? "We'll notify you when we expand here!" : 'Notify me when available at this pincode'}
              </span>
            </button>
          </div>
        </div>

        {/* ── Saved Addresses Quick Switcher ── */}
        <div className="w-full pt-1">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-wider">Fast Switch Hub</h2>
            <span className="text-[10px] font-bold text-[#006c49]">AVAILABLE NOW</span>
          </div>

          <div className="space-y-2">
            {/* Store #01 Jaydev Vihar (Serviceable Hub) */}
            <div 
              onClick={handleExploreJaydevVihar}
              className="w-full p-3.5 bg-white border-2 border-[#10b981]/50 hover:border-[#10b981] rounded-2xl flex items-center justify-between gap-3 shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006c49] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">storefront</span>
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-gray-900 truncate">Store #01 Jaydev Vihar</span>
                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">Jaydev Vihar Square, Bhubaneswar 751015</p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">⚡ 15-20 mins express delivery active</p>
                </div>
              </div>
              <span className="text-xs font-bold text-white bg-[#006c49] px-3 py-1.5 rounded-xl shadow-xs shrink-0 group-hover:bg-[#00573a] transition">
                Switch
              </span>
            </div>

            {/* Current Address (Unserviceable) */}
            <div className="w-full p-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl flex items-center justify-between gap-2 opacity-75">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">location_off</span>
                </div>
                <div className="min-w-0 text-left">
                  <span className="text-xs font-semibold text-gray-700 truncate block">{rawAddr}</span>
                  <span className="text-[10px] text-amber-700 font-medium">Outside 5 km service zone</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Current</span>
            </div>
          </div>
        </div>

        {/* ── Neighborhood Vote Card ── */}
        <div className="w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-900">Want CartCraze in your area?</span>
                <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold text-[10px]">
                  <span>{voteCount.toLocaleString()} votes</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-3 leading-snug">
                Vote for your pin code ({locationPincode}) to help us launch our next darkstore here.
              </p>
              <button 
                className={`w-full h-9 ${
                  hasVoted 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-amber-500/15 text-amber-900 hover:bg-amber-500/25'
                } rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                onClick={handleVote}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {hasVoted ? 'check' : 'thumb_up'}
                </span>
                <span>
                  {hasVoted ? 'Vote Recorded! Thank You' : `Vote for ${locationAreaName}`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Delivery Promise Badges ── */}
        <div className="w-full flex items-center justify-center gap-4 py-2 text-gray-400">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#006c49]">electric_moped</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">15-Min Delivery</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#006c49]">eco</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Fresh Produce</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#006c49]">verified</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Hygiene Packed</span>
          </div>
        </div>
      </div>

      {/* ── Toast Notification on Address Switch ── */}
      {switchedToast && (
        <div className="fixed bottom-20 left-4 right-4 bg-gray-900 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-2xl z-50 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span className="text-xs">Switched to <strong>{switchedToast}</strong></span>
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md">Live Store Active</span>
        </div>
      )}

      {/* ── Address Search Modal ── */}
      <AddressSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectAddress={async (addr, coords) => {
          setUserProfile((prev) => ({ ...prev, address: addr }));
          localStorage.setItem('cartcraze_user_selected_address', addr);
          if (coords) {
            setUserCoords(coords);
            localStorage.setItem('cartcraze_user_coords', JSON.stringify(coords));
            await checkStoreCoverage(coords.lat, coords.lon);
          } else {
            await checkStoreCoverage();
          }
        }}
      />
    </div>
  );
};
