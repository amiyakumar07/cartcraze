import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Bell, Compass, CheckCircle2, ArrowRight, ShieldCheck, Zap, Sparkles, Rocket, Clock, Star, AlertTriangle, ExternalLink } from 'lucide-react';
import { LOCATIONIQ_API_KEY } from '../services/locationiq';
import { useApp } from '../context/AppContext';

interface ComingSoonScreenProps {
  userLocationAddress?: string;
  onSearchNewAddress?: () => void;
}

const OutOfCoverageMap: React.FC<{ userAddress?: string }> = ({ userAddress }) => {
  const { userCoords, userProfile } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const lat = userCoords?.lat ?? 20.2320;
  const lon = userCoords?.lon ?? 85.8302;
  const displayAddress = userAddress || userProfile?.address || 'Your Selected Location';

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      const tileUrl = `https://a-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_API_KEY}`;
      L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      // Customer Location Pin (Red)
      const userIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background: #ef4444; color: white; padding: 6px 10px; border-radius: 12px; font-weight: 900; font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
            🏠 You
          </div>
        `,
        iconSize: [60, 30],
        iconAnchor: [30, 15]
      });
      L.marker([lat, lon], { icon: userIcon }).addTo(map).bindPopup(`<b>Your Location</b><br/>${displayAddress}`);

      // 5km Out of Coverage Radius Circle (Red Dashed)
      L.circle([lat, lon], {
        color: '#ef4444',
        fillColor: '#f87171',
        fillOpacity: 0.15,
        radius: 5000,
        dashArray: '6, 6'
      }).addTo(map);

      mapInstanceRef.current = map;
    } catch { /* silent */ }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon]);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-xl border border-red-100 space-y-3 font-sans relative overflow-hidden">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="font-extrabold text-red-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>Outside 5.0 km Darkstore Radius</span>
          </span>
        </div>
      </div>

      <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        <div className="absolute bottom-2 right-2 z-20 bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-lg border border-red-400 flex items-center gap-1">
          <span>⚠️ Out of 5.0 km Service Zone</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
        <span className="font-bold text-gray-700 truncate max-w-[240px]">
          📍 Location: {displayAddress}
        </span>
        <a
          href={`https://maps.google.com/?q=${lat},${lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 font-extrabold hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Open Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export const ComingSoonScreen: React.FC<ComingSoonScreenProps> = ({
  userLocationAddress = 'Selected Location (Out of 5km Range)',
  onSearchNewAddress,
}) => {
  const { setUserProfile, checkStoreCoverage } = useApp();
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState('');
  const [activeShops, setActiveShops] = useState<{ id: string; name: string; address: string }[]>([]);

  // Dynamically check if any approved darkstores exist in backend
  useEffect(() => {
    let isMounted = true;
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    fetch(`http://${hostname}:4000/api/shops?status=APPROVED`)
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
    if (email.trim()) {
      setNotified(true);
    }
  };

  const handleQuickSwitchLocation = (locationName: string) => {
    setUserProfile((prev) => ({
      ...prev,
      address: locationName
    }));
    checkStoreCoverage();
  };

  return (
    <div className="p-4 space-y-5 pb-28 font-sans max-w-md mx-auto animate-fadeIn">
      {/* Premium Hero Gradient Banner with Glassmorphism */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-2xl border border-yellow-400/30 relative overflow-hidden space-y-4">
        {/* Glow Ambient Circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-yellow-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="flex justify-between items-center z-10 relative">
          <div className="bg-yellow-400/20 text-yellow-300 text-[10px] font-black px-3 py-1 rounded-full border border-yellow-400/30 flex items-center gap-1.5 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 fill-yellow-300 animate-pulse text-yellow-300" />
            <span>EXPRESS 5KM EXPANSION</span>
          </div>

          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-md border border-slate-700">
            SLA: 9 MINS
          </span>
        </div>

        {/* Header Title & Rocket Animation */}
        <div className="z-10 relative space-y-2">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 text-black rounded-2xl shadow-lg shrink-0 animate-bounce">
              <Rocket className="w-6 h-6 fill-black" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white leading-tight">
                Coming Soon to Your Area!
              </h2>
              <p className="text-xs text-yellow-300/90 font-extrabold mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span>Launching Hyper-Local Darkstore #15</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
            We are currently building darkstore coverage to deliver fresh groceries in under 9 minutes to your area!
          </p>
        </div>

        {/* Customer Selected Address Bar */}
        <div className="z-10 relative bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200 truncate">{userLocationAddress}</span>
          </div>
          {onSearchNewAddress && (
            <button
              onClick={onSearchNewAddress}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 active:scale-95 shadow-sm"
            >
              CHANGE
            </button>
          )}
        </div>
      </div>

      {/* Customer Home Location Out-of-Coverage Map */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-black text-gray-900 flex items-center gap-1">
            <Compass className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Customer Location (Leaflet GPS)</span>
          </span>
          <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Outside 5.0 km Zone
          </span>
        </div>
        <OutOfCoverageMap userAddress={userLocationAddress} />
      </div>

      {/* Dynamic Available Darkstores Section (Only shown if real approved stores exist) */}
      {activeShops.length > 0 ? (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-4 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wider block">
              📍 Explore Active Store Delivery Zones:
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              {activeShops.length} Active Stores
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeShops.map((shop) => (
              <button
                key={shop.id}
                onClick={() => handleQuickSwitchLocation(shop.address || shop.name)}
                className="bg-white hover:bg-amber-400 hover:text-slate-950 border border-amber-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{shop.name}</span>
                <ArrowRight className="w-3 h-3 text-amber-600" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/90 text-white border border-slate-800 rounded-3xl p-4 space-y-2 text-xs shadow-md">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>No Darkstores Active Currently in Your Area</span>
          </div>
          <p className="text-slate-300 text-[11px] font-medium leading-relaxed">
            CartCraze strictly operates with verified 5km darkstores. Partner onboarding is currently in progress for new franchise stores. Leave your email below to get notified when a store goes live!
          </p>
        </div>
      )}

      {/* Stylish Notify Me Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 text-yellow-300 rounded-2xl shadow-md">
            <Bell className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Get Early Access &amp; Launch Offer</h3>
            <p className="text-xs text-gray-500 font-medium">Get ₹100 Free Wallet Credit when we launch in your area!</p>
          </div>
        </div>

        {notified ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold text-emerald-900">You are on the VIP Launch List! 🎉</p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">We will send an SMS &amp; Email notification as soon as darkstore #15 opens!</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleNotifyMe} className="space-y-2.5 pt-1">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 outline-none focus:border-amber-400 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-yellow-300 font-black text-xs py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Bell className="w-4 h-4 text-yellow-300" />
              <span>NOTIFY ME ON LAUNCH (+ ₹100 CREDIT)</span>
            </button>
          </form>
        )}
      </div>

      {/* Feature Bullet points */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/60 space-y-2 text-xs text-gray-600 font-semibold">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Strict 5 km freshness &amp; 9-minute speed radius guard</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <span>60-second darkstore packing SLA guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 shrink-0" />
          <span>100% Quality Assurance or Instant Wallet Refund</span>
        </div>
      </div>
    </div>
  );
};
