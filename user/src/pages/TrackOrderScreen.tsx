import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const TrackOrderScreen: React.FC = () => {
  const { currentOrder, setActiveTab } = useApp();
  const [riderOffsetStep, setRiderOffsetStep] = useState(0);
  const [itemsDrawerOpen, setItemsDrawerOpen] = useState(false);

  const riderOffsets = [
    { x: 0, y: 0 },
    { x: 4, y: -3 },
    { x: 8, y: -6 },
    { x: 12, y: -8 },
    { x: 16, y: -10 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRiderOffsetStep((prev) => (prev + 1) % riderOffsets.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const curOffset = riderOffsets[riderOffsetStep];
  const orderId = currentOrder?.id ? `#CC-${currentOrder.id.slice(0, 6).toUpperCase()}` : '#CC-928410';

  return (
    <div className="flex flex-col relative w-full pb-24 font-sans animate-fadeIn">
      {/* Top Map Container */}
      <div className="relative w-full h-[380px] overflow-hidden bg-[#e9f0f2]">
        {/* Vector Map Canvas */}
        <svg 
          className="absolute inset-0 w-full h-full object-cover" 
          fill="none" 
          preserveAspectRatio="xMidYMid slice" 
          viewBox="0 0 390 420" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Water body: Bellandur Lake */}
          <path d="M-20 40 C60 20 120 70 140 130 C155 175 110 210 70 230 C20 255 -30 220 -40 180 Z" fill="#cbe7eb" opacity="0.8" />
          {/* Green parks */}
          <path d="M220 30 C270 10 350 40 410 20 L420 180 C360 210 290 170 240 190 C190 210 180 140 190 90 Z" fill="#d7ecdf" opacity="0.6" />
          <path d="M110 310 C160 290 230 330 290 310 C350 290 390 350 420 380 L380 440 L80 440 Z" fill="#e2edde" opacity="0.7" />
          {/* Roads */}
          <path d="M-10 140 L410 110" stroke="#ffffff" strokeLinecap="round" strokeWidth="6" />
          <path d="M60 -10 L100 430" stroke="#ffffff" strokeLinecap="round" strokeWidth="7" />
          <path d="M260 -10 L230 430" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" />
          <path d="M180 110 L340 430" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" />
          <path d="M-10 330 C120 320 220 280 410 300" stroke="#ffffff" strokeLinecap="round" strokeWidth="6" />
          {/* ORR Corridor */}
          <path d="M40 380 C90 340 110 280 135 220 C160 160 210 120 310 90 L380 70" stroke="#ffffff" strokeLinecap="round" strokeWidth="12" />
          <path d="M40 380 C90 340 110 280 135 220 C160 160 210 120 310 90 L380 70" stroke="#f6f9fa" strokeLinecap="round" strokeWidth="8" />
          {/* Completed Segment */}
          <path d="M90 345 C115 285 138 230 172 175" opacity="0.3" stroke="#00828a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
          {/* Active Animated Dotted Route */}
          <path d="M172 175 C195 145 235 125 292 98 L318 88" stroke="#00676d" strokeDasharray="6 6" strokeLinecap="round" strokeWidth="4">
            <animate attributeName="stroke-dashoffset" dur="1.2s" from="48" repeatCount="indefinite" to="0" />
          </path>
          {/* Labels */}
          <text fill="#6e797a" fontFamily="Inter" fontSize="8" fontWeight="600" letterSpacing="1" transform="rotate(-62 145 270)" x="145" y="270">BELLANDUR MAIN RD</text>
          <text fill="#6e797a" fontFamily="Inter" fontSize="8" fontWeight="600" letterSpacing="0.8" transform="rotate(-15 210 105)" x="210" y="105">GREEN GLEN CORRIDOR</text>
          <text fill="#00828a" fontFamily="Inter" fontSize="8" fontWeight="700" opacity="0.7" x="12" y="150">BELLANDUR LAKE</text>
        </svg>

        {/* Floating Top Bar Inside Map */}
        <div className="absolute top-2 inset-x-0 px-3 flex items-center justify-between z-20">
          <button 
            aria-label="Go Back" 
            onClick={() => setActiveTab('home')}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#131b2e] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#006a48] animate-ping"></span>
            <span className="text-xs font-bold text-[#131b2e] tracking-tight">{orderId}</span>
          </div>

          <button 
            aria-label="Support" 
            onClick={() => alert('Connected with 24x7 CartCraze Support Desk!')}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#00676d] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
          </button>
        </div>

        {/* Floating ETA Pill */}
        <div className="absolute top-14 inset-x-0 flex justify-center px-4 z-20 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131b2e] shadow-xl text-white animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="material-symbols-outlined text-[16px] text-[#fb7800] animate-pulse">bolt</span>
            <span className="text-xs font-extrabold text-white tracking-wide">Delivering in 8 Mins</span>
            <span className="w-1 h-1 rounded-full bg-white/40"></span>
            <span className="text-[10px] text-white/90">Arriving by 3:42 PM</span>
          </div>
        </div>

        {/* Origin Marker (DarkStore #14) */}
        <div className="absolute top-[290px] left-[70px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="px-2 py-0.2 mb-0.5 rounded-full bg-[#00828a] text-white text-[9px] font-bold shadow-md whitespace-nowrap">
            DarkStore #14
          </div>
          <div className="w-7 h-7 rounded-full bg-[#00676d] flex items-center justify-center text-white shadow-md ring-2 ring-white">
            <span className="material-symbols-outlined text-[16px]">storefront</span>
          </div>
        </div>

        {/* Destination Marker (User Home) */}
        <div className="absolute top-[82px] left-[322px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-10 h-10 rounded-full bg-[#fb7800]/25 animate-ping"></span>
            <div className="relative w-8 h-8 rounded-full bg-[#fb7800] text-white flex items-center justify-center shadow-lg ring-2 ring-white">
              <span className="material-symbols-outlined text-[16px]">home</span>
            </div>
          </div>
          <div className="mt-0.5 px-2 py-0.2 rounded-full bg-white text-[#131b2e] text-[9px] font-bold shadow-md whitespace-nowrap">
            B-402, Green Glen
          </div>
        </div>

        {/* Moving Rider Marker */}
        <div 
          style={{ 
            transform: `translate(calc(-50% + ${curOffset.x}px), calc(-50% + ${curOffset.y}px))`,
            transition: 'transform 0.7s ease-out'
          }}
          className="absolute top-[160px] left-[176px] z-20 flex flex-col items-center"
        >
          <div className="flex items-center gap-1 px-2 py-0.5 mb-1 rounded-full bg-[#006a48] text-white text-[9px] font-extrabold shadow-lg">
            <span className="material-symbols-outlined text-[10px] animate-spin" style={{ animationDuration: '4s' }}>near_me</span>
            <span>3 mins away</span>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#00676d] p-0.5 shadow-xl ring-2 ring-white">
              <img 
                className="w-full h-full rounded-full object-cover" 
                alt="Vikram Singh" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXtHuOQcijdRtIYa_SeBmns8ZeftaKhr-zImMSRzXa1BSidG-gQp5z5MPJQZIAkrftWCpeRn-i-XMc3YRXTTsgLtnLPMMuwrDklpN5iFVg0vfA4YPCeRaBKJrCD5XQHJGKP49RKXt1Dgwowr20MvGHnc209LuM6aIzbj9l6KQw2K6fe2SroWroZBWX-ACbRyFm_ZcoDQXYHj6u-AvJO0hVabIBdVCycacy9jCxCZQHsKlZ68F1mnd5lA" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#fb7800] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[10px]">two_wheeler</span>
            </div>
          </div>
        </div>

        {/* Recenter Button */}
        <div className="absolute bottom-5 right-3 z-10">
          <button 
            aria-label="Recenter" 
            onClick={() => setRiderOffsetStep(0)}
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#131b2e] active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">my_location</span>
          </button>
        </div>
      </div>

      {/* Bottom Sheet Delivery Panel */}
      <div className="relative -mt-4 w-full bg-white rounded-t-3xl shadow-[0_-8px_24px_rgba(19,27,46,0.08)] px-4 pt-2 pb-8 z-30 flex flex-col gap-3.5 border-t border-[#eaedff]">
        {/* Handle */}
        <div className="self-center w-10 h-1 rounded-full bg-[#bdc9ca]/60 mt-0.5 mb-0.5"></div>

        {/* Live Status Header */}
        <div className="flex items-start justify-between gap-2 pt-0.5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006a48] animate-pulse"></span>
              <h2 className="text-base font-extrabold text-[#131b2e] tracking-tight">Rider is on the way!</h2>
            </div>
            <p className="text-xs text-[#6e797a] mt-0.5">
              Vikram Singh is <span className="font-semibold text-[#00676d]">1.2 km away</span> on an EV scooter
            </p>
          </div>
          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#005236]">
            ON TIME
          </span>
        </div>

        {/* 4-Stage Stepper */}
        <div className="w-full py-2 px-2 bg-[#f2f3ff] rounded-2xl">
          <div className="grid grid-cols-4 relative items-center gap-0">
            <div className="absolute top-[12px] left-[12%] right-[12%] h-1 bg-[#dae2fd] z-0"></div>
            <div className="absolute top-[12px] left-[12%] w-[58%] h-1 bg-[#006a48] z-0"></div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-6 h-6 rounded-full bg-[#006a48] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[13px] font-bold">check</span>
              </div>
              <span className="text-[10px] font-medium text-[#131b2e] mt-1">Placed</span>
              <span className="text-[8px] text-[#6e797a]">3:34 PM</span>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-6 h-6 rounded-full bg-[#006a48] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[13px] font-bold">check</span>
              </div>
              <span className="text-[10px] font-medium text-[#131b2e] mt-1">Packed</span>
              <span className="text-[8px] text-[#6e797a]">3:36 PM</span>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#00676d] text-white flex items-center justify-center shadow-md ring-2 ring-[#75d5de]">
                <span className="material-symbols-outlined text-[15px]">two_wheeler</span>
              </div>
              <span className="text-[10px] font-bold text-[#00676d] mt-1">On the Way</span>
              <span className="text-[8px] font-bold text-[#006a48]">3:39 PM</span>
            </div>

            <div className="flex flex-col items-center text-center relative z-10 opacity-50">
              <div className="w-6 h-6 rounded-full bg-[#dae2fd] text-[#6e797a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[13px]">home_pin</span>
              </div>
              <span className="text-[10px] font-medium text-[#131b2e] mt-1">Delivered</span>
              <span className="text-[8px] text-[#6e797a]">~3:42 PM</span>
            </div>
          </div>
        </div>

        {/* Rider Profile Card */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f2f3ff] gap-2 border border-[#eaedff]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img 
                className="w-11 h-11 rounded-full object-cover" 
                alt="Vikram Singh" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5UT8KoLt8wN-Fhd5Ra34Lz92KgJy6YJJ4UoCnTbfi5Xm6He_qLTEzjfC26uQFtx-4CINoWb_U_AymddfTuIK-LJyk5mWZnyDZx1QRpiBK91-TlNGST-GgcG-w2vVldhgBMgV10cbohksABU-NCFqW1fbl7HRR0Uu5XIFUlELwyuZpASZ4X_izOwv3AaOMxp27TkGbWBW-w9LJl87rEbziVur9CQal3kXum7PGOgwcppVwHRucjGH-8Q" 
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#006a48] flex items-center justify-center ring-2 ring-white">
                <span className="material-symbols-outlined text-[8px] text-white font-bold">verified</span>
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-bold text-[#131b2e] truncate">Vikram Singh</h3>
                <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-white text-[#131b2e] text-[10px] font-bold shadow-2xs">
                  <span className="material-symbols-outlined text-[10px] text-[#fb7800]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  4.9
                </span>
              </div>
              <p className="text-[10px] text-[#6e797a] truncate mt-0.5">1,420+ safe deliveries • Hero Partner</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[11px] text-[#006a48]">health_and_safety</span>
                <span className="text-[9px] text-[#006a48] font-bold tracking-tight">Vaccinated &amp; 98.4°F Checked</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={() => alert('Starting chat with delivery partner Vikram Singh...')}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#00676d] hover:bg-[#eaedff] active:scale-95 transition-all shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </button>
            <button 
              onClick={() => alert('Calling delivery partner Vikram Singh (+91 98765 43210)...')}
              className="w-9 h-9 rounded-full bg-[#00676d] flex items-center justify-center text-white hover:bg-[#00828a] active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
            </button>
          </div>
        </div>

        {/* Delivery Address & Directives */}
        <div className="p-2.5 rounded-2xl bg-[#f2f3ff] flex flex-col gap-1.5 border border-[#eaedff]">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[#fb7800] text-[16px] mt-0.5">location_on</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#131b2e]">Delivering to Home</span>
                <p className="text-[10px] text-[#6e797a] leading-tight">
                  Flat B-402, 4th Floor, Green Glen Heights, Bellandur, Bengaluru - 560103
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#131b2e] text-[10px] font-medium shadow-2xs shrink-0">
              <span className="material-symbols-outlined text-[12px] text-[#00676d]">door_front</span>
              <span>Leave at door</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#131b2e] text-[10px] font-medium shadow-2xs shrink-0">
              <span className="material-symbols-outlined text-[12px] text-[#fb7800]">notifications_off</span>
              <span>Don't ring bell</span>
            </div>
          </div>
        </div>

        {/* Order Items Drawer */}
        <div 
          onClick={() => setItemsDrawerOpen(!itemsDrawerOpen)}
          className="rounded-2xl bg-[#f2f3ff] p-2.5 flex flex-col gap-1 cursor-pointer hover:bg-[#eaedff] transition-colors border border-[#eaedff]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#00676d] shrink-0 shadow-2xs">
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#131b2e] truncate">3 Items in this bag</span>
                <span className="text-[10px] text-[#6e797a] truncate">Amul Taaza Milk, Tata Salt, Alphonso Mangoes</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs font-extrabold text-[#131b2e]">₹373.50</span>
              <span className="material-symbols-outlined text-[16px] text-[#6e797a]">
                {itemsDrawerOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </div>
          </div>

          {itemsDrawerOpen && (
            <div className="pt-2 border-t border-[#dae2fd]/50 text-[10px] text-[#6e797a] space-y-1">
              <div className="flex justify-between"><span>Amul Taaza Milk (500ml x 2)</span><span>₹56.00</span></div>
              <div className="flex justify-between"><span>Tata Salt (1kg x 1)</span><span>₹28.00</span></div>
              <div className="flex justify-between"><span>Alphonso Mangoes (Pack of 6)</span><span>₹289.50</span></div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 text-[10px] text-[#6e797a]">
            <span className="flex items-center gap-1 text-[#006a48] font-bold">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              Paid via UPI (Google Pay)
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                alert('Tax Invoice downloaded!');
              }}
              className="text-[#00676d] font-bold hover:underline"
            >
              Download Invoice
            </button>
          </div>
        </div>

        {/* Safety Footer */}
        <div className="flex items-center justify-between pt-1 px-1">
          <button 
            onClick={() => alert('Opening live chat with support agent...')}
            className="flex items-center gap-1 text-[10px] text-[#6e797a] hover:text-[#00676d] transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">live_help</span>
            <span>Need help with this delivery?</span>
          </button>
          <span className="text-[9px] text-[#6e797a] uppercase font-bold tracking-wider">100% Contactless</span>
        </div>
      </div>
    </div>
  );
};
