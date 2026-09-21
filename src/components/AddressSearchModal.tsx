import React, { useState } from 'react';
import { Search, MapPin, Navigation, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { searchLocationIQ, reverseGeocodeLocationIQ, type LocationSearchResult } from '../services/locationiq';

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: string, coords?: { lat: number; lon: number }) => void;
}

export const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAddress,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  if (!isOpen) return null;

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setGpsError('');
    if (val.trim().length >= 2) {
      setSearching(true);
      const searchRes = await searchLocationIQ(val);
      setResults(searchRes);
      setSearching(false);
    } else {
      setResults([]);
    }
  };

  const handleUseCurrentGps = () => {
    setGpsLoading(true);
    setGpsError('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await reverseGeocodeLocationIQ(lat, lon);
            const addr = typeof res === 'string' ? res : (res?.address || res?.fullAddress || res?.displayName || 'Current Location');
            setGpsLoading(false);
            onSelectAddress(addr, { lat, lon });
            onClose();
          } catch {
            setGpsLoading(false);
            onSelectAddress('Current Location', { lat, lon });
            onClose();
          }
        },
        (error) => {
          setGpsLoading(false);
          if (error.code === error.PERMISSION_DENIED) {
            setGpsError('GPS permission was denied. Please select or search your address below.');
          } else {
            setGpsError('Could not get GPS coordinates. Please search your address below.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGpsLoading(false);
      setGpsError('Geolocation is not supported. Please search your address below.');
    }
  };

  const quickZones = [
    { name: 'Jaydev Vihar Square, Bhubaneswar', desc: 'Store #01 — 5km Delivery Hub', lat: 20.3015, lon: 85.8240, active: true },
    { name: 'Nayapalli, Bhubaneswar', desc: 'Within Jaydev Vihar 5km Coverage', lat: 20.2980, lon: 85.8160, active: true },
    { name: 'IRC Village, Bhubaneswar', desc: 'Within Jaydev Vihar 5km Coverage', lat: 20.3040, lon: 85.8280, active: true },
    { name: 'Connaught Place, New Delhi', desc: 'Outside Service Radius (Waitlist Demo)', lat: 28.6315, lon: 77.2167, active: false },
    { name: 'HSR Layout, Bengaluru', desc: 'Outside Service Radius (Waitlist Demo)', lat: 12.9141, lon: 77.6411, active: false }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#00676d] text-white rounded-xl shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">Delivery Address</h3>
              <p className="text-[10px] text-gray-400 font-medium">Search city, area, or use GPS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleUseCurrentGps}
          disabled={gpsLoading}
          className="w-full bg-[#131b2e] hover:bg-[#1f2b48] text-amber-300 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-98 shrink-0"
        >
          {gpsLoading ? (
            <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 text-amber-300" />
          )}
          <span>{gpsLoading ? 'Detecting Device GPS...' : 'Use Current Device GPS Location'}</span>
        </button>

        {gpsError && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-medium flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Search Input */}
        <div className="relative shrink-0">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-3 focus-within:border-[#00676d] focus-within:ring-2 focus-within:ring-[#00676d]/20 transition">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search city, street or landmark..."
              className="w-full bg-transparent text-xs font-bold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
              autoFocus
            />
            {searching && <Loader2 className="w-4 h-4 text-[#00676d] animate-spin ml-2 shrink-0" />}
          </div>
        </div>

        {/* Results / Quick Zones */}
        <div className="space-y-1.5 overflow-y-auto no-scrollbar flex-1 min-h-0">
          {results.length > 0 ? (
            results.map((res: any) => {
              const placeId = res.place_id || res.placeId || res.display_name || res.displayName;
              const displayName = res.display_name || res.displayName || '';
              const latNum = parseFloat(res.lat);
              const lonNum = parseFloat(res.lon);
              return (
                <button
                  key={placeId}
                  onClick={() => {
                    const coords = !isNaN(latNum) && !isNaN(lonNum) ? { lat: latNum, lon: lonNum } : undefined;
                    onSelectAddress(displayName, coords);
                    onClose();
                  }}
                  className="w-full flex items-start gap-2.5 p-3 rounded-2xl hover:bg-[#f0f7f7] text-left transition cursor-pointer group border border-transparent hover:border-[#00676d]/20"
                >
                  <MapPin className="w-4 h-4 text-[#00676d] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-gray-900 block group-hover:text-[#00676d] leading-snug">
                      {displayName}
                    </span>
                    {!isNaN(latNum) && !isNaN(lonNum) && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        GPS: {latNum.toFixed(4)}, {lonNum.toFixed(4)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : query.trim().length >= 2 && !searching ? (
            <p className="text-xs text-center text-gray-400 py-6 font-medium">
              No matching locations found for "{query}". Try a city or landmark.
            </p>
          ) : (
            <div className="space-y-2 py-1">
              <span className="font-extrabold text-gray-600 uppercase tracking-wider block text-[10px]">
                Popular Quick Locations:
              </span>
              {quickZones.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => {
                    onSelectAddress(loc.name, { lat: loc.lat, lon: loc.lon });
                    onClose();
                  }}
                  className="w-full text-left p-2.5 bg-gray-50 hover:bg-[#f0f7f7] rounded-xl flex items-center justify-between transition group border border-transparent hover:border-[#00676d]/20"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900 group-hover:text-[#00676d] truncate">
                        {loc.name}
                      </span>
                      {loc.active && (
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0">
                          LIVE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 block truncate">{loc.desc}</span>
                  </div>
                  <Check className="w-3.5 h-3.5 text-[#00676d] opacity-0 group-hover:opacity-100 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
