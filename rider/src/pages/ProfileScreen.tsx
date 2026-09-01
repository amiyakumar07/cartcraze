import React, { useState } from 'react';
import type { RiderProfile, AppTab } from '../App';
import { DocumentManagerModal } from '../components/DocumentManagerModal';
import { SupportSosModal } from '../components/SupportSosModal';
import {
  User,
  Bike,
  ShieldCheck,
  CreditCard,
  FileText,
  Headphones,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Star,
  Zap,
  MapPin,
  RefreshCw,
  Sliders
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
  onReRegister
}) => {
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('cartcraze_rider_login_timestamp');
    localStorage.removeItem('cartcraze_rider_data');
    setRiderProfile((prev) => ({
      ...prev,
      isLoggedIn: false
    }));
  };

  const savedRiderData = (() => {
    const saved = localStorage.getItem('cartcraze_rider_data');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  })();

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-24 font-sans space-y-4 p-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">PARTNER PROFILE</span>
          <h2 className="text-base font-black text-white">Rider Account &amp; Settings</h2>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          ACTIVE RIDER
        </span>
      </div>

      {/* ── RIDER HERO CARD ── */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-2xl font-black text-amber-400">
              {riderProfile.name ? riderProfile.name.charAt(0).toUpperCase() : 'R'}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white truncate">{riderProfile.name || 'Amiya Sahoo'}</h3>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.2 rounded-full uppercase">
                4.9 ★ PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{riderProfile.phone || '+91 98765 43210'}</p>
            <p className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <Bike className="w-3.5 h-3.5" />
              <span>Vehicle: {riderProfile.vehicleNumber || savedRiderData?.vehicleNumber || 'KA-05-EV-4092'} (EV Scooter)</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center font-mono text-[10px]">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px]">Deliveries</span>
            <span className="text-white font-black text-xs">{riderProfile.totalDeliveries || 148}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px]">Rating</span>
            <span className="text-amber-400 font-black text-xs">4.92 ★</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px]">Member Since</span>
            <span className="text-emerald-400 font-black text-xs">Aug 2026</span>
          </div>
        </div>
      </div>

      {/* ── DOCUMENTS VERIFICATION STATUS CARD ── */}
      <div
        onClick={() => setShowDocsModal(true)}
        className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-4 shadow-xl flex items-center justify-between cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-white text-xs">Rider Compliance Documents</h4>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.2 rounded-full border border-emerald-500/30">
                4 / 4 VERIFIED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">DL, RC, Aadhaar Card, Insurance verified.</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
      </div>

      {/* ── BANK & PAYOUT SETTINGS ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>Payout Bank Account &amp; UPI</span>
        </h4>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
          <div>
            <span className="font-extrabold text-white block">HDFC Bank • UPI Direct</span>
            <span className="text-[10px] text-slate-400 font-mono">A/C: XXXX-XXXX-4091 • UPI: partner@hdfc</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded-full">
            Active Payout
          </span>
        </div>
      </div>

      {/* ── SUPPORT & EMERGENCY BUTTONS ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <Headphones className="w-4 h-4 text-emerald-400" />
          <span>Partner Support &amp; Emergency</span>
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setShowSupportModal(true)}
            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">24/7 Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowSupportModal(true)}
            className="bg-red-950/40 hover:bg-red-950/60 border border-red-800/60 p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="font-bold text-red-300">1-Tap SOS</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* ── LOGOUT & RE-REGISTER BUTTONS ── */}
      <div className="space-y-2 pt-2">
        {onReRegister && (
          <button
            type="button"
            onClick={onReRegister}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs border border-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Update / Re-submit Partner Application</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-black text-xs border border-red-500/40 transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
        >
          <LogOut className="w-4 h-4" />
          <span>LOGOUT FROM RIDER PARTNER APP</span>
        </button>
      </div>

      {/* Modals */}
      <DocumentManagerModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
        riderData={savedRiderData}
      />

      <SupportSosModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
};
