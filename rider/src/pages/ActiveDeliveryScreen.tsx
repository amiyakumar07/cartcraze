import React, { useState } from 'react';
import type { RiderOrder } from '../types';
import { DeliveryStepper } from '../components/DeliveryStepper';
import { LocationIQMap } from '../components/LocationIQMap';
import {
  PhoneCall,
  MessageSquare,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Store,
  MapPin,
  Clock,
  DollarSign,
  PackageCheck,
  Camera,
  X,
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';

interface ActiveDeliveryScreenProps {
  activeOrder: RiderOrder | null;
  onComplete: (orderId: string) => void;
  setActiveTab: (tab: any) => void;
}

export const ActiveDeliveryScreen: React.FC<ActiveDeliveryScreenProps> = ({
  activeOrder,
  onComplete,
  setActiveTab
}) => {
  const [currentStatus, setCurrentStatus] = useState<string>(activeOrder?.status || 'ASSIGNED');
  const [otpInput, setOtpInput] = useState<string[]>(['', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [cashCollected, setCashCollected] = useState(false);
  const [proofPhotoUploaded, setProofPhotoUploaded] = useState(false);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);

  if (!activeOrder) {
    return (
      <div className="bg-slate-950 text-white min-h-screen p-6 flex flex-col justify-center items-center text-center space-y-4 font-sans border-t border-slate-900 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center text-2xl font-black shadow-xl">
          📦
        </div>
        <h2 className="text-base font-black text-white">No Active Delivery Assigned</h2>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Stay online in your home dashboard to receive new quick-commerce delivery requests.
        </p>
        <button
          onClick={() => setActiveTab('orders')}
          className="mt-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isCod = activeOrder.paymentMethod === 'COD' || activeOrder.paymentMethod === 'CASH';
  const expectedOtp = activeOrder.otp || '4829';
  const payoutEarnings = Math.max(35, Math.round((activeOrder.finalTotal || 80) * 0.12));

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);
    setOtpError(false);

    // Auto advance focus
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtpAndComplete = () => {
    const entered = otpInput.join('');
    if (entered !== expectedOtp && entered !== '1234' && entered !== '4829') {
      setOtpError(true);
      return;
    }

    if (isCod && !cashCollected) {
      alert('Please confirm cash collection before completing delivery.');
      return;
    }

    setIsCompletedSuccess(true);
    onComplete(activeOrder.id);
  };

  if (isCompletedSuccess) {
    return (
      <div className="bg-slate-950 text-white min-h-screen p-6 flex flex-col justify-center items-center text-center space-y-5 font-sans animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-4xl font-black shadow-2xl animate-bounce">
          🎉
        </div>

        <div className="space-y-1">
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
            DELIVERY COMPLETED SUCCESSFULLY
          </span>
          <h2 className="text-2xl font-black text-white pt-2">₹{payoutEarnings} Earned!</h2>
          <p className="text-xs text-slate-400 font-mono">Order #{activeOrder.id} • Completed in 14 mins</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 w-full max-w-xs space-y-2 text-xs text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Base Delivery Fee</span>
            <span className="font-bold text-white">₹35.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Distance Surge</span>
            <span className="font-bold text-emerald-400">₹{payoutEarnings - 35}.00</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-800 font-extrabold text-sm">
            <span className="text-slate-200">Total Payout</span>
            <span className="text-emerald-400">₹{payoutEarnings}.00</span>
          </div>
        </div>

        <button
          onClick={() => { setIsCompletedSuccess(false); setActiveTab('orders'); }}
          className="w-full max-w-xs py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          BACK TO DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-24 font-sans space-y-4 p-4 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">ACTIVE DELIVERY ORDER</span>
          <h2 className="text-base font-black text-white">Order #{activeOrder.id}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-black text-emerald-400 block">Est. Payout</span>
          <span className="text-lg font-black text-white">₹{payoutEarnings}</span>
        </div>
      </div>

      {/* ── 6-STEP DELIVERY PROGRESS STEPPER ── */}
      <DeliveryStepper currentStatus={currentStatus} />

      {/* ── STEP 1: STORE PICKUP SECTION ── */}
      {(currentStatus === 'ASSIGNED' || currentStatus === 'GOING_TO_STORE' || currentStatus === 'ARRIVED_AT_STORE') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-4 shadow-xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
                🏪
              </div>
              <div>
                <span className="text-[9px] text-amber-400 font-black uppercase tracking-wider block">STEP 1 • PICKUP AT DARKSTORE</span>
                <h3 className="text-sm font-extrabold text-white">{activeOrder.restaurantName || 'Fresh Valley Market'}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{activeOrder.restaurantAddress || 'Sector 1, HSR Layout'}</p>
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${activeOrder.restaurantAddress || 'HSR Layout'}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Map</span>
            </a>
          </div>

          <div className="flex gap-2">
            <a
              href="tel:+919800011111"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Darkstore Manager</span>
            </a>
          </div>

          {currentStatus === 'ASSIGNED' && (
            <button
              onClick={() => setCurrentStatus('GOING_TO_STORE')}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-4 h-4 fill-slate-950" />
              <span>START NAVIGATION TO STORE</span>
            </button>
          )}

          {currentStatus === 'GOING_TO_STORE' && (
            <button
              onClick={() => setCurrentStatus('ARRIVED_AT_STORE')}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>I'VE ARRIVED AT DARKSTORE</span>
            </button>
          )}

          {currentStatus === 'ARRIVED_AT_STORE' && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Item Verification Checklist ({activeOrder.itemsCount || 1} SKUs)</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ready Packed
                </span>
              </div>

              <button
                onClick={() => setCurrentStatus('PICKED_UP')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 stroke-[3]" />
                <span>VERIFY &amp; CONFIRM PICKUP</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: CUSTOMER DELIVERY SECTION ── */}
      {(currentStatus === 'PICKED_UP' || currentStatus === 'GOING_TO_CUSTOMER' || currentStatus === 'ARRIVED_AT_CUSTOMER') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-4 shadow-xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                📍
              </div>
              <div>
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider block">STEP 2 • DELIVER TO CUSTOMER</span>
                <h3 className="text-sm font-extrabold text-white">{activeOrder.customerName || 'Customer'}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{activeOrder.deliveryAddress}</p>
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${activeOrder.customerLat || 12.9141},${activeOrder.customerLon || 77.6411}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Map</span>
            </a>
          </div>

          {/* Customer Call & SMS buttons */}
          <div className="flex gap-2">
            <a
              href={`tel:${activeOrder.customerPhone}`}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call Customer</span>
            </a>
            <a
              href={`sms:${activeOrder.customerPhone}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1 border border-slate-700"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>

          {currentStatus === 'PICKED_UP' && (
            <button
              onClick={() => setCurrentStatus('GOING_TO_CUSTOMER')}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-4 h-4 fill-slate-950" />
              <span>START NAVIGATION TO CUSTOMER</span>
            </button>
          )}

          {currentStatus === 'GOING_TO_CUSTOMER' && (
            <button
              onClick={() => setCurrentStatus('ARRIVED_AT_CUSTOMER')}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>I'VE ARRIVED AT CUSTOMER LOCATION</span>
            </button>
          )}

          {currentStatus === 'ARRIVED_AT_CUSTOMER' && (
            <div className="space-y-4 pt-3 border-t border-slate-800">
              {/* COD Cash Collection Section if Cash Order */}
              {isCod && (
                <div className="bg-amber-950/60 border border-amber-500/50 p-3.5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">CASH ON DELIVERY (COD)</span>
                    <span className="text-lg font-black text-amber-400">Collect ₹{activeOrder.finalTotal}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCashCollected(!cashCollected)}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      cashCollected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{cashCollected ? '✓ CASH RECEIVED FROM CUSTOMER' : 'CONFIRM CASH RECEIVED'}</span>
                  </button>
                </div>
              )}

              {/* 4-Digit OTP Verification */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-200">Customer Delivery OTP Verification</label>
                  <span className="text-[10px] text-slate-400 font-mono">Demo OTP: {expectedOtp}</span>
                </div>

                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={otpInput[idx]}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className={`w-12 h-14 bg-slate-950 border-2 rounded-2xl text-center text-xl font-black font-mono text-emerald-400 focus:outline-none transition-all ${
                        otpError ? 'border-red-500' : 'border-slate-700 focus:border-emerald-400'
                      }`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-[11px] text-red-400 text-center font-bold">Incorrect OTP. Try 4829 or 1234.</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtpAndComplete}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 stroke-[3]" />
                <span>VERIFY OTP &amp; COMPLETE DELIVERY</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── MAP CANVAS FOR ACTIVE DELIVERY ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Live Delivery Route Telemetry</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">GPS Active</span>
        </div>

        <div className="h-52 rounded-2xl overflow-hidden border border-slate-800 relative">
          <LocationIQMap activeOrder={activeOrder} />
        </div>
      </div>
    </div>
  );
};
