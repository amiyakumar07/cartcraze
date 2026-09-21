import React, { useState } from 'react';
import { Store, Navigation, ShieldCheck, CheckCircle2, X } from 'lucide-react';
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
            const geo = await reverseGeocodeLocationIQ(lat, lon);
            setDetectedAddress(geo.address);
            setLoading(false);
            setTimeout(() => onClose({ lat, lon, address: geo.address }), 600);
          } catch {
            setLoading(false);
            onClose({ lat, lon, address: 'Darkstore GPS Location' });
          }
        },
        async () => {
          // Fallback to Jaydev Vihar, Bhubaneswar darkstore hub
          const lat = 20.3015;
          const lon = 85.8240;
          const address = 'Jaydev Vihar Square, Bhubaneswar, Odisha 751015';
          setDetectedAddress(address);
          setLoading(false);
          setTimeout(() => onClose({ lat, lon, address }), 600);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      const lat = 20.3015;
      const lon = 85.8240;
      setLoading(false);
      onClose({ lat, lon, address: 'Jaydev Vihar Square, Bhubaneswar, Odisha 751015' });
    }
  };

  const handleUseDefault = () => {
    onClose({ lat: 20.3015, lon: 85.8240, address: 'Jaydev Vihar Square, Bhubaneswar, Odisha 751015' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-sans">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-center relative border border-amber-100 overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(245, 158, 11, 0.1)'
        }}
      >
        {/* Subtle Top Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full opacity-70" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex justify-center pt-2">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-100 via-amber-50 to-yellow-50 border border-amber-200 flex items-center justify-center shadow-inner">
            <span className="absolute inset-0 rounded-full border border-amber-400/30 animate-ping opacity-60" />
            <div className="w-13 h-13 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
              <Store className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[10px] font-black uppercase tracking-wider">
            <span>Darkstore Geofencing</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Darkstore GPS Access Needed
          </h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
            CartCraze Shop Portal uses GPS location to automatically anchor your inventory dispatch point and reverse geocode Trade License coordinates.
          </p>
        </div>

        {detectedAddress && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">{detectedAddress}</span>
          </div>
        )}

        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 font-black text-xs py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-98"
          >
            <Navigation className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Detecting LocationIQ GPS...' : 'Approve Darkstore GPS Access'}</span>
          </button>

          <button
            type="button"
            onClick={handleUseDefault}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 rounded-2xl transition cursor-pointer"
          >
            Use Default Jaydev Vihar Darkstore Hub
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted with LocationIQ Reverse Geocoding</span>
        </div>
      </div>
    </div>
  );
};
