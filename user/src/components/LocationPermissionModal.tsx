import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, CheckCircle2, AlertCircle, Search } from 'lucide-react';
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

    // Check if Capacitor native geolocation is available
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

    // Web Geolocation
    if ('geolocation' in navigator) {
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
            setErrorMessage('Location access was denied in your browser/device settings. Please allow permission or enter your delivery address manually.');
          } else if (error.code === error.TIMEOUT) {
            setErrorMessage('Location request timed out. Please try again or enter your location manually.');
          } else {
            setErrorMessage('Could not determine your device location. Please search for your delivery address manually.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLoading(false);
      setPermissionDenied(true);
      setErrorMessage('Geolocation is not supported by your browser. Please search for your delivery address manually.');
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
      // If geocoding fails, still keep coordinates
    }

    await checkStoreCoverage(lat, lon);
    setLoading(false);
    setTimeout(() => onClose(), 600);
  };

  const handleManualSearch = () => {
    onClose();
    if (onOpenManualSearch) {
      onOpenManualSearch();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-5 text-center relative border border-gray-100">
        {/* Top Icon Badge */}
        <div className="flex justify-center">
          {permissionDenied ? (
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shadow-inner relative border border-amber-200">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner relative border border-emerald-100">
              <MapPin className="w-8 h-8 text-emerald-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
            </div>
          )}
        </div>

        {/* Header Titles */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {permissionDenied ? 'Location Permission Denied' : 'Delivery Location'}
          </h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            {permissionDenied
              ? (errorMessage || 'CartCraze needs your location to check if Store #01 (Jaydev Vihar) delivers to you.')
              : 'CartCraze delivers fresh groceries within 5 km of our active darkstores. Allow location to check store availability.'}
          </p>
        </div>

        {detectedAddress && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{detectedAddress}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full bg-[#00676d] hover:bg-[#00555a] text-white font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-70"
          >
            <Navigation className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Detecting Real GPS...' : (permissionDenied ? 'Try Location Again' : 'Use Current Device Location')}</span>
          </button>

          <button
            type="button"
            onClick={handleManualSearch}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-70"
          >
            <Search className="w-3.5 h-3.5 text-gray-600" />
            <span>Enter Location Manually</span>
          </button>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-time GPS validation • CartCraze Store #01 Jaydev Vihar</span>
        </div>
      </div>
    </div>
  );
};
