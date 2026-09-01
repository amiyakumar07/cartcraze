import React, { useState, useEffect } from 'react';
import type { RiderOrder } from '../types';
import { ShoppingBag, MapPin, ArrowRight, Clock, ShieldAlert, Check, X, PhoneCall, Zap, DollarSign } from 'lucide-react';

interface NewOrderRequestModalProps {
  order: RiderOrder | null;
  onAccept: (order: RiderOrder) => void;
  onReject: () => void;
}

export const NewOrderRequestModal: React.FC<NewOrderRequestModalProps> = ({
  order,
  onAccept,
  onReject
}) => {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (!order) return;
    setTimeLeft(15);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReject();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order?.id]);

  if (!order) return null;

  const estimatedPayout = Math.max(35, Math.round((order.finalTotal || 80) * 0.12));
  const progressPercent = (timeLeft / 15) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 font-sans text-white relative overflow-hidden">
        {/* Top Animated Progress Bar for 15s Timer */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header Badge */}
        <div className="flex justify-between items-center pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              NEW EXPRESS DELIVERY REQUEST
            </span>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-mono font-black">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
        </div>

        {/* Payout & Distance Highlight Box */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/60 border border-emerald-500/40 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Payout</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-emerald-400">₹{estimatedPayout}</span>
              <span className="text-[11px] text-emerald-300 font-semibold">+ Tips Applicable</span>
            </div>
          </div>

          <div className="text-right border-l border-slate-800 pl-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Distance</span>
            <span className="text-base font-black text-white block mt-0.5">3.2 km</span>
            <span className="text-[10px] text-slate-400 font-mono">~12 Mins Delivery</span>
          </div>
        </div>

        {/* Route Details: Store -> Customer */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-3.5 space-y-3 text-xs">
          {/* Pickup Store */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shrink-0 mt-0.5">
              🏪
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] text-amber-400 font-black uppercase tracking-wide block">1. PICKUP AT STORE</span>
              <h4 className="font-extrabold text-white text-xs truncate">{order.restaurantName || 'Fresh Valley Market'}</h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{order.restaurantAddress || 'Sector 1, HSR Layout'}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-bold shrink-0">1.2 km</span>
          </div>

          <div className="h-px bg-slate-700/60 mx-2" />

          {/* Customer Delivery */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0 mt-0.5">
              📍
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wide block">2. DELIVER TO CUSTOMER</span>
              <h4 className="font-extrabold text-white text-xs truncate">{order.customerName || 'Customer'}</h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{order.deliveryAddress}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-bold shrink-0">2.0 km</span>
          </div>
        </div>

        {/* Order Meta Info */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
          <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[9px] uppercase">Items</span>
            <span className="text-white text-xs font-black">{order.itemsCount || 1} Items</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[9px] uppercase">Payment</span>
            <span className="text-emerald-400 text-xs font-black">{order.paymentMethod || 'Online'}</span>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[9px] uppercase">Order Value</span>
            <span className="text-amber-300 text-xs font-black">₹{order.finalTotal || 75}</span>
          </div>
        </div>

        {/* Action Buttons: Accept / Reject */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onReject}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-400" />
            <span>Decline Order</span>
          </button>

          <button
            type="button"
            onClick={() => onAccept(order)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-950 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>ACCEPT DELIVERY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
