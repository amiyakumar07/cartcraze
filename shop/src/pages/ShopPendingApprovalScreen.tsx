import React, { useEffect, useRef } from 'react';
import { Clock, ShieldAlert, Store, RefreshCw, CheckCircle2, MapPin, Phone, Mail, Loader2 } from 'lucide-react';

interface ShopPendingApprovalScreenProps {
  shopData: any;
  onRefreshStatus?: () => void;
  onApproved?: () => void;
}

export const ShopPendingApprovalScreen: React.FC<ShopPendingApprovalScreenProps> = ({
  shopData,
  onRefreshStatus,
  onApproved,
}) => {
  const isRejected = shopData?.status === 'REJECTED';
  const isPending = shopData?.status === 'PENDING_APPROVAL';
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-poll backend every 5s
  useEffect(() => {
    if (!isPending) return;

    intervalRef.current = setInterval(async () => {
      try {
        const API = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:4000/api'
          : 'https://cartcraze-95gt.onrender.com/api';
        const res = await fetch(`${API}/shops`);
        const data = await res.json();
        if (data.shops) {
          const found = data.shops.find(
            (s: any) =>
              s.id === shopData?.id ||
              s.email === shopData?.email ||
              s.name === shopData?.name
          );
          if (found?.status === 'APPROVED') {
            clearInterval(intervalRef.current!);
            if (onApproved) onApproved();
          } else if (found && onRefreshStatus) {
            onRefreshStatus();
          }
        }
      } catch { /* silent */ }
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPending, shopData?.id]);

  const steps = [
    { label: 'Application Submitted', done: true },
    { label: 'Super Admin Review', done: !isPending, active: isPending },
    { label: 'License Verification', done: !isPending && !isRejected, active: isPending },
    { label: 'Account Activated', done: false, active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Icon Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className={`p-4 rounded-3xl shadow-xl border ${
              isRejected
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {isRejected
                ? <ShieldAlert className="w-10 h-10 animate-pulse" />
                : <Clock className="w-10 h-10 animate-bounce" />
              }
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">
              {isRejected ? 'Application Declined' : 'Under Admin Review'}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {isRejected
                ? 'Your shop registration was declined by Super Admin. Contact support to re-apply.'
                : 'Auto-checking approval status every 5 seconds...'}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        {!isRejected && (
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                  step.done
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : step.active
                    ? 'bg-amber-500 border-amber-500 text-black'
                    : 'bg-slate-800 border-slate-700 text-slate-600'
                }`}>
                  {step.done ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : step.active ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <span className="text-[10px] font-black">{i + 1}</span>
                  )}
                </div>
                <span className={`text-xs font-bold ${
                  step.done ? 'text-emerald-400' : step.active ? 'text-amber-400' : 'text-slate-600'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Shop Info Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2.5 text-xs">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Application Details</h4>
          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold">
              <Store className="w-3.5 h-3.5" />
              <span>Shop Name</span>
            </div>
            <span className="font-black text-amber-400">{shopData?.name || 'My Darkstore'}</span>
          </div>
          {shopData?.address && (
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Address</span>
              </div>
              <span className="font-medium text-slate-300 text-right max-w-[55%] text-[11px]">
                {shopData.address}
              </span>
            </div>
          )}
          {shopData?.phone && (
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <Phone className="w-3.5 h-3.5" />
                <span>Phone</span>
              </div>
              <span className="font-medium text-slate-300">{shopData.phone}</span>
            </div>
          )}
          {shopData?.licenseNumber && (
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <span>License #</span>
              </div>
              <span className="font-mono text-slate-200">{shopData.licenseNumber}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-400">Status</span>
            <span className={`font-black px-2.5 py-1 rounded-full text-[10px] uppercase border ${
              isRejected
                ? 'bg-red-950 text-red-400 border-red-800'
                : 'bg-amber-950 text-amber-400 border-amber-800'
            }`}>
              {shopData?.status || 'PENDING_APPROVAL'}
            </span>
          </div>
        </div>

        {/* Auto-poll indicator */}
        {isPending && (
          <div className="flex items-center gap-2 bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-700">
            <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
            <p className="text-[11px] text-slate-400 font-medium">
              Auto-refreshing every 5s — You'll be redirected instantly upon approval
            </p>
          </div>
        )}

        {/* Manual Refresh + Contact */}
        <div className="space-y-2 pt-1">
          {onRefreshStatus && (
            <button
              onClick={onRefreshStatus}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Check Status Now</span>
            </button>
          )}
          {isRejected && (
            <a
              href="mailto:admin@cartcraze.app"
              className="w-full bg-amber-400 hover:bg-amber-500 text-black font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Partner Support</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
