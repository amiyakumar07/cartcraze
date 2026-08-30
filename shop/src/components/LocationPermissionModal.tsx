import React, { useState } from 'react';
import { Store, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
          const geo = await reverseGeocodeLocationIQ(lat, lon);
          setDetectedAddress(geo.address);
          setLoading(false);
          setTimeout(() => onClose({ lat, lon, address: geo.address }), 800);
        },
        async () => {
          const lat = 12.9141;
          const lon = 77.6411;
          const geo = await reverseGeocodeLocationIQ(lat, lon);
          setDetectedAddress(geo.address);
          setLoading(false);
          setTimeout(() => onClose({ lat, lon, address: geo.address }), 800);
        }
      );
    } else {
      const lat = 12.9141;
      const lon = 77.6411;
      setLoading(false);
      onClose({ lat, lon, address: 'HSR Layout, Sector 1, Bengaluru' });
    }
  };

  const handleUseDefault = () => {
    onClose({ lat: 12.9141, lon: 77.6411, address: 'Sector 1, HSR Layout, Bengaluru' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-sans">
      <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-5 text-center relative border border-gray-100">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-amber-400/20 text-amber-600 rounded-full flex items-center justify-center shadow-inner relative">
            <Store className="w-8 h-8 text-amber-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Darkstore GPS Access Needed</h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            CartCraze Shop Portal requires your darkstore location permission to auto-populate GPS coordinates &amp; reverse geocode your Trade License location via LocationIQ.
          </p>
        </div>

        {detectedAddress && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{detectedAddress}</span>
          </div>
        )}

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-98"
          >
            <Navigation className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Detecting LocationIQ GPS...' : 'Approve Darkstore Location Access'}</span>
          </button>

          <button
            type="button"
            onClick={handleUseDefault}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 rounded-2xl transition cursor-pointer"
          >
            Use Default HSR Layout Darkstore Location
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
