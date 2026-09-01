import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { reverseGeocodeLocationIQ, reverseGeocodeDetailedLocationIQ } from '../services/locationiq';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationPermissionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { setUserCoords, setUserProfile, checkStoreCoverage } = useApp();
  const [loading, setLoading] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('');

  if (!isOpen) return null;

  const handleAllowLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setUserCoords({ lat, lon });

            const detailed = await reverseGeocodeDetailedLocationIQ(lat, lon);
            setDetectedAddress(detailed.displayName);
            setUserProfile((prev) => ({
              ...prev,
              address: detailed.displayName,
              pincode: detailed.pincode,
              village: detailed.village,
              street: detailed.street,
              landmark: detailed.landmark
            }));

            await checkStoreCoverage(lat, lon);
          } catch (e) {
            console.warn('Coverage check error:', e);
          } finally {
            setLoading(false);
            setTimeout(() => onClose(), 600);
          }
        },
        async () => {
          try {
            const fallbackLat = 12.9141;
            const fallbackLon = 77.6411;
            setUserCoords({ lat: fallbackLat, lon: fallbackLon });
            const addressString = await reverseGeocodeLocationIQ(fallbackLat, fallbackLon);
            setDetectedAddress(addressString);
            setUserProfile((prev) => ({ ...prev, address: addressString }));

            await checkStoreCoverage(fallbackLat, fallbackLon);
          } catch (e) {
            console.warn('Coverage check error:', e);
          } finally {
            setLoading(false);
            setTimeout(() => onClose(), 600);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      const fallbackLat = 12.9141;
      const fallbackLon = 77.6411;
      setUserCoords({ lat: fallbackLat, lon: fallbackLon });
      checkStoreCoverage(fallbackLat, fallbackLon).finally(() => {
        setLoading(false);
        onClose();
      });
    }
  };

  const handleUseDefault = async () => {
    setLoading(true);
    try {
      const fallbackLat = 12.9141;
      const fallbackLon = 77.6411;
      setUserCoords({ lat: fallbackLat, lon: fallbackLon });
      const addressString = await reverseGeocodeLocationIQ(fallbackLat, fallbackLon);
      setUserProfile((prev) => ({ ...prev, address: addressString }));
      await checkStoreCoverage(fallbackLat, fallbackLon);
    } catch (e) {
      console.warn('Coverage check error:', e);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-5 text-center relative border border-gray-100">
        {/* Top Icon Badge */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-amber-400/20 text-amber-600 rounded-full flex items-center justify-center shadow-inner relative">
            <MapPin className="w-8 h-8 text-amber-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
          </div>
        </div>

        {/* Header Titles */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Location Access Needed</h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            CartCraze uses real-time LocationIQ GPS to verify if 9-minute instant grocery darkstores are near your location.
          </p>
        </div>

        {detectedAddress && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{detectedAddress}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-70"
          >
            <Navigation className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Checking Darkstore Coverage...' : 'Allow Location Access'}</span>
          </button>

          <button
            type="button"
            onClick={handleUseDefault}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 rounded-2xl transition cursor-pointer disabled:opacity-70"
          >
            Use Default HSR Layout Location
          </button>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted with LocationIQ Live Reverse Geocoding</span>
        </div>
      </div>
    </div>
  );
};
