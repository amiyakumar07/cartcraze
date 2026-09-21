import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, CheckCircle2, AlertCircle, Search, X, Sparkles, Zap, Store } from 'lucide-react';
import { reverseGeocodeLocationIQ } from '../services/locationiq';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenManualSearch?: () => void;
}

export const LocationPermissionModal: React.FC<Props> = ({ isOpen, onClose, onOpenManualSearch }) => {
  const { setUserCoords, setUserProfile, checkStoreCoverage } = useApp();
  const [loading, setLoading] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAllowLocation = async () => {
    setLoading(true);
    setPermissionDenied(false);
    setErrorMessage('');

    // 1. Check native Capacitor geolocation if available
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.();
    if (isNative && (window as any).Capacitor?.Plugins?.Geolocation) {
      try {
        const Geolocation = (window as any).Capacitor.Plugins.Geolocation;
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        await processLocationSuccess(lat, lon);
        return;
      } catch (err: any) {
        console.warn('Native geolocation failed, falling back to web:', err);
      }
    }

    // 2. Web Geolocation API
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          await processLocationSuccess(lat, lon);
        },
        (error) => {
          setLoading(false);
          setPermissionDenied(true);
          if (error.code === error.PERMISSION_DENIED) {
            setErrorMessage('Location permission is disabled in your browser. You can enable it in site settings or explore our active Jaydev Vihar store.');
          } else if (error.code === error.TIMEOUT) {
            setErrorMessage('GPS detection timed out. Please try again or choose a location below.');
          } else {
            setErrorMessage('Unable to resolve GPS position. You can search or explore our store directly.');
          }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
      );
    } else {
      setLoading(false);
      setPermissionDenied(true);
      setErrorMessage('Geolocation is not supported by your current browser.');
    }
  };

  const processLocationSuccess = async (lat: number, lon: number) => {
    setUserCoords({ lat, lon });
    localStorage.setItem('cartcraze_location_granted', 'true');
    localStorage.setItem('cartcraze_user_coords', JSON.stringify({ lat, lon }));

    try {
      const geo = await reverseGeocodeLocationIQ(lat, lon);
      const addr = typeof geo === 'string' ? geo : (geo?.address || geo?.fullAddress || geo?.displayName || 'Current Location');
      setDetectedAddress(addr);
      localStorage.setItem('cartcraze_user_selected_address', addr);
      setUserProfile((prev) => ({ ...prev, address: addr }));
    } catch {
      // Keep coordinates even if reverse geocode fails
    }

    await checkStoreCoverage(lat, lon);
    setLoading(false);
    setTimeout(() => onClose(), 600);
  };

  const handleExploreDemoStore = async () => {
    setLoading(true);
    // Jaydev Vihar, Bhubaneswar darkstore coordinates
    const lat = 20.3015;
    const lon = 85.8240;
    const addr = 'Jaydev Vihar Square, Bhubaneswar, Odisha 751015';

    setUserCoords({ lat, lon });
    localStorage.setItem('cartcraze_location_granted', 'true');
    localStorage.setItem('cartcraze_user_coords', JSON.stringify({ lat, lon }));
    localStorage.setItem('cartcraze_user_selected_address', addr);
    setUserProfile((prev) => ({ ...prev, address: addr }));
    setDetectedAddress(addr);

    await checkStoreCoverage(lat, lon);
    setLoading(false);
    onClose();
  };

  const handleManualSearch = () => {
    onClose();
    if (onOpenManualSearch) {
      onOpenManualSearch();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-center relative border border-gray-100 overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(0, 103, 109, 0.08)'
        }}
      >
        {/* Subtle Top Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-transparent via-[#00676d] to-transparent rounded-full opacity-60" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100/80 hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Radar Icon Badge */}
        <div className="flex justify-center pt-2">
          {permissionDenied ? (
            <div className="relative w-20 h-20 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-inner">
              <AlertCircle className="w-10 h-10 text-amber-600" />
            </div>
          ) : (
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#e6f5f5] via-[#d0f0ee] to-[#b3e8e5] flex items-center justify-center shadow-md">
              {/* Radar Rings */}
              <span className="absolute inset-0 rounded-full border-2 border-[#00676d]/20 animate-ping opacity-60" />
              <span className="absolute -inset-2 rounded-full border border-[#00676d]/15" />
              <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#00676d] to-[#004f54] flex items-center justify-center text-white shadow-lg">
                <MapPin className="w-7 h-7" />
              </div>
            </div>
          )}
        </div>

        {/* Headline & Description */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>10-15 Min Express Grocery Delivery</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {permissionDenied ? 'Location Permission Paused' : 'Enable Device Location'}
          </h2>

          <p className="text-xs text-gray-600 font-normal leading-relaxed max-w-sm mx-auto">
            {permissionDenied
              ? (errorMessage || 'CartCraze needs location access to connect you with our nearest dark store.')
              : 'Allow GPS access to see live inventory, instant delivery times, and get your fresh essentials delivered in 10-15 mins.'}
          </p>
        </div>

        {/* Feature Value Props Pills */}
        {!permissionDenied && (
          <div className="grid grid-cols-3 gap-2 py-1 text-left">
            <div className="bg-gray-50/90 border border-gray-100 rounded-2xl p-2.5 flex flex-col items-center text-center">
              <Zap className="w-4 h-4 text-[#00676d] mb-1" />
              <span className="text-[10px] font-bold text-gray-800">10-15 Mins</span>
              <span className="text-[9px] text-gray-500">Fast Drop</span>
            </div>
            <div className="bg-gray-50/90 border border-gray-100 rounded-2xl p-2.5 flex flex-col items-center text-center">
              <Store className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-800">Live Stock</span>
              <span className="text-[9px] text-gray-500">Darkstore #01</span>
            </div>
            <div className="bg-gray-50/90 border border-gray-100 rounded-2xl p-2.5 flex flex-col items-center text-center">
              <ShieldCheck className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-800">Accurate</span>
              <span className="text-[9px] text-gray-500">To Doorstep</span>
            </div>
          </div>
        )}

        {/* Detected Address Confirmation */}
        {detectedAddress && (
          <div className="bg-emerald-50 border border-emerald-200/80 text-emerald-900 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{detectedAddress}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Primary CTA */}
          <button
            type="button"
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00676d] to-[#005156] hover:from-[#00555a] hover:to-[#004044] text-white font-bold text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#00676d]/20 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-75"
          >
            <Navigation className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>
              {loading
                ? 'Detecting Real GPS...'
                : permissionDenied
                ? 'Try Location Again'
                : 'Share Device Location'}
            </span>
          </button>

          {/* Quick Explore Demo Store Button */}
          <button
            type="button"
            onClick={handleExploreDemoStore}
            disabled={loading}
            className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Explore Store #01 Jaydev Vihar (Live Demo)</span>
          </button>

          {/* Secondary Manual Search */}
          <button
            type="button"
            onClick={handleManualSearch}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-gray-500" />
            <span>Search Delivery Address Manually</span>
          </button>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium pt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-time GPS validation • CartCraze Darkstore Network</span>
        </div>
      </div>
    </div>
  );
};
