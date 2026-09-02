import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Store, X, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { reverseGeocodeDetailedLocationIQ } from '../services/locationiq';
import { useApp } from '../context/AppContext';

interface LocationStoreAvailabilitySheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  activeStoreName?: string;
  activeStoreDistanceKm?: number;
  onAddressSelect?: (newAddress: string, lat?: number, lon?: number) => void;
}

export const LocationStoreAvailabilitySheet: React.FC<LocationStoreAvailabilitySheetProps> = ({
  isOpen,
  onClose,
  currentAddress,
  activeStoreName = 'Patia DarkStore Hub #3',
  activeStoreDistanceKm = 1.2,
  onAddressSelect
}) => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const { isOutOfCoverageRange, isStoreClosed, activeStore } = useApp();

  if (!isOpen) return null;

  const handleAutoGPS = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const geo = await reverseGeocodeDetailedLocationIQ(lat, lon);
            if (onAddressSelect) {
              onAddressSelect(geo.displayName || `${geo.street}, ${geo.village}, ${geo.city}`, lat, lon);
            }
          } catch {
            if (onAddressSelect) {
              onAddressSelect(`GPS Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`, lat, lon);
            }
          }
          setGpsLoading(false);
          onClose();
        },
        () => {
          setGpsLoading(false);
          alert('Location permission denied. Please allow browser location access.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsLoading(false);
    }
  };

  const storeName = activeStore ? activeStore.name : activeStoreName;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 font-[Inter,sans-serif]">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn border border-emerald-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900">
            <MapPin className="w-5 h-5 text-[#006C49]" />
            <h3 className="font-extrabold text-base">Select Delivery Location</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Darkstore Availability / Coverage Card */}
        <div className={`rounded-2xl p-4 space-y-2 border relative overflow-hidden shadow-lg ${
          isStoreClosed
            ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 border-amber-500/40 text-white'
            : 'bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border-emerald-500/40 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1 ${
              isStoreClosed
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
            }`}>
              {isStoreClosed ? (
                <AlertCircle className="w-3 h-3 text-amber-400" />
              ) : (
                <Zap className="w-3 h-3 text-amber-400" />
              )}
              <span>{isStoreClosed ? 'Store Offline' : 'Coverage Confirmed'}</span>
            </span>
            <span className={`text-white text-[10px] font-black px-2 py-0.5 rounded-md ${
              isStoreClosed ? 'bg-amber-600' : 'bg-[#006C49] animate-pulse'
            }`}>
              {isStoreClosed ? 'CLOSED' : 'LIVE'}
            </span>
          </div>

          <div>
            <div className="text-lg font-black text-white flex items-center gap-2">
              <span>{isStoreClosed ? '🌙 Store Currently Closed' : '⚡ 8 - 10 Mins Delivery'}</span>
            </div>
            <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fulfilled by {storeName} ({activeStoreDistanceKm.toFixed(1)} km away)</span>
            </div>
          </div>
        </div>

        {/* Use Current GPS Location Button */}
        <button
          onClick={handleAutoGPS}
          disabled={gpsLoading}
          className="w-full bg-[#006C49] hover:bg-emerald-800 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-75"
        >
          <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
          <span>{gpsLoading ? 'Detecting LocationIQ GPS...' : 'Use Current GPS Location'}</span>
        </button>

        {/* Saved Addresses List */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Current Selected Address</div>
          <div className="bg-emerald-50/60 border-2 border-[#006C49]/40 rounded-2xl p-3.5 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#006C49] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                🏠
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span>Home</span>
                  <span className="bg-emerald-200 text-[#00422B] text-[10px] font-bold px-1.5 py-0.5 rounded">Active</span>
                </div>
                <div className="text-xs text-slate-600 font-medium line-clamp-2 mt-0.5">
                  {currentAddress}
                </div>
              </div>
            </div>
            <Check className="w-5 h-5 text-[#006C49] shrink-0 mt-1" />
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#006C49]" />
          <span>LocationIQ GPS Geocoding Enabled</span>
        </div>
      </div>
    </div>
  );
};
