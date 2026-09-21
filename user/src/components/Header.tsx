import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
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
    serviceabilityStatus,
    deliveryEta,
    setUserCoords,
    getCartCount,
    checkStoreCoverage
  } = useApp();

  const [showSearchAddress, setShowSearchAddress] = useState(false);
  const [showManagerAddress, setShowManagerAddress] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderOpacity, setPlaceholderOpacity] = useState(1);

  const placeholders = [
    'Search "Amul butter", "fresh paneer", "avocado"...',
    'Search "Mother Dairy curd", "maggi noodles"...',
    'Search "Coca Cola zero", "Alphonso mangoes"...',
    'Search "Aashirvaad atta", "Tata salt"...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderOpacity(0);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setPlaceholderOpacity(1);
      }, 300);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const cartCount = getCartCount();

  // ─── UNAVAILABLE HEADER (matches user's exact provided HTML/screenshot) ───
  // Green location icon, area name + dropdown, green "Available (15-20m)" text,
  // notification bell, profile avatar — sticky, NOT fixed
  if (serviceabilityStatus === 'UNAVAILABLE') {
    const rawAddr = userProfile.address || 'Patia, Bhubaneswar';
    const addrParts = rawAddr.split(',').map((s) => s.trim()).filter(Boolean);
    const shortArea = addrParts.length >= 2
      ? `${addrParts[0]}, ${addrParts[1]}`
      : (addrParts[0] || 'Patia, Bhubaneswar');

    return (
      <header className="sticky top-0 z-50 w-full shrink-0 bg-[#f4fbf4]/95 backdrop-blur-xl shadow-[0_1px_4px_rgba(0,0,0,0.05)] pt-safe">
        <div className="h-14 px-4 flex items-center justify-between gap-2">
          {/* Location tap-area */}
          <div 
            onClick={() => setShowSearchAddress(true)}
            className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 bg-[#10b981]/20 text-[#006c49]">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <div className="flex items-center gap-1">
                <span className="text-[15px] font-bold text-[#161d19] truncate">{shortArea}</span>
                <span className="material-symbols-outlined text-[#3c4a42] text-[16px]">expand_more</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.08em] text-[#006c49]">Available (15-20m)</span>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button 
              onClick={() => setActiveTab('account')}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#3c4a42] hover:text-[#161d19] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <img 
              onClick={() => setActiveTab('account')}
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover cursor-pointer ring-2 ring-[#006c49]/20" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5NAkgp160fOakijtlBMCZonhczXBKLqk60JWNHchuqnM-GBe8SRO7_4savRssQ_2zUmx4cfIcHEJM_EwJz7tv48QZ_kzdLCOfxBlwD0qQouAe_0jEdqSlezpvImlq7FnI-N_zkgpCIVbHxxlI7EngnS4DGo9MpU7C6CGWX9slKwq48BRYqYd6CZ0M1bn8D1yasrkMtHmMo7t7ikDwmC_ylKf6dZP74IlSCVwc2BifIMT_P1lZDN5Ang"
            />
          </div>
        </div>

        <AddressSearchModal
          isOpen={showSearchAddress}
          onClose={() => setShowSearchAddress(false)}
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
      </header>
    );
  }

  // ─── NORMAL HEADER (SERVICEABLE / LOCATION_REQUIRED / CHECKING) ───
  return (
    <header className="sticky top-0 z-30 w-full shrink-0 bg-[#faf8ff]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="px-4 py-2 flex flex-col justify-center gap-1.5 w-full mx-auto">
        {/* Top Brand & Profile Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <AppLogo className="h-7 w-auto object-contain" />
              <span className="font-extrabold text-lg tracking-tight text-[#00676d]">
                CartCraze
              </span>
            </div>
            {serviceabilityStatus === 'SERVICEABLE' ? (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-[#006a48]/10 text-[#006a48] rounded-full text-[10px] font-extrabold shadow-[0_0_10px_rgba(0,106,72,0.18)]">
                <span className="material-symbols-outlined text-[13px] text-[#006a48]">bolt</span>
                <span>{deliveryEta || '10-16 MINS'}</span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              aria-label="Notifications" 
              onClick={() => setActiveTab('account')}
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#fb7800] ring-2 ring-[#faf8ff]"></span>
            </button>

            <button 
              aria-label="Quick Cart" 
              onClick={() => setActiveTab('cart')}
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 rounded-full bg-[#994700] text-white text-[9px] font-extrabold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#00676d]/20 hover:scale-105 transition-transform shrink-0"
            >
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5NAkgp160fOakijtlBMCZonhczXBKLqk60JWNHchuqnM-GBe8SRO7_4savRssQ_2zUmx4cfIcHEJM_EwJz7tv48QZ_kzdLCOfxBlwD0qQouAe_0jEdqSlezpvImlq7FnI-N_zkgpCIVbHxxlI7EngnS4DGo9MpU7C6CGWX9slKwq48BRYqYd6CZ0M1bn8D1yasrkMtHmMo7t7ikDwmC_ylKf6dZP74IlSCVwc2BifIMT_P1lZDN5Ang" 
              />
            </button>
          </div>
        </div>

        {/* Location Row */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowSearchAddress(true)}
            className="flex items-center gap-1 text-left max-w-[85%] group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#fb7800] text-[16px] shrink-0">location_on</span>
            <div className="truncate flex items-center gap-1">
              <span className="text-[12px] font-bold text-[#131b2e] truncate">
                {userProfile.address || 'Select Delivery Location'}
              </span>
              <span className="material-symbols-outlined text-[14px] text-[#3e494a] align-middle group-hover:translate-y-0.5 transition-transform">
                expand_more
              </span>
            </div>
          </button>
          {serviceabilityStatus === 'SERVICEABLE' ? (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
              5km LIVE
            </span>
          ) : (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
              SET LOCATION
            </span>
          )}
        </div>

        {/* Search Input Bar (Visible on Storefront tabs) */}
        {(activeTab === 'home' || activeTab === 'categories' || activeTab === 'category_detail') && (
          <div className="pt-0.5">
            <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-2 rounded-full shadow-2xs">
              <span className="material-symbols-outlined text-[#00676d] text-[19px]">search</span>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'home' && activeTab !== 'category_detail') {
                      setActiveTab('home');
                    }
                  }}
                  placeholder={placeholders[placeholderIndex]}
                  style={{ opacity: searchQuery ? 1 : placeholderOpacity, transition: 'opacity 0.3s ease' }}
                  className="w-full bg-transparent text-xs text-[#131b2e] placeholder-[#6e797a] focus:outline-none font-medium"
                />
              </div>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="w-5 h-5 flex items-center justify-center rounded-full text-xs text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              ) : (
                <div className="flex items-center gap-1 text-[#3e494a]">
                  <button aria-label="Voice Search" className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#eaedff] transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-[#00676d]">mic</span>
                  </button>
                  <button aria-label="Barcode Scanner" className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#eaedff] transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-[#00676d]">barcode_scanner</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Address Search Modal */}
      <AddressSearchModal
        isOpen={showSearchAddress}
        onClose={() => setShowSearchAddress(false)}
        onSelectAddress={(selected, coords) => {
          setUserProfile((prev) => ({ ...prev, address: selected }));
          localStorage.setItem('cartcraze_user_selected_address', selected);
          if (coords) {
            setUserCoords(coords);
          }
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
