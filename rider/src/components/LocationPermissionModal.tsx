import React, { useState } from 'react';
import { reverseGeocodeLocationIQ } from '../services/locationiq';

interface Props {
  isOpen: boolean;
  onClose: (coords?: { lat: number; lon: number; address: string }) => void;
}

export const LocationPermissionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('');

  if (!isOpen) return null;

  const handleAllowLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const address = await reverseGeocodeLocationIQ(lat, lon);
            setDetectedAddress(address);
            setLoading(false);
            setTimeout(() => onClose({ lat, lon, address }), 600);
          } catch {
            setLoading(false);
            onClose({ lat, lon, address: 'Current Rider GPS Location' });
          }
        },
        async () => {
          // Fallback to Jaydev Vihar, Bhubaneswar Store #01 Hub
          const lat = 20.3015;
          const lon = 85.8240;
          const address = 'Store #01 Jaydev Vihar Hub, Bhubaneswar, Odisha 751015';
          setDetectedAddress(address);
          setLoading(false);
          setTimeout(() => onClose({ lat, lon, address }), 600);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLoading(false);
      onClose({ lat: 20.3015, lon: 85.8240, address: 'Store #01 Jaydev Vihar Hub, Bhubaneswar, Odisha 751015' });
    }
  };

  const handleUseDefault = () => {
    onClose({ lat: 20.3015, lon: 85.8240, address: 'Store #01 Jaydev Vihar Hub, Bhubaneswar, Odisha 751015' });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-sans">
      <div 
        className="w-full sm:max-w-sm bg-[#121815] text-white rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl space-y-5 text-center relative border border-emerald-500/20 overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.12)'
        }}
      >
        {/* Glowing Top Pill */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#10b981] to-transparent rounded-full opacity-80" />

        {/* Radar Icon Badge */}
        <div className="flex justify-center pt-2">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-950/80 via-emerald-900/40 to-emerald-800/30 flex items-center justify-center border border-emerald-500/30 shadow-lg">
            <span className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping opacity-75" />
            <div className="w-13 h-13 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-gray-950 shadow-md">
              <span className="material-symbols-outlined text-[28px] font-bold">near_me</span>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
            <span>Rider GPS Tracking</span>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            Enable Live GPS Access
          </h2>

          <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
            CartCraze Rider Portal requires device location for precision 9-min order dispatch, routing, and live customer tracking.
          </p>
        </div>

        {/* Detected Chip */}
        {detectedAddress && (
          <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 text-left">
            <span className="material-symbols-outlined text-emerald-400 text-[18px] shrink-0">check_circle</span>
            <span className="truncate">{detectedAddress}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-black text-xs py-4 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-75"
          >
            <span className="material-symbols-outlined text-[18px]">
              {loading ? 'sync' : 'gps_fixed'}
            </span>
            <span>{loading ? 'Detecting Device GPS...' : 'Approve Rider Location Access'}</span>
          </button>

          <button
            onClick={handleUseDefault}
            className="w-full bg-gray-900/90 hover:bg-gray-800 border border-gray-800 text-gray-300 font-bold text-xs py-3 px-4 rounded-2xl transition cursor-pointer"
          >
            Use Store #01 Jaydev Vihar Rider Base
          </button>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-medium pt-1">
          <span className="material-symbols-outlined text-[14px] text-emerald-500">verified_user</span>
          <span>LocationIQ Live Tracking • Encrypted Delivery Protocol</span>
        </div>
      </div>
    </div>
  );
};
