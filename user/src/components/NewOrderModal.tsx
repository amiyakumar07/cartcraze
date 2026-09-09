import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Check } from 'lucide-react';
import type { StoreOrder } from '../types';

interface Props {
  isOpen: boolean;
  order: StoreOrder | null;
  onAccept: (prepMinutes?: number) => void;
  onReject: (reason?: string) => void;
}

export const NewOrderModal: React.FC<Props> = ({ isOpen, order, onAccept, onReject }) => {
  const [prepMinutes, setPrepMinutes] = useState<number>(15);
  const [showDeclinePanel, setShowDeclinePanel] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(90);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const totalSeconds = 90;

  useEffect(() => {
    if (!isOpen) {
      setRemainingSeconds(90);
      setShowDeclinePanel(false);
      setConfirmed(false);
      return;
    }

    // Play notification sound
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const playBeep = (delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      };
      playBeep(0);
      playBeep(0.3);
      playBeep(0.6);
    } catch {
      // silent
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReject('Auto-declined on timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const circumference = 150.8; // 2 * PI * 24
  const pct = remainingSeconds / totalSeconds;
  const strokeDashoffset = circumference * (1 - pct);
  const timerColor = remainingSeconds <= 20 ? '#D14343' : remainingSeconds <= 45 ? '#C98A00' : '#00C985';

  const subtotal = order.finalTotal || (order.items ? order.items.reduce((s, i) => s + i.price * i.quantity, 0) : 150);
  const commission = Math.round(subtotal * 0.15 * 100) / 100;
  const vendorPayout = (subtotal - commission).toFixed(2);

  const handleAcceptClick = () => {
    setConfirmed(true);
    setTimeout(() => {
      onAccept(prepMinutes);
    }, 1200);
  };

  const handleSendDecline = (reason: string) => {
    setShowDeclinePanel(false);
    onReject(reason);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fadeIn font-sans">
      <div className="bg-white rounded-[22px] border border-[#DCE6DF] shadow-[0_24px_48px_-24px_rgba(20,36,32,0.25)] max-w-[540px] w-full overflow-hidden text-[#142420]">
        {/* Panel Header */}
        <div className="flex items-center gap-4 p-5 sm:p-6 border-b border-[#DCE6DF] bg-[#EFF5F0]/40">
          {/* Ring Timer */}
          <div className="relative w-14 h-14 shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#DCE6DF" strokeWidth="4" />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={timerColor}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold" style={{ color: timerColor }}>
              {remainingSeconds}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#728479] font-bold">ORDER #{order.id}</span>
              <span className="inline-flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-wider text-[#D14343] bg-[#FBE9E9] px-2 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D14343] animate-ping" />
                NEW
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-gray-900 leading-tight">
              {order.customerName || 'Customer'} — {order.items?.length || 1} items
            </h2>
          </div>
        </div>

        {/* Panel Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Address & Contact Row */}
          <div className="space-y-2 text-xs text-[#728479]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#9DB0A4] shrink-0 mt-0.5" />
              <div>
                <b className="text-[#142420] font-semibold">{order.deliveryAddress || '208 Rosewood Ave, Apt 3'}</b> — 2.4 mi delivery
                <span className="block mt-1 text-[11.5px] bg-[#FBF1DC] text-[#C98A00] font-bold px-2.5 py-0.5 rounded-md w-max">
                  Leave at door, ring bell
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#9DB0A4] shrink-0" />
              <span>Customer phone: <b className="text-[#142420]">{order.customerPhone || '+91 98765 43210'}</b></span>
            </div>
          </div>

          {/* Items List */}
          <div className="border-y border-dashed border-[#DCE6DF] py-3 space-y-2 my-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-xs sm:text-sm">
                  <div className="flex gap-2">
                    <span className="font-mono text-[#728479] text-xs font-bold">×{item.quantity}</span>
                    <span className="font-medium text-[#142420]">{item.name}</span>
                  </div>
                  <span className="font-mono text-xs text-[#728479]">₹{item.price * item.quantity}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between items-start text-xs sm:text-sm">
                <div className="flex gap-2">
                  <span className="font-mono text-[#728479] text-xs font-bold">×1</span>
                  <span className="font-medium text-[#142420]">Grocery Parcel Items</span>
                </div>
                <span className="font-mono text-xs text-[#728479]">₹{subtotal}</span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="font-mono text-xs space-y-1 text-[#728479] bg-[#EFF5F0]/50 p-3 rounded-xl">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform commission (15%)</span>
              <span>−₹{commission}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-[#DCE6DF]">
              <span className="font-sans font-semibold text-[#142420] text-xs">Your payout</span>
              <span className="font-serif font-bold text-xl text-[#048F63]">₹{vendorPayout}</span>
            </div>
          </div>

          {/* Prep Time Chips */}
          {!confirmed && (
            <div>
              <label className="text-xs font-semibold text-[#142420] block mb-2">Estimated prep time</label>
              <div className="flex gap-2 flex-wrap">
                {[10, 15, 20, 25].map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setPrepMinutes(min)}
                    className={`px-4 py-2 rounded-full font-mono text-xs font-bold border transition cursor-pointer ${
                      prepMinutes === min
                        ? 'bg-[#142420] text-white border-[#142420]'
                        : 'bg-white text-[#728479] border-[#DCE6DF] hover:border-emerald-500'
                    }`}
                  >
                    {min} min
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions Bar */}
          {!confirmed ? (
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAcceptClick}
                  className="flex-2 py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#00C985] text-[#08201A] shadow-[0_10px_20px_-8px_rgba(0,201,133,0.5)] hover:bg-[#048F63] hover:text-white transition cursor-pointer"
                >
                  Accept order — ready in {prepMinutes} min
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeclinePanel(!showDeclinePanel)}
                  className="flex-1 py-3.5 px-3 rounded-xl font-bold text-xs bg-white text-[#728479] border border-[#DCE6DF] hover:text-[#D14343] hover:border-rose-200 transition cursor-pointer"
                >
                  Decline
                </button>
              </div>

              {/* Decline Reason Panel */}
              {showDeclinePanel && (
                <div className="p-4 bg-[#EFF5F0] rounded-2xl border border-[#DCE6DF] space-y-2 animate-fadeIn">
                  <p className="text-xs font-semibold text-[#728479]">Reason for declining (shown to customer):</p>
                  <div className="space-y-1.5">
                    {[
                      'Out of stock on one or more items',
                      'Kitchen/store too busy right now',
                      'Closing soon',
                      'Other reason'
                    ].map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => handleSendDecline(reason)}
                        className="w-full text-left p-2.5 rounded-xl bg-white border border-[#DCE6DF] hover:border-[#D14343] text-xs font-medium text-gray-800 transition cursor-pointer"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Confirmed State */
            <div className="flex items-center gap-3 p-4 bg-[#EAFBF3] border border-[#BEEBD6] rounded-2xl text-xs text-[#048F63] animate-fadeIn">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C985] animate-pulse shrink-0" />
              <div>
                <b className="text-sm font-bold block">Order accepted — now preparing</b>
                <span className="text-[#728479]">Ready-by target: {prepMinutes} minutes from now</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
