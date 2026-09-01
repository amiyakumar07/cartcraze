import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, MapPin, Plus, Check, Home, Briefcase, Navigation, Loader2 } from 'lucide-react';
import { reverseGeocodeLocationIQ, reverseGeocodeDetailedLocationIQ } from '../services/locationiq';
import type { SavedAddress } from '../types';

interface AddressManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressManagerModal: React.FC<AddressManagerModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, setUserProfile, setUserCoords, checkStoreCoverage } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [labelTag, setLabelTag] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [flatNo, setFlatNo] = useState('');
  const [area, setArea] = useState('HSR Layout, Sector 1, Bengaluru');
  const [gpsLoading, setGpsLoading] = useState(false);

  if (!isOpen) return null;

  const savedAddressesList: SavedAddress[] = userProfile.savedAddresses || [];

  const handleSelectDefault = async (id: string) => {
    const updated = savedAddressesList.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    const selected = updated.find((a) => a.id === id);
    setUserProfile((prev) => ({
      ...prev,
      address: selected ? selected.fullAddress : prev.address,
      savedAddresses: updated
    }));
    // Always verify coverage against backend — use current userCoords as proxy
    await checkStoreCoverage();
    onClose();
  };

  const handleUseCurrentGps = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setUserCoords({ lat, lon });
            const detailed = await reverseGeocodeDetailedLocationIQ(lat, lon);
            const gpsAddress = detailed.displayName;

            const newGpsAddress: SavedAddress = {
              id: 'addr-' + Date.now(),
              label: 'Home',
              flatNo: detailed.street || 'Current GPS Location',
              area: `${detailed.village}, ${detailed.city} ${detailed.pincode}`,
              fullAddress: gpsAddress,
              isDefault: true
            };

            const updatedList = savedAddressesList.map((a) => ({ ...a, isDefault: false }));
            updatedList.unshift(newGpsAddress);

            setUserProfile((prev) => ({
              ...prev,
              address: gpsAddress,
              pincode: detailed.pincode,
              village: detailed.village,
              street: detailed.street,
              landmark: detailed.landmark,
              savedAddresses: updatedList
            }));

            await checkStoreCoverage(lat, lon);
          } catch (err) {
            console.warn('GPS location error:', err);
          } finally {
            setGpsLoading(false);
            onClose();
          }
        },
        async () => {
          try {
            const fallbackLat = 12.9141;
            const fallbackLon = 77.6411;
            setUserCoords({ lat: fallbackLat, lon: fallbackLon });
            const gpsAddress = await reverseGeocodeLocationIQ(fallbackLat, fallbackLon);
            setUserProfile((prev) => ({ ...prev, address: gpsAddress }));
            await checkStoreCoverage(fallbackLat, fallbackLon);
          } catch (err) {
            console.warn('GPS location fallback error:', err);
          } finally {
            setGpsLoading(false);
            onClose();
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      const fallbackLat = 12.9141;
      const fallbackLon = 77.6411;
      setUserCoords({ lat: fallbackLat, lon: fallbackLon });
      checkStoreCoverage(fallbackLat, fallbackLon).finally(() => {
        setGpsLoading(false);
        onClose();
      });
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo.trim()) return;

    const newAddr: SavedAddress = {
      id: 'addr-' + Date.now(),
      label: labelTag,
      flatNo: flatNo.trim(),
      area: area.trim(),
      fullAddress: `${flatNo.trim()}, ${area.trim()}`,
      isDefault: true
    };

    const updatedList = savedAddressesList.map((a) => ({ ...a, isDefault: false }));
    updatedList.unshift(newAddr);

    setUserProfile((prev) => ({
      ...prev,
      address: newAddr.fullAddress,
      savedAddresses: updatedList
    }));

    // Backend coverage check — use current userCoords as the typed address has no GPS coords
    await checkStoreCoverage();

    setIsAddingNew(false);
    setFlatNo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4 border border-gray-100 relative max-h-[85vh] overflow-y-auto no-scrollbar font-sans">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
              <MapPin className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">Select Customer Location</h3>
              <p className="text-[10px] text-gray-400 font-medium">Real-Time LocationIQ GPS &amp; Saved Addresses</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleUseCurrentGps}
          disabled={gpsLoading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-98 disabled:opacity-70"
        >
          {gpsLoading ? (
            <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 text-amber-300" />
          )}
          <span>{gpsLoading ? 'Checking Darkstore Coverage...' : 'Use Current Device GPS Location'}</span>
        </button>

        {!isAddingNew ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Saved Customer Locations ({savedAddressesList.length})
              </span>
            </div>

            {savedAddressesList.length > 0 ? (
              savedAddressesList.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => handleSelectDefault(addr.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${userProfile.address === addr.fullAddress || addr.isDefault
                      ? 'border-yellow-400 bg-yellow-50/50 shadow-2xs'
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                    }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-white rounded-xl shadow-2xs text-gray-700 mt-0.5">
                      {addr.label === 'Home' ? <Home className="w-4 h-4 text-amber-600" /> : <Briefcase className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-gray-900">{addr.label}</span>
                        {(userProfile.address === addr.fullAddress || addr.isDefault) && (
                          <span className="text-[9px] font-black bg-amber-400 text-black px-2 py-0.5 rounded-full uppercase">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-800 mt-0.5">{addr.flatNo}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{addr.area}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${userProfile.address === addr.fullAddress || addr.isDefault ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300'
                    }`}>
                    {(userProfile.address === addr.fullAddress || addr.isDefault) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 px-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
                <MapPin className="w-6 h-6 text-gray-400 mx-auto" />
                <p className="font-bold text-xs text-gray-800">No Saved Locations Yet</p>
                <p className="text-[11px] text-gray-400 font-medium">Add your Home or Work address for 1-click express delivery!</p>
              </div>
            )}

            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full border-2 border-dashed border-gray-200 hover:border-amber-400 text-gray-700 font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-500" />
              <span>Add New Delivery Address</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddAddressSubmit} className="space-y-3 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-800">Add New Address</span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-[11px] text-amber-600 font-bold hover:underline cursor-pointer"
              >
                Back to list
              </button>
            </div>

            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setLabelTag(tag)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${labelTag === tag
                      ? 'bg-gray-900 text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">House / Flat / Door No. &amp; Building Name</label>
              <input
                type="text"
                required
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                placeholder="e.g. Flat 301, Magnolia Heights"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-amber-400 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">Street, Area &amp; City</label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. 27th Main, HSR Layout, Bengaluru"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-amber-400 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-xs py-3 rounded-xl shadow-xs transition active:scale-98 cursor-pointer mt-1"
            >
              SAVE &amp; SET AS ACTIVE ADDRESS
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
