import React, { useState } from 'react';
import type { RiderProfile, AppTab } from '../App';
import { 
  Award, 
  Bike, 
  CreditCard, 
  BarChart3, 
  LogOut, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Radio, 
  Sparkles,
  MapPin,
  Zap,
  PhoneCall,
  Bell,
  Settings,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  Wallet
} from 'lucide-react';

interface Props {
  riderProfile: RiderProfile;
  setRiderProfile: React.Dispatch<React.SetStateAction<RiderProfile>>;
  setActiveTab: (tab: AppTab) => void;
  onReRegister?: () => void;
}

export const ProfileScreen: React.FC<Props> = ({
  riderProfile,
  setRiderProfile,
  setActiveTab,
  onReRegister,
}) => {
  const [isOnline, setIsOnline] = useState(true);

  const handleLogout = () => {
    setRiderProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const riderPhotoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 font-sans pb-32 animate-fadeIn selection:bg-amber-200">
      
      {/* 1. ULTRA-PREMIUM GOLDEN HERO CURVED HEADER */}
      <div className="relative bg-gradient-to-b from-[#FFC700] via-[#FFB800] to-[#F5A600] pt-6 pb-20 px-5 rounded-b-[40px] shadow-lg overflow-hidden">
        {/* Ambient Decorative Shapes */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-amber-700/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Actions */}
        <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-sm shadow-xl">
              CC
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#423100] uppercase block">CartCraze Rider</span>
              <h1 className="text-lg font-black text-slate-950 tracking-tight leading-none">Partner Profile</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              className="p-2.5 rounded-2xl bg-white/40 hover:bg-white/60 backdrop-blur-md text-slate-950 transition cursor-pointer border border-white/40 relative shadow-sm"
            >
              <Bell className="w-5 h-5 text-slate-950" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
            </button>
            <button 
              type="button"
              className="p-2.5 rounded-2xl bg-white/40 hover:bg-white/60 backdrop-blur-md text-slate-950 transition cursor-pointer border border-white/40 shadow-sm"
            >
              <SlidersHorizontal className="w-5 h-5 text-slate-950" />
            </button>
          </div>
        </div>

        {/* Profile Info Bar Inside Hero */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-3xl p-1 bg-white shadow-2xl overflow-hidden">
              <img
                src={riderPhotoUrl}
                alt={riderProfile.name || 'Rider Partner'}
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-950 tracking-tight">{riderProfile.name || 'Rider Partner'}</h2>
              <span className="bg-slate-950 text-amber-400 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Gold Tier</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#423100]">
              <Bike className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{riderProfile.vehicleNumber || 'Electric Scooter • Active'}</span>
            </div>

            <p className="text-xs text-[#523d00] font-mono font-medium">
              Phone: <strong className="text-slate-950 font-extrabold">{riderProfile.phone || '+91 98123 45678'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 2. FLOATING OVERLAY CONTAINER */}
      <div className="px-4 -mt-10 space-y-4 max-w-md mx-auto relative z-20">

        {/* DUTY STATUS TELEMETRY CARD */}
        <div className="bg-white rounded-[24px] p-4 border border-slate-200/80 shadow-xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block">LocationIQ GPS Telemetry</span>
              <span className="text-[11px] text-slate-500 font-mono">2.5 km Zone • Live Tracking</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-black tracking-wide ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer shadow-inner ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5.5 h-5.5 rounded-full bg-white transition-transform shadow-md ${isOnline ? 'translate-x-5.5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* 3 BENTO METRIC STAT CARDS */}
        <div className="grid grid-cols-3 gap-3">
          {/* Earnings Card */}
          <div 
            onClick={() => setActiveTab('earnings')}
            className="bg-white border border-slate-200/80 hover:border-amber-400 rounded-[22px] p-3.5 space-y-2 shadow-sm cursor-pointer transition-all hover:scale-[1.02] group"
          >
            <div className="flex justify-between items-center">
              <div className="p-2 bg-amber-50 rounded-xl text-[#765B00] group-hover:bg-[#FFC700] transition">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Today</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Earnings</p>
              <p className="text-base font-black text-slate-900 tracking-tight mt-0.5">
                ₹{riderProfile.todayEarnings.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Deliveries Card */}
          <div 
            onClick={() => setActiveTab('orders')}
            className="bg-white border border-slate-200/80 hover:border-blue-400 rounded-[22px] p-3.5 space-y-2 shadow-sm cursor-pointer transition-all hover:scale-[1.02] group"
          >
            <div className="flex justify-between items-center">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Total</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Orders</p>
              <p className="text-base font-black text-slate-900 tracking-tight mt-0.5">
                {riderProfile.todayDeliveries} Orders
              </p>
            </div>
          </div>

          {/* Rating Card */}
          <div 
            onClick={() => setActiveTab('ratings')}
            className="bg-white border border-slate-200/80 hover:border-emerald-400 rounded-[22px] p-3.5 space-y-2 shadow-sm cursor-pointer transition-all hover:scale-[1.02] group"
          >
            <div className="flex justify-between items-center">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition">
                <Star className="w-4 h-4 fill-emerald-500 text-emerald-500 group-hover:fill-white group-hover:text-white" />
              </div>
              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">Top 5%</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Rating</p>
              <p className="text-base font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-1">
                {riderProfile.rating} <span className="text-xs text-amber-500">★</span>
              </p>
            </div>
          </div>
        </div>

        {/* GROUPED NAVIGATION LIST */}
        <div className="bg-white border border-slate-200/80 rounded-[28px] overflow-hidden shadow-sm divide-y divide-slate-100">
          {/* Vehicle Info */}
          <div className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer group">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-50 rounded-2xl text-[#765B00] group-hover:bg-[#FFC700] transition">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Vehicle &amp; Driving License</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">DL-BLR-2026-9901 • Verified Active</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
          </div>

          {/* Payout & Bank Account */}
          <div 
            onClick={() => setActiveTab('earnings')}
            className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white transition">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Payout &amp; Bank Account</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">UPI Transfer • Daily Instant Credit</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
          </div>

          {/* Performance SLA Insights */}
          <div 
            onClick={() => setActiveTab('ratings')}
            className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Performance SLA Insights</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">7.4 min Delivery Speed • 100% SLA</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
          </div>

          {/* LocationIQ GPS Telemetry */}
          <div className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer group">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">LocationIQ GPS Telemetry</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">HSR Layout Sector 1 • 2.5 km Radius</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
          </div>

          {/* Emergency Helpline */}
          <div className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer group">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-50 rounded-2xl text-[#765B00] group-hover:bg-[#FFC700] transition">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">24/7 Rider Emergency Helpline</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Instant Support &amp; Accident Protection</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
          </div>

          {/* Submit New Rider Application */}
          {onReRegister && (
            <div 
              onClick={() => {
                localStorage.removeItem('cartcraze_rider_data');
                onReRegister();
              }}
              className="p-4 flex items-center justify-between hover:bg-amber-50 transition cursor-pointer group border-b border-slate-100"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-amber-100 rounded-2xl text-amber-900 group-hover:bg-amber-400 group-hover:text-black transition font-bold">
                  📝
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-900">Submit New Rider License &amp; ID Proof</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">Upload DL &amp; ID Documents for Admin Approval</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </div>
          )}

          {/* Logout Button */}
          <div 
            onClick={handleLogout}
            className="p-4 flex items-center justify-between hover:bg-rose-50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-rose-600">Sign Out of Partner App</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">End shift &amp; close rider session</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-500" />
          </div>
        </div>

      </div>
    </div>
  );
};
