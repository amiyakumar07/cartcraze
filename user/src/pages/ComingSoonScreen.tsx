import React, { useState, useEffect } from 'react';
import { MapPin, Bell, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ComingSoonScreenProps {
  userLocationAddress?: string;
  onSearchNewAddress?: () => void;
}

export const ComingSoonScreen: React.FC<ComingSoonScreenProps> = ({
  userLocationAddress = 'Selected Location (Out of 5km Range)',
  onSearchNewAddress,
}) => {
  const { setUserProfile, checkStoreCoverage } = useApp();
  const [notified, setNotified] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [activeShops, setActiveShops] = useState<{ id: string; name: string; address: string }[]>([]);

  // Dynamically check if any approved darkstores exist on server
  useEffect(() => {
    let isMounted = true;
    const API = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:4000/api'
      : 'https://cartcraze-95gt.onrender.com/api';

    fetch(`${API}/shops?status=APPROVED`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.shops)) {
          setActiveShops(data.shops);
        }
      })
      .catch(() => {
        if (isMounted) setActiveShops([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    setNotified(true);
  };

  const handleQuickSwitchLocation = (locationName: string) => {
    setUserProfile((prev) => ({
      ...prev,
      address: locationName
    }));
    checkStoreCoverage();
  };

  return (
    <div className="bg-[#F4FBF4] min-h-[85vh] flex flex-col justify-between p-4 pb-28 font-[Inter,sans-serif] animate-fadeIn max-w-md mx-auto">
      {/* ── Top Header Location Bar ── */}
      <div className="space-y-3">
        <div className="bg-white rounded-2xl p-3 border border-emerald-100 shadow-2xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">
                UNSERVICEABLE AREA
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">{userLocationAddress}</p>
            </div>
          </div>

          {onSearchNewAddress && (
            <button
              onClick={onSearchNewAddress}
              data-testid="change_location_unserviceable_btn"
              className="px-3 py-1.5 bg-[#006C49] hover:bg-emerald-800 text-white font-black text-[11px] rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95"
            >
              CHANGE
            </button>
          )}
        </div>

        {/* ── Zepto / Blinkit Style Hero Card ── */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center space-y-4 shadow-sm pt-8">
          {/* Out-of-area Graphic Illustration */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-100/60 rounded-full animate-ping" />
            <div className="w-20 h-20 bg-gradient-to-tr from-[#006C49] to-[#10B981] rounded-full flex items-center justify-center text-white text-3xl shadow-lg relative z-10">
              🛵
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-black text-slate-900 leading-tight">
              We are not here in your area yet!
            </h1>
            <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
              CartCraze delivers fresh groceries in under 8-10 minutes. We are rapidly expanding our darkstores and hope to serve your location very soon!
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#006C49] font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-[#006C49]" />
            <span>Expanding Express Darkstores Daily</span>
          </div>
        </div>

        {/* ── Alternative Active Stores (If available on server) ── */}
        {activeShops.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Try Ordering from Serviced Locations:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeShops.map((shop) => (
                <button
                  key={shop.id}
                  onClick={() => handleQuickSwitchLocation(shop.address || shop.name)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[#006C49] font-extrabold text-xs px-3 py-1.5 rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{shop.name}</span>
                  <ArrowRight className="w-3 h-3 text-[#006C49]" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Zepto / Blinkit Bottom Action: NOTIFY ME WHEN AVAILABLE ── */}
      <div className="space-y-3 pt-4">
        {notified ? (
          <div className="bg-emerald-500 text-white rounded-3xl p-5 shadow-lg text-center space-y-2 animate-fadeIn">
            <CheckCircle2 className="w-8 h-8 text-white mx-auto" />
            <h3 className="text-sm font-black">You are on the VIP Launch List! 🎉</h3>
            <p className="text-xs text-emerald-100 font-semibold leading-relaxed">
              We'll send an instant notification as soon as CartCraze launches 8-minute delivery in your area!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-lg space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#131B2E] text-yellow-300 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Get Notified on Launch</h3>
                <p className="text-xs text-slate-500 font-medium">Be the first to know when 8-minute delivery arrives!</p>
              </div>
            </div>

            <form onSubmit={handleNotifyMe} className="space-y-2">
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="Enter your phone number or email..."
                data-testid="notify_me_input"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#006C49] focus:bg-white transition-all"
              />
              <button
                type="submit"
                data-testid="notify_me_btn"
                className="w-full py-3.5 bg-[#10B981] hover:bg-emerald-400 text-[#00422B] font-black text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Bell className="w-4 h-4" /> Notify Me When Available
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#006C49]" />
          <span>100% Quality & 8-Minute Delivery Speed Guarantee</span>
        </div>
      </div>
    </div>
  );
};
