import React from 'react';
import { useApp } from '../context/AppContext';

export const AccountScreen: React.FC = () => {
  const { userProfile, setActiveTab } = useApp();

  return (
    <div className="flex flex-col w-full pb-32 px-4 space-y-3 font-sans animate-fadeIn pt-3">
      {/* 1. User Profile Header Card */}
      <section className="bg-white p-3.5 rounded-2xl shadow-2xs flex items-center justify-between border border-[#eaedff]">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative">
            <img 
              className="w-12 h-12 rounded-full object-cover shadow-2xs ring-2 ring-[#00676d]/20" 
              alt="Rahul Sharma" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5NAkgp160fOakijtlBMCZonhczXBKLqk60JWNHchuqnM-GBe8SRO7_4savRssQ_2zUmx4cfIcHEJM_EwJz7tv48QZ_kzdLCOfxBlwD0qQouAe_0jEdqSlezpvImlq7FnI-N_zkgpCIVbHxxlI7EngnS4DGo9MpU7C6CGWX9slKwq48BRYqYd6CZ0M1bn8D1yasrkMtHmMo7t7ikDwmC_ylKf6dZP74IlSCVwc2BifIMT_P1lZDN5Ang" 
            />
            <div className="absolute -bottom-1 -right-1 bg-[#00676d] text-white rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-extrabold text-[#131b2e] truncate">{userProfile.name || 'Rahul Sharma'}</h2>
              <span className="bg-[#00676d]/15 text-[#00676d] text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#6e797a] truncate">{userProfile.phone || '+91 98765 43210'}</p>
          </div>
        </div>

        <button 
          aria-label="Edit Profile" 
          onClick={() => alert('Editing profile info...')}
          className="bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors w-8 h-8 rounded-full flex items-center justify-center text-[#131b2e] shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
        </button>
      </section>

      {/* 2. CartCraze Club Member VIP Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00828a] via-[#006e75] to-[#fb7800] text-white p-3.5 shadow-md">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex justify-between items-start mb-2 relative z-10">
          <div className="flex items-center space-x-1.5">
            <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center space-x-1">
              <span className="material-symbols-outlined text-[12px] text-amber-300" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="text-[8px] font-extrabold tracking-wide uppercase">VIP Club</span>
            </div>
            <span className="text-[10px] text-white/90 font-medium">Free Delivery Active</span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-white/80">workspace_premium</span>
        </div>
        <div className="relative z-10 mb-3">
          <h3 className="text-sm font-bold leading-tight">CartCraze Club Member</h3>
          <p className="text-[10px] text-white/90 mt-0.5">Saved ₹2,450 this month with ₹0 delivery fees</p>
        </div>

        {/* CrazeCoins */}
        <div className="relative z-10 bg-black/20 backdrop-blur-md rounded-xl p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#ffdbc8] flex items-center justify-center text-[#994700] shadow-xs">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            </div>
            <div>
              <p className="text-[8px] text-white/80 uppercase font-bold">CrazeCoins</p>
              <p className="text-xs font-black leading-none">840 pts</p>
            </div>
          </div>
          <button 
            onClick={() => alert('840 CrazeCoins redeemed for ₹84 discount voucher!')}
            className="bg-white text-[#00676d] text-[10px] font-extrabold px-3 py-1 rounded-full shadow hover:bg-white/90 active:scale-95 transition-transform flex items-center space-x-0.5"
          >
            <span>Redeem</span>
            <span className="material-symbols-outlined text-[12px]">bolt</span>
          </button>
        </div>
      </section>

      {/* 3. Orders & Reorders Group */}
      <section className="bg-white rounded-2xl shadow-2xs p-1.5 space-y-0.5 border border-[#eaedff]">
        <div className="px-3 pt-2 pb-1">
          <h4 className="text-[9px] font-extrabold text-[#6e797a] uppercase tracking-wider">Orders &amp; Reorders</h4>
        </div>
        <div 
          onClick={() => setActiveTab('track_order')}
          className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#00676d]/10 flex items-center justify-center text-[#00676d] shrink-0">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">My Orders</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006a48] animate-ping"></span>
                <span className="text-[10px] text-[#006a48] font-bold truncate">1 Active Order in transit (ETA 8 mins)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 shrink-0 pl-1">
            <span className="bg-[#006a48] text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full">TRACK</span>
            <span className="material-symbols-outlined text-[16px] text-[#6e797a]">chevron_right</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <span className="material-symbols-outlined text-[18px]">repeat</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Frequently Ordered</p>
              <p className="text-[10px] text-[#6e797a] truncate">Amul Taaza, Tata Salt, Alphonso Mangoes</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#6e797a] shrink-0">chevron_right</span>
        </div>
      </section>

      {/* 4. Wallet & Payments Group */}
      <section className="bg-white rounded-2xl shadow-2xs p-1.5 space-y-0.5 border border-[#eaedff]">
        <div className="px-3 pt-2 pb-1">
          <h4 className="text-[9px] font-extrabold text-[#6e797a] uppercase tracking-wider">Wallet &amp; Payments</h4>
        </div>
        <div className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#fb7800]/10 flex items-center justify-center text-[#fb7800] shrink-0">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">CartCraze Wallet</p>
              <p className="text-[10px] text-[#6e797a]">Balance: <span className="font-bold text-[#131b2e]">₹350.00</span></p>
            </div>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            <span className="text-[#fb7800] text-[10px] font-extrabold px-2 py-0.5 bg-[#fb7800]/10 rounded-full">+ Add</span>
            <span className="material-symbols-outlined text-[16px] text-[#6e797a]">chevron_right</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Saved Cards &amp; UPI</p>
              <p className="text-[10px] text-[#6e797a] truncate">Google Pay • HDFC Bank ••4012</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#6e797a] shrink-0">chevron_right</span>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Refund Status</p>
              <p className="text-[10px] text-[#006a48] font-semibold truncate">All refunds settled (₹89 to UPI)</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#6e797a] shrink-0">chevron_right</span>
        </div>
      </section>

      {/* 5. Addresses & Preferences Group */}
      <section className="bg-white rounded-2xl shadow-2xs p-1.5 space-y-0.5 border border-[#eaedff]">
        <div className="px-3 pt-2 pb-1">
          <h4 className="text-[9px] font-extrabold text-[#6e797a] uppercase tracking-wider">Addresses &amp; Settings</h4>
        </div>
        <div className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#00676d]/10 flex items-center justify-center text-[#00676d] shrink-0">
              <span className="material-symbols-outlined text-[18px]">home_pin</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1">
                <p className="text-xs font-bold text-[#131b2e]">Saved Addresses</p>
                <span className="bg-[#f2f3ff] px-1 py-0.2 rounded text-[8px] font-bold text-[#6e797a]">2</span>
              </div>
              <p className="text-[10px] text-[#6e797a] truncate">Home (Bellandur), Work (Prestige Tech)</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#6e797a] shrink-0">chevron_right</span>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <span className="material-symbols-outlined text-[18px]">room_service</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Delivery Instructions</p>
              <p className="text-[10px] text-[#6e797a] truncate">Leave at door • Don't ring bell</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#6e797a] shrink-0">chevron_right</span>
        </div>
      </section>

      {/* 6. Perks & Rewards Group */}
      <section className="bg-white rounded-2xl shadow-2xs p-1.5 space-y-0.5 border border-[#eaedff]">
        <div className="px-3 pt-2 pb-1">
          <h4 className="text-[9px] font-extrabold text-[#6e797a] uppercase tracking-wider">Perks &amp; Rewards</h4>
        </div>
        <div className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#fb7800]/10 flex items-center justify-center text-[#fb7800] shrink-0">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Coupons &amp; Offers</p>
              <p className="text-[10px] text-[#6e797a] truncate">5 active coupons ready to apply</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            <span className="bg-[#fb7800] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">5 NEW</span>
            <span className="material-symbols-outlined text-[16px] text-[#6e797a]">chevron_right</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#00676d]/10 flex items-center justify-center text-[#00676d] shrink-0">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Refer &amp; Earn ₹150</p>
              <p className="text-[10px] text-[#6e797a] truncate">Give ₹100 to friends, get ₹150 wallet cash</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#6e797a] shrink-0">chevron_right</span>
        </div>
      </section>

      {/* 7. Support & Preferences */}
      <section className="bg-white rounded-2xl shadow-2xs p-1.5 space-y-0.5 border border-[#eaedff]">
        <div className="px-3 pt-2 pb-1">
          <h4 className="text-[9px] font-extrabold text-[#6e797a] uppercase tracking-wider">Help &amp; Preferences</h4>
        </div>
        <div 
          onClick={() => alert('Starting live support chat with CartCraze Desk...')}
          className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">24x7 Customer Support</p>
              <p className="text-[10px] text-[#6e797a] truncate">Instant chat with live delivery executive</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#6e797a] shrink-0">chevron_right</span>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <span className="material-symbols-outlined text-[18px]">translate</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">App Language</p>
              <p className="text-[10px] text-[#6e797a]">English</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            <span className="text-[10px] text-[#6e797a] font-medium">English</span>
            <span className="material-symbols-outlined text-[16px] text-[#6e797a]">chevron_right</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Notifications</p>
              <p className="text-[10px] text-[#6e797a] truncate">Order updates, SMS, WhatsApp</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#6e797a] shrink-0">chevron_right</span>
        </div>
      </section>

      {/* 8. Logout & Version */}
      <div className="flex flex-col items-center justify-center pt-1 pb-4 space-y-1">
        <button 
          onClick={() => alert('Logged out successfully!')}
          className="flex items-center justify-center space-x-1.5 text-[#ba1a1a] py-2 px-6 hover:bg-[#ffdad6]/40 rounded-full transition-colors active:scale-95 text-xs font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Log Out</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] text-[#6e797a]">CartCraze Hyperlocal v2.4.1 (Build 108)</p>
          <p className="text-[8px] text-[#6e797a]/70 uppercase tracking-widest mt-0.5 font-bold">Crafted for Instant Joy</p>
        </div>
      </div>
    </div>
  );
};
