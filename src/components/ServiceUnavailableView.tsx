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
  const rawAddr = userProfile.address || 'Sector 6, Patia, Bhubaneswar, 751024';
  const pinMatch = rawAddr.match(/\b\d{6}\b/);
  const locationPincode = pinMatch ? pinMatch[0] : '751024';
  const addrParts = rawAddr.split(',').map((s) => s.trim()).filter(Boolean);
  const locationAreaName = addrParts.length >= 2 
    ? `${addrParts[0]}, ${addrParts[1]}` 
    : (addrParts[0] || 'Patia, Bhubaneswar');

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

  return (
    <div className="flex flex-col w-full pb-6 bg-[#f4fbf4] min-h-full animate-fadeIn">
      <div className="flex flex-col w-full px-4 pb-8 space-y-4">
        
        {/* ── Top Notice Banner ── */}
        <div className="w-full bg-[#ffdad6]/80 text-[#93000a] rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center flex-shrink-0 text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#ba1a1a]">Currently Unavailable</p>
            <p className="text-xs text-[#3c4a42] truncate">Deliveries are temporarily paused at this pin code.</p>
          </div>
        </div>

        {/* ── Hero Illustration ── */}
        <div className="flex flex-col items-center text-center pt-1 w-full">
          <div className="relative w-44 h-44 flex items-center justify-center mb-3">
            <div className="absolute inset-2 rounded-full bg-[#10b981]/10 blur-xl"></div>
            <div className="relative w-40 h-40 rounded-full bg-[#eef6ee] flex items-center justify-center shadow-sm overflow-hidden">
              <img 
                alt="Location pin and scooter illustration" 
                className="w-36 h-36 object-contain drop-shadow-md" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3KAXVB5BjtKj1raA-5Q25cZ30LBPbElaAsqy7gzpyGoV9P-YH0B8aDkUHfyTCoUlMkA3EGtwzAOh7twFllJxXTkUMkT7oXYP7wOb3dAIN-1QgNuDOFODXd3A5DkpclkHRAqzuN3z8kUk-cB3Kx9nwn9H5t0nEzIlZ19KLjIgy5CTXKIZgZ47DtdSOh5MTdFmdEesWTN9xE-0EFcyJX_9EEuWFiXolw7fRQiz9sxzePcX5BFi07Tns"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/service-unavailable-scooter.png';
                }}
              />
            </div>
            <div className="absolute bottom-1 right-3 bg-[#ba1a1a] text-white rounded-full p-1 shadow-md flex items-center justify-center ring-2 ring-white">
              <span className="material-symbols-outlined text-[18px]">location_off</span>
            </div>
          </div>

          {/* Badge + Headline + Description */}
          <span className="text-[10px] font-black uppercase text-[#ba1a1a] tracking-[0.08em] mb-1 px-2.5 py-1 bg-[#ffdad6]/60 rounded-full">
            Service Area Update
          </span>
          <h1 className="text-xl font-black text-[#161d19] mb-1 tracking-tight">
            We are not in your area yet!
          </h1>
          <p className="text-sm text-[#3c4a42] mb-4 leading-relaxed px-2">
            CartCraze quick 15-minute grocery and essentials delivery isn't live in{' '}
            <strong className="text-[#161d19] font-semibold">{locationAreaName}</strong>{' '}
            just yet. We are expanding rapidly!
          </p>

          {/* ── CTA Buttons ── */}
          <div className="w-full space-y-2">
            <button 
              className={`w-full h-12 ${
                isNotified 
                  ? 'bg-[#10b981]/20 text-[#006c49]' 
                  : 'bg-[#006c49] text-white'
              } rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer`}
              onClick={toggleNotify}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isNotified ? 'check_circle' : 'notifications_active'}
              </span>
              <span>
                {isNotified ? "We'll Notify You!" : 'Notify Me When Available'}
              </span>
            </button>

            <button 
              className="w-full h-12 bg-[#e8f0e9] text-[#161d19] rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all cursor-pointer" 
              onClick={() => {
                if (onSearchNewAddress) onSearchNewAddress();
                else setShowSearchModal(true);
              }}
            >
              <span className="material-symbols-outlined text-[20px] text-[#006c49]">edit_location_alt</span>
              <span>Change Location / Select Address</span>
            </button>
          </div>
        </div>

        {/* ── Saved Addresses Quick Switcher ── */}
        <div className="w-full pt-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-[#161d19]">Deliver to another saved address</h2>
            <span className="text-[10px] font-black text-[#006c49] tracking-wide">3 SAVED</span>
          </div>

          <div className="space-y-2">
            {/* Home (Current & Unserviceable) */}
            <div className="w-full p-3 bg-[#eef6ee] rounded-xl flex items-start justify-between gap-2 opacity-90">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#dde4dd] flex items-center justify-center flex-shrink-0 text-[#3c4a42] mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">home</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-sm font-bold text-[#161d19] truncate">Home</span>
                    <span className="text-[10px] font-black text-[#3c4a42] bg-[#dde4dd] px-1.5 py-0.5 rounded">Current</span>
                  </div>
                  <p className="text-xs text-[#3c4a42] truncate">{rawAddr}</p>
                  <div className="mt-1 inline-flex items-center gap-1 text-[#ba1a1a] bg-[#ffdad6]/70 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                    <span className="text-[10px] font-bold">Unserviceable</span>
                  </div>
                </div>
              </div>
              <div className="h-full flex items-center pt-2">
                <span className="material-symbols-outlined text-[#bbcabf] text-[20px]">radio_button_checked</span>
              </div>
            </div>

            {/* Store #01 Jaydev Vihar (Serviceable Hub) */}
            <div 
              onClick={() => switchToAddress(
                'Store #01 Jaydev Vihar',
                20.3015,
                85.8240,
                'Jaydev Vihar Square, Bhubaneswar, Odisha 751015'
              )}
              className="w-full p-3 bg-white border border-[#bbcabf]/50 hover:border-[#10b981] rounded-xl flex items-start justify-between gap-2 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#10b981]/15 flex items-center justify-center flex-shrink-0 text-[#006c49] mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-sm font-bold text-[#161d19] truncate">Store #01 Jaydev Vihar</span>
                    <span className="text-[10px] font-black text-[#006c49] bg-[#10b981]/20 px-1.5 py-0.5 rounded">Operational Hub</span>
                  </div>
                  <p className="text-xs text-[#3c4a42] truncate">Jaydev Vihar Square, Bhubaneswar, 751015</p>
                  <div className="mt-1 inline-flex items-center gap-1 text-[#006c49] bg-[#10b981]/20 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span className="text-[10px] font-bold">Available (15-20m)</span>
                  </div>
                </div>
              </div>
              <div className="h-full flex items-center pt-2">
                <span className="text-xs font-bold text-[#006c49] bg-[#e8f0e9] px-2.5 py-1 rounded-full hover:bg-[#10b981]/20 transition">
                  Switch
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Neighborhood Vote Card ── */}
        <div className="w-full p-3 bg-gradient-to-br from-[#e8f0e9] to-[#e3eae3] rounded-xl">
          <div className="flex items-start gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#e29100]/20 text-[#855300] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">how_to_vote</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-[#161d19]">Want CartCraze in your area?</span>
                <span className="inline-flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-full text-[#161d19] font-bold text-xs shadow-sm">
                  <span className="material-symbols-outlined text-[14px] text-[#855300]">how_to_reg</span>
                  <span>{voteCount.toLocaleString()}</span>
                </span>
              </div>
              <p className="text-xs text-[#3c4a42] mb-3 leading-snug">
                Vote for your pin code to help us prioritize our next dark store launch in {locationAreaName}.
              </p>
              <button 
                className={`w-full h-10 ${
                  hasVoted 
                    ? 'bg-[#006c49] text-white' 
                    : 'bg-white text-[#006c49]'
                } rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer`}
                onClick={handleVote}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {hasVoted ? 'celebration' : 'thumb_up'}
                </span>
                <span>
                  {hasVoted ? 'Vote Recorded! Thanks' : `Vote for ${locationAreaName} (${locationPincode})`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Delivery Promise Badge ── */}
        <div className="w-full flex items-center justify-center gap-3 py-2 text-[#3c4a42] opacity-80">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">electric_moped</span>
            <span className="text-[10px] font-black uppercase tracking-[0.08em]">15-Min Delivery</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#bbcabf]"></div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">eco</span>
            <span className="text-[10px] font-black uppercase tracking-[0.08em]">Fresh Produce</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#bbcabf]"></div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">verified</span>
            <span className="text-[10px] font-black uppercase tracking-[0.08em]">Hygiene Packed</span>
          </div>
        </div>
      </div>

      {/* ── Toast Notification on Address Switch ── */}
      {switchedToast && (
        <div className="fixed bottom-20 left-4 right-4 bg-[#161d19] text-[#f4fbf4] rounded-xl p-3 flex items-center justify-between shadow-xl z-50 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6ffbbe]">check_circle</span>
            <span className="text-sm">Switched to <strong>{switchedToast}</strong></span>
          </div>
          <span className="text-[10px] font-black uppercase text-[#6ffbbe]">Ready to Order</span>
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
