import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const OrderConfirmedScreen: React.FC = () => {
  const { currentOrder, setActiveTab } = useApp();
  const [copiedToast, setCopiedToast] = useState(false);
  const [rewardRevealed, setRewardRevealed] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti on mount
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00828a', '#fb7800', '#6ffbbe', '#ffb68b', '#00676d']
      });
    } catch {
      // ignore
    }
  }, []);

  const orderId = currentOrder?.id ? `#CC-${currentOrder.id.slice(0, 6).toUpperCase()}` : '#CC-928410';

  const copyOrderId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(orderId).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2000);
      });
    } else {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleRevealReward = () => {
    setRewardRevealed(true);
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#fb7800', '#00676d', '#6ffbbe', '#ffd700']
      });
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CartCraze Instant Delivery',
        text: `Just placed my grocery order in 11 minutes on CartCraze! ⚡ Order ${orderId}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert('Savings link copied to share with friends!');
    }
  };

  return (
    <div className="flex flex-col w-full pb-32 px-4 gap-3 font-sans animate-fadeIn select-none pt-3">
      {/* 1. Top Celebrations Section */}
      <div className="flex flex-col items-center text-center mt-1 relative">
        {/* Pulsing Success Ring */}
        <div className="relative flex items-center justify-center my-2">
          <span className="absolute w-24 h-24 rounded-full bg-[#00676d]/20 animate-ping opacity-75"></span>
          <span className="absolute w-20 h-20 rounded-full bg-[#00676d]/10"></span>
          <div className="relative w-16 h-16 rounded-full bg-[#00676d] text-white flex items-center justify-center shadow-lg transform transition-transform active:scale-95 duration-200">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>
              check_circle
            </span>
          </div>
        </div>

        {/* Headlines */}
        <h2 className="text-xl font-extrabold text-[#131b2e] tracking-tight mt-1">
          Order Placed Successfully!
        </h2>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[#006a48] text-[18px]">bolt</span>
          <p className="text-xs text-[#006a48] font-bold">
            Arriving in 11 mins <span className="font-normal text-[#6e797a]">• Est. 03:42 PM</span>
          </p>
        </div>

        {/* Order ID Interactive Chip */}
        <div className="mt-2.5 inline-flex items-center gap-2 bg-[#f2f3ff] py-1 px-3.5 rounded-full shadow-2xs">
          <span className="text-[10px] text-[#6e797a]">Order ID</span>
          <span className="text-xs font-bold text-[#131b2e] tracking-wide">{orderId}</span>
          <button 
            aria-label="Copy Order ID" 
            onClick={copyOrderId}
            className="flex items-center text-[#00676d] hover:text-[#00828a] active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[15px]">content_copy</span>
          </button>
          {copiedToast && (
            <span className="text-[9px] bg-[#00676d] text-white px-1.5 py-0.2 rounded-full animate-fadeIn font-extrabold">
              Copied!
            </span>
          )}
        </div>
      </div>

      {/* 2. Dark-Store Dispatch Card & Stepper Tracker */}
      <div className="bg-white rounded-2xl p-3.5 shadow-2xs flex flex-col gap-3 border border-[#eaedff]">
        <div className="flex items-start gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#00676d] shrink-0">
            <span className="material-symbols-outlined text-[22px]">storefront</span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-extrabold uppercase text-[#00676d] tracking-wider">Fast Dispatch Hub</span>
            <p className="text-xs font-bold text-[#131b2e] truncate">CartCraze Dark Store #14</p>
            <p className="text-[10px] text-[#6e797a] truncate">Bellandur East, Cluster B-3</p>
          </div>
        </div>

        {/* 4-Stage Preparation Progress Stepper */}
        <div className="py-1">
          <div className="relative flex items-center justify-between">
            {/* Background Track */}
            <div className="absolute left-3 right-3 top-3 h-1 bg-[#dae2fd] rounded-full z-0"></div>
            {/* Active Fill */}
            <div className="absolute left-3 w-1/3 top-3 h-1 bg-[#00676d] rounded-full z-0"></div>

            {/* Step 1: Placed */}
            <div className="flex flex-col items-center gap-1 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#00676d] text-white flex items-center justify-center shadow-xs text-xs">
                <span className="material-symbols-outlined text-[15px]">done</span>
              </div>
              <span className="text-[10px] text-[#131b2e] font-semibold text-center">Placed</span>
            </div>

            {/* Step 2: Packing (Active Pulsing) */}
            <div className="flex flex-col items-center gap-1 relative z-10">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-[#fb7800]/30 animate-ping"></span>
                <div className="w-7 h-7 rounded-full bg-[#fb7800] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[15px]">inventory_2</span>
                </div>
              </div>
              <span className="text-[10px] text-[#fb7800] font-bold text-center">Packing</span>
            </div>

            {/* Step 3: Pickup */}
            <div className="flex flex-col items-center gap-1 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#f2f3ff] text-[#6e797a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px]">two_wheeler</span>
              </div>
              <span className="text-[10px] text-[#6e797a] text-center">Pickup</span>
            </div>

            {/* Step 4: Delivery */}
            <div className="flex flex-col items-center gap-1 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#f2f3ff] text-[#6e797a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px]">home_pin</span>
              </div>
              <span className="text-[10px] text-[#6e797a] text-center">Delivery</span>
            </div>
          </div>
        </div>

        {/* Rider Allocation Teaser Banner */}
        <div className="bg-[#f2f3ff] rounded-xl p-2.5 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fb7800] animate-pulse shrink-0"></span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#131b2e] font-bold truncate">Assigning nearest CartCraze delivery hero...</p>
            <p className="text-[9px] text-[#6e797a] leading-3">Live speed telemetry will unlock once picked</p>
          </div>
          <span className="material-symbols-outlined text-[#6e797a] text-[18px]">near_me</span>
        </div>
      </div>

      {/* 3. Gamified Reward (Scratch & Win CrazeCard) */}
      <div className="bg-white rounded-2xl p-3.5 shadow-2xs relative overflow-hidden border border-[#eaedff]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#fb7800] text-[20px]">stars</span>
            <h3 className="text-xs font-bold text-[#131b2e]">CrazeCard Reward</h3>
          </div>
          <span className="text-[8px] font-extrabold bg-[#ffdbc8] text-[#994700] px-2 py-0.5 rounded-full">
            {rewardRevealed ? 'CLAIMED' : 'UNCLAIMED'}
          </span>
        </div>
        <p className="text-[11px] text-[#6e797a] mb-2.5">
          Scratch or tap to reveal guaranteed cashback on your next instant delivery!
        </p>

        {/* Card Widget */}
        <div 
          onClick={handleRevealReward}
          className="cursor-pointer relative w-full h-24 rounded-2xl overflow-hidden bg-gradient-to-r from-[#00828a] via-[#00676d] to-[#00828a] text-white flex items-center justify-center shadow-inner transition-all duration-300"
        >
          {rewardRevealed ? (
            <div className="absolute inset-0 bg-[#e2e7ff] flex flex-col items-center justify-center p-2 text-center animate-fadeIn">
              <div className="flex items-center gap-0.5 text-[#fb7800]">
                <span className="material-symbols-outlined text-[24px]">currency_rupee</span>
                <span className="text-2xl font-black text-[#fb7800]">75</span>
              </div>
              <p className="text-xs font-bold text-[#131b2e]">Cashback Added to CrazePay!</p>
              <span className="text-[9px] text-[#6e797a]">Auto-applies on next cart of min. ₹199</span>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-gradient-to-tr from-[#00676d] to-[#00828a] text-white p-2">
              <span className="material-symbols-outlined text-[24px] animate-bounce">redeem</span>
              <span className="text-xs font-extrabold tracking-wide">TAP TO SCRATCH</span>
              <span className="text-[9px] text-[#f9ffff] opacity-90">Win up to ₹100 Cashback</span>
            </div>
          )}
        </div>

        {/* Social Share Trigger */}
        <div className="mt-2.5 pt-1.5 flex items-center justify-between bg-[#f2f3ff] p-2 rounded-xl">
          <div className="flex items-center gap-1.5 min-w-0 pr-2">
            <span className="material-symbols-outlined text-[#006a48] text-[18px] shrink-0">volunteer_activism</span>
            <p className="text-[10px] text-[#131b2e] truncate font-medium">Saved 15 mins of grocery hassle today!</p>
          </div>
          <button 
            onClick={handleShare}
            className="shrink-0 bg-white text-[#00676d] text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span>SHARE</span>
            <span className="material-symbols-outlined text-[13px]">share</span>
          </button>
        </div>
      </div>

      {/* 4. Order Summary Snapshot */}
      <div className="bg-white rounded-2xl p-3.5 shadow-2xs flex flex-col gap-2.5 border border-[#eaedff]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#131b2e]">Order Summary</h3>
          <span className="text-[9px] font-extrabold bg-[#006a48] text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[11px]">savings</span>
            SAVED ₹285.00
          </span>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-1.5 text-xs text-[#131b2e]">
          <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <img className="w-8 h-8 rounded-lg object-contain bg-[#f2f3ff] shrink-0" alt="Amul Milk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACRCaRdh4ESS69tUovO3e8bUGVcJQ2eJKXUcMHiJoAcHw-yYBJDf9LPjtwP21x8NBgOjbAe_eBdm1XL7gv_P8zkkdMUueZNdGS3dcK-ty9__mAZAykKcN7aB4qnr9VBjlzlDi-dZ8PR4VHQ87KzqZ6j-ykH-u_du9BvRVQ1jutQDD9kgQo9_prgTM9pKgF47knLS4fSID0NbgSum0WIYsMi4luqHXZBNANbuKcmRhpKqykHQ1Si4rBpQ" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold truncate">Amul Taaza Toned Milk</p>
                <p className="text-[9px] text-[#6e797a]">500 ml • Qty: 2</p>
              </div>
            </div>
            <span className="text-xs font-bold">₹56.00</span>
          </div>

          <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <img className="w-8 h-8 rounded-lg object-contain bg-[#f2f3ff] shrink-0" alt="Tata Salt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVmLYJi2HpqI87RuCh8RuZm1LuTIqYjkUDIZ3arR82vZt_6oAWXRY8fKqCuej1Daqf0TDxl7bmXPFBRT4eoq-rZPHPjI454FTbv6Lm8P_YTvDmBmgv2qsodIwqNYjUq-ASnx_lvxs5HZ2qdU9PRqrJBwzA9n_3ITTeIbc7HZCX4NdEAbW9mWc9fF_XpzFfgDCR_bywJsNjzIzdw2Gm3X98KJ5cCVLvgskr8KAUGqLvpuOTpq5CnctyxQ" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold truncate">Tata Salt Vacuum Evaporated</p>
                <p className="text-[9px] text-[#6e797a]">1 kg • Qty: 1</p>
              </div>
            </div>
            <span className="text-xs font-bold">₹28.00</span>
          </div>
        </div>

        {/* Payment and address */}
        <div className="bg-[#f2f3ff] rounded-xl p-2.5 flex flex-col gap-1 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-[#6e797a] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#00676d]">account_balance_wallet</span>
              Paid via UPI (Google Pay)
            </span>
            <span className="text-xs font-black text-[#131b2e]">₹373.50</span>
          </div>
          <div className="flex items-start gap-1 pt-0.5">
            <span className="material-symbols-outlined text-[14px] text-[#6e797a] shrink-0 mt-0.5">location_on</span>
            <p className="text-[10px] text-[#6e797a] leading-tight">
              Delivering to: <span className="text-[#131b2e] font-semibold">B-402, Green Glen Heights, Bellandur, Bengaluru</span>
            </p>
          </div>
        </div>
      </div>

      {/* 5. Interactive Action CTAs */}
      <div className="flex flex-col gap-2 mt-1">
        <button 
          onClick={() => setActiveTab('track_order')}
          className="w-full bg-[#00676d] hover:bg-[#00828a] text-white py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00676d]/20 active:scale-[0.98] transition-all"
        >
          <span>Track Live Delivery</span>
          <span className="material-symbols-outlined text-[18px] text-[#ffb68b] animate-pulse">bolt</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => alert('Tax Invoice PDF downloaded successfully!')}
            className="w-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Tax Invoice</span>
          </button>
          <button 
            onClick={() => setActiveTab('home')}
            className="w-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            <span>Order More</span>
          </button>
        </div>
      </div>
    </div>
  );
};
