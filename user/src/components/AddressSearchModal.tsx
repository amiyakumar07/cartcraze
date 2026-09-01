import React, { useState } from 'react';
import { Search, MapPin, Navigation, X, Check, Loader2 } from 'lucide-react';
import { searchLocationIQ, reverseGeocodeLocationIQ, type LocationSearchResult } from '../services/locationiq';

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: string) => void;
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

  if (!isOpen) return null;

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
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
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const fullAddress = await reverseGeocodeLocationIQ(position.coords.latitude, position.coords.longitude);
          setGpsLoading(false);
          onSelectAddress(fullAddress);
          onClose();
        },
        async () => {
          const fullAddress = await reverseGeocodeLocationIQ(12.9141, 77.6411);
          setGpsLoading(false);
          onSelectAddress(fullAddress);
          onClose();
        }
      );
    } else {
      onSelectAddress('HSR Layout, Sector 1, Bengaluru');
      setGpsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4 border border-gray-100 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400 text-black rounded-xl shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">LocationIQ Address Search</h3>
              <p className="text-[10px] text-gray-400 font-medium">Real-Time Geocoding &amp; Autocomplete</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GPS Live Locate Button */}
        <button
          onClick={handleUseCurrentGps}
          disabled={gpsLoading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-98"
        >
          {gpsLoading ? (
            <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 text-amber-300" />
          )}
          <span>{gpsLoading ? 'LocationIQ Geocoding GPS...' : 'Use Current Device GPS Location'}</span>
        </button>

        {/* Search Input Box */}
        <div className="relative">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search city, area, street or landmark..."
              className="w-full bg-transparent text-xs font-bold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
            />
            {searching && <Loader2 className="w-4 h-4 text-amber-500 animate-spin ml-2 shrink-0" />}
          </div>
        </div>

        {/* Search Results List */}
        <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar">
          {results.length > 0 ? (
            results.map((res) => (
              <button
                key={res.placeId || res.displayName}
                onClick={() => {
                  onSelectAddress(res.displayName);
                  onClose();
                }}
                className="w-full flex items-start gap-2.5 p-3 rounded-2xl hover:bg-amber-50 text-left transition cursor-pointer group border border-transparent hover:border-amber-200"
              >
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-gray-900 block group-hover:text-amber-800 leading-snug">
                    {res.displayName}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Lat: {res.lat.toFixed(4)}, Lon: {res.lon.toFixed(4)} (LocationIQ)
                  </span>
                </div>
              </button>
            ))
          ) : query.trim().length >= 2 && !searching ? (
            <p className="text-xs text-center text-gray-400 py-4 font-medium">
              No location matches found. Try "HSR Layout", "Indiranagar", or "Koramangala"
            </p>
          ) : (
            <div className="text-[11px] text-gray-400 py-2 space-y-1.5">
              <span className="font-bold text-gray-700 uppercase tracking-wider block text-[10px]">Popular Delivery Zones:</span>
              {['HSR Layout, Sector 1, Bengaluru', 'Koramangala 5th Block, Bengaluru', 'Indiranagar 100ft Road, Bengaluru'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    onSelectAddress(loc);
                    onClose();
                  }}
                  className="w-full text-left py-1.5 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 font-medium flex items-center justify-between text-xs transition"
                >
                  <span>{loc}</span>
                  <Check className="w-3.5 h-3.5 text-gray-400 opacity-0 hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
