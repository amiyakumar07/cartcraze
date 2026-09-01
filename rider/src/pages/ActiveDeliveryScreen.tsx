import React, { useState } from 'react';
import { MapPin, Phone, CheckCircle2, Package, Navigation, ChevronRight, ArrowLeft } from 'lucide-react';
import { LocationIQMap } from '../components/LocationIQMap';
import { SwipeToConfirm } from '../components/SwipeToConfirm';
import type { RiderOrder } from '../types';
import type { AppTab } from '../App';

interface Props {
  activeOrder: RiderOrder | null;
  onComplete: (id: string) => void;
  setActiveTab: (tab: AppTab) => void;
}

export const ActiveDeliveryScreen: React.FC<Props> = ({ activeOrder, onComplete, setActiveTab }) => {
  const [step, setStep] = useState<'PICKUP' | 'DELIVERING' | 'DONE'>('PICKUP');
  const [confirming, setConfirming] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  if (!activeOrder) {
    return (
      <div className="min-h-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1">No Active Delivery</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-xs leading-relaxed">
          Go online on the Home screen to receive assigned darkstore orders.
        </p>
        <button
          onClick={() => setActiveTab('orders')}
          className="min-h-[44px] bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer"
        >
          Go to Home Queue
        </button>
      </div>
    );
  }

  const isPrepaid = activeOrder.paymentMethod !== 'COD' && activeOrder.paymentStatus !== 'UNPAID';

  const handleVerifyOtpAndComplete = async () => {
    if (isPrepaid) {
      const targetOtp = activeOrder.otp || '4829';
      if (inputOtp.trim() !== targetOtp) {
        setOtpError(`Incorrect OTP! Ask customer for 4-digit code shown in their app.`);
        return;
      }
    }
    setOtpError('');
    setConfirming(true);
    await onComplete(activeOrder.id);
    setStep('DONE');
    setConfirming(false);
  };

  return (
    <div className="bg-slate-50 font-sans pb-32 min-h-screen text-slate-900">
      {/* TOP BAR */}
      <div className="bg-white px-4 py-3.5 flex items-center gap-3 border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-bold text-slate-900 font-jakarta leading-none">Active Delivery</h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Order #{activeOrder.id}</p>
        </div>
        <div className="ml-auto">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            step === 'DONE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
            step === 'DELIVERING' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
            'bg-amber-100 text-amber-900 border border-amber-200'
          }`}>
            {step === 'DONE' ? '✅ Delivered' : step === 'DELIVERING' ? '🛵 En Route' : '📦 Darkstore Pickup'}
          </span>
        </div>
      </div>

      {/* LocationIQ Live GPS Map with Customer Pin */}
      <div className="mx-4 mt-4">
        <LocationIQMap
          step={step}
          riderName="Alex Mercer"
          destLat={activeOrder.customerLat}
          destLon={activeOrder.customerLon}
          customerName={activeOrder.customerName}
          customerAddress={activeOrder.deliveryAddress}
        />
      </div>

      {/* DELIVERY STEPS CONTAINER */}
      <div className="px-4 mt-4 space-y-3">
        {/* STEP 1: PICKUP */}
        <div className={`rounded-2xl border p-4 transition-all ${
          step === 'PICKUP' ? 'border-amber-400 bg-amber-50/50 shadow-xs' : 'border-slate-200 bg-white opacity-70'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                step !== 'PICKUP' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-950 font-bold'
              }`}>
                {step !== 'PICKUP' ? <CheckCircle2 className="w-4 h-4" /> : <Package className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900">1. Pickup from Shop</p>
                <p className="text-xs text-slate-700 font-bold mt-0.5 truncate">{activeOrder.restaurantName || 'Fresh Valley Market'}</p>
                <p className="text-[11px] text-slate-500 truncate">{activeOrder.restaurantAddress || 'Sector 1, HSR Layout, Bengaluru'}</p>
              </div>
            </div>
          </div>

          {step === 'PICKUP' && (
            <div className="mt-3.5 pt-3 border-t border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Confirm Order Pickup at Store:</span>
                <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full text-[10px] uppercase font-black">
                  Ready for Pickup
                </span>
              </div>
              <SwipeToConfirm
                label="Swipe when picked up"
                confirmLabel="Picked up ✓"
                onConfirm={async () => {
                  try {
                    await fetch(`http://localhost:4000/api/orders/${activeOrder.id}/status`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'PICKED_UP', riderId: 'rider-001' })
                    });
                  } catch (e) {
                    console.warn('Mark picked up patch error:', e);
                  }
                  setStep('DELIVERING');
                }}
              />
              <button
                type="button"
                onClick={() => setStep('DELIVERING')}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 py-1 cursor-pointer underline"
              >
                Tap here to confirm pickup manually
              </button>
            </div>
          )}
        </div>

        {/* STEP 2: DELIVER */}
        <div className={`rounded-2xl border p-4 transition-all ${
          step === 'DELIVERING' ? 'border-blue-500 bg-blue-50/50 shadow-xs' :
          step === 'DONE' ? 'border-slate-200 bg-white opacity-70' :
          'border-slate-200 bg-white opacity-50'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              step === 'DONE' ? 'bg-emerald-500 text-white' : step === 'DELIVERING' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step === 'DONE' ? <CheckCircle2 className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">2. Customer Dropoff</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{activeOrder.customerName}</p>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{activeOrder.deliveryAddress}</p>
              
              {/* PAYMENT HIGHLIGHT BADGE */}
              <div className="flex items-center gap-2 mt-2.5">
                <span className="text-xs font-black text-slate-900">₹{activeOrder.finalTotal || activeOrder.payoutAmount || 85}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isPrepaid
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold'
                }`}>
                  {isPrepaid ? '✓ Prepaid (OTP Required)' : '💵 Collect Cash ₹' + (activeOrder.finalTotal || 85)}
                </span>
              </div>
            </div>
          </div>

          {step === 'DELIVERING' && (
            <div className="mt-4 space-y-3">
              <a
                href={`tel:${activeOrder.customerPhone || '9876543210'}`}
                className="w-full min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 border border-slate-300 transition cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-600" /> Call Customer ({activeOrder.customerPhone || '+91 98765 43210'})
              </a>

              {/* OTP Verification Section for Prepaid Orders */}
              {isPrepaid ? (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Enter 4-Digit Customer Delivery OTP:
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={inputOtp}
                    onChange={(e) => {
                      setInputOtp(e.target.value);
                      setOtpError('');
                    }}
                    placeholder="Enter 4-digit OTP (e.g. 4829)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-center font-mono text-base font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  {otpError && (
                    <p className="text-[11px] font-bold text-red-600 leading-tight">{otpError}</p>
                  )}
                  <div className="pt-1">
                    <SwipeToConfirm
                      label="Swipe when delivered"
                      confirmLabel="Delivered ✓"
                      disabled={confirming || inputOtp.length < 4}
                      onConfirm={handleVerifyOtpAndComplete}
                    />
                  </div>
                </div>
              ) : (
                /* COD Cash Collection Section */
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-2">
                  <p className="text-xs font-bold text-amber-900">
                    Collect ₹{activeOrder.finalTotal || 85} Cash from Customer before handing over parcel.
                  </p>
                  <div className="pt-1">
                    <SwipeToConfirm
                      label="Swipe when delivered & paid"
                      confirmLabel="Delivered ✓"
                      disabled={confirming}
                      onConfirm={handleVerifyOtpAndComplete}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 3: DONE CELEBRATION */}
        {step === 'DONE' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center animate-slide-up shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 font-jakarta">Order Delivered! 🎉</h3>
            <p className="text-xs text-slate-600 mt-0.5 mb-4">₹75 added to today's earnings</p>
            <button
              onClick={() => setActiveTab('orders')}
              className="min-h-[44px] bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer"
            >
              Back to Home Queue
            </button>
          </div>
        )}

        {/* PAYOUT BREAKDOWN CARD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3 flex items-center justify-between shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Trip Guaranteed Payout</span>
          <div className="text-right">
            <span className="text-base font-black text-slate-900 font-jakarta">₹75.00</span>
            <p className="text-[10px] text-slate-400 font-medium">Base pay + express bonus</p>
          </div>
        </div>
      </div>
    </div>
  );
};
