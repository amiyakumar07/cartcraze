import React, { useState } from 'react';
import type { RiderProfile, AppTab } from '../App';
import type { RiderOrder, DutyStatus } from '../types';
import { LocationIQMap } from '../components/LocationIQMap';
import { NewOrderRequestModal } from '../components/NewOrderRequestModal';
import { NotificationCenterModal } from '../components/NotificationCenterModal';
import { SupportSosModal } from '../components/SupportSosModal';
import { Power, Bell, ShieldAlert, Zap, TrendingUp, Star, Award, ChevronRight, MapPin, Store, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  riderProfile: RiderProfile;
  dutyStatus: DutyStatus;
  setDutyStatus: (s: DutyStatus) => void;
  apiError: boolean;
  setActiveTab: (tab: AppTab) => void;
  activeOrder: RiderOrder | null;
  setActiveOrder: (o: RiderOrder) => void;
}

export const HomeScreen: React.FC<Props> = ({
  riderProfile,
  dutyStatus,
  setDutyStatus,
  apiError,
  setActiveTab,
  activeOrder,
  setActiveOrder
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportInitialTab, setSupportInitialTab] = useState<'support' | 'sos'>('support');
  const [pendingRequestOrder, setPendingRequestOrder] = useState<RiderOrder | null>(null);

  const isOnDuty = dutyStatus === 'ON_DUTY';

  const toggleDuty = () => {
    const newStatus: DutyStatus = isOnDuty ? 'OFF_DUTY' : 'ON_DUTY';
    setDutyStatus(newStatus);
    if (!isOnDuty && activeOrder && !activeOrder.status) {
      setPendingRequestOrder(activeOrder);
    }
  };

  const handleAcceptRequest = (accepted: RiderOrder) => {
    setActiveOrder({ ...accepted, status: 'ASSIGNED' });
    setPendingRequestOrder(null);
    setActiveTab('delivery');
  };

  const handleRejectRequest = () => {
    setPendingRequestOrder(null);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-24 font-sans animate-fadeIn">
      {/* ── TOP HEADER ── */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30">
        <div className="flex justify-between items-center">
          {/* Avatar & Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-lg font-black text-amber-400">
                {riderProfile.name ? riderProfile.name.charAt(0).toUpperCase() : 'R'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-sm text-white">{riderProfile.name || 'Partner Rider'}</h2>
                <span className="bg-amber-400/20 text-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {isOnDuty ? '⚡ Ready for Delivery Orders' : '🌙 Currently Off Duty'}
              </p>
            </div>
          </div>

          {/* Action Buttons: Notifications & SOS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSupportInitialTab('sos'); setShowSupportModal(true); }}
              className="p-2 rounded-xl bg-red-950/80 border border-red-800/80 text-red-400 hover:text-red-300 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="1-Tap SOS Emergency"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            </button>

            <button
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all active:scale-95 cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5 animate-ping" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ── PROMINENT ONLINE / OFFLINE TOGGLE BANNER ── */}
        <div className={`p-4 rounded-3xl border shadow-xl flex items-center justify-between transition-all ${
          isOnDuty
            ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border-emerald-500/50 shadow-emerald-950/40'
            : 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${
              isOnDuty ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              <Power className={`w-6 h-6 ${isOnDuty ? 'stroke-[3]' : ''}`} />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider block ${isOnDuty ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isOnDuty ? '● YOU ARE ONLINE' : '○ YOU ARE OFFLINE'}
              </span>
              <h3 className="text-sm font-extrabold text-white mt-0.5">
                {isOnDuty ? 'Receiving Quick-Commerce Orders' : 'Go Online to Start Earning'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleDuty}
            className={`px-5 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer flex items-center gap-1.5 ${
              isOnDuty
                ? 'bg-red-600 hover:bg-red-500 text-white border border-red-500'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            <span>{isOnDuty ? 'Go Offline' : 'GO ONLINE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── ACTIVE DELIVERY CARD (IF ORDER ASSIGNED) ── */}
        {activeOrder && (
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 border-2 border-amber-400 rounded-3xl p-4 shadow-2xl space-y-3 relative overflow-hidden animate-pulse">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                  ⚡ ACTIVE DELIVERY ASSIGNED
                </span>
                <h3 className="text-base font-black text-white">Order #{activeOrder.id}</h3>
              </div>
              <span className="text-lg font-black text-emerald-400">₹{activeOrder.payoutAmount || 75}</span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <Store className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold truncate">{activeOrder.restaurantName || 'Fresh Valley Market'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{activeOrder.deliveryAddress}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('delivery')}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <span>OPEN LIVE DELIVERY WORKFLOW</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* ── TODAY'S EARNINGS DASHBOARD CARD ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Earnings</span>
              <h3 className="text-3xl font-black text-emerald-400 mt-0.5">
                ₹{(riderProfile.todayEarnings || 0).toFixed(2)}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('earnings')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-1 transition-all"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center font-mono text-[10px]">
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[9px]">Deliveries</span>
              <span className="text-white font-extrabold text-xs">{riderProfile.todayDeliveries || 0}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[9px]">Incentives</span>
              <span className="text-emerald-400 font-extrabold text-xs">₹150</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[9px]">Tips</span>
              <span className="text-amber-300 font-extrabold text-xs">₹45</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[9px]">Cash COD</span>
              <span className="text-slate-300 font-extrabold text-xs">₹0</span>
            </div>
          </div>
        </div>

        {/* ── PERFORMANCE METRICS CARD ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Partner Performance Score</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Top 5% Partner
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block font-bold">Acceptance</span>
              <span className="text-emerald-400 font-black text-sm block mt-0.5">98%</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block font-bold">Completion</span>
              <span className="text-emerald-400 font-black text-sm block mt-0.5">99%</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block font-bold">Rating</span>
              <span className="text-amber-400 font-black text-sm block mt-0.5">4.9 ★</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block font-bold">On-Time</span>
              <span className="text-emerald-400 font-black text-sm block mt-0.5">96%</span>
            </div>
          </div>
        </div>

        {/* ── LIVE GPS TELEMETRY MAP CANVAS ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Live LocationIQ Rider GPS Zone</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">HSR Layout Sector 1</span>
          </div>

          <div className="h-48 rounded-2xl overflow-hidden border border-slate-800 relative">
            <LocationIQMap activeOrder={activeOrder} />
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      <NewOrderRequestModal
        order={pendingRequestOrder}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />

      <NotificationCenterModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <SupportSosModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        initialTab={supportInitialTab}
      />
    </div>
  );
};
