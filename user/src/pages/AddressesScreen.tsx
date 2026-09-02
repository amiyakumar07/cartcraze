import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LocationIQService } from '../services/locationiq';
import { ArrowLeft, Navigation, MapPin, Plus, Check, Trash2, Edit2, Loader2, Home, Briefcase, Map } from 'lucide-react';

export const AddressesScreen: React.FC = () => {
  const { userProfile, setUserProfile, setActiveTab } = useApp();
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Address fields
  const [tag, setTag] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState(userProfile.phone || '');

  const triggerGpsAutoFill = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await LocationIQService.reverseGeocode(latitude, longitude);
          if (res) {
            setPincode(res.pincode || '');
            setVillage(res.village || res.city || '');
            setStreet(res.street || res.road || '');
            setHouseNo(res.houseNumber || res.building || '');

            const fullAddr = [res.houseNumber, res.street, res.village, res.pincode]
              .filter(Boolean)
              .join(', ');

            setUserProfile({
              ...userProfile,
              address: fullAddr,
              pincode: res.pincode,
              lat: latitude,
              lon: longitude
            });

            alert(`GPS Location resolved: ${fullAddr}`);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        console.error(err);
        setIsDetectingGps(false);
        alert('Could not detect GPS location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveAddress = () => {
    if (!pincode || !street) {
      alert('Please fill at least Street address and Pincode.');
      return;
    }

    const compiled = [houseNo, street, village, pincode].filter(Boolean).join(', ');
    setUserProfile({
      ...userProfile,
      address: compiled,
      pincode: pincode,
      phone: phone || userProfile.phone
    });
    setShowAddModal(false);
    alert('Address updated successfully!');
  };

  return (
    <div className="bg-[#F4FBF4] min-h-screen pb-24 font-[Inter,sans-serif] animate-fadeIn">
      {/* ── Top Header ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-emerald-100 shadow-2xs p-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('account')}
            data-testid="manage_addresses_back"
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#006C49]" />
          </button>
          <h1 className="text-base font-extrabold text-slate-900">Manage Addresses</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* ── Live GPS Action Card ── */}
        <div
          onClick={triggerGpsAutoFill}
          data-testid="detect_gps_address_card"
          className="bg-emerald-50 border-2 border-[#006C49] rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-emerald-100/60 transition-colors shadow-2xs"
        >
          <div className="w-10 h-10 rounded-full bg-[#006C49] flex items-center justify-center text-white shrink-0">
            {isDetectingGps ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5 fill-current" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-[#006C49] text-sm leading-tight">
              {isDetectingGps ? 'Detecting GPS Position...' : 'Use Current GPS Location'}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {isDetectingGps
                ? 'Resolving address details via LocationIQ...'
                : 'Automatically set delivery address from live GPS'}
            </p>
          </div>
        </div>

        {/* ── Current Default Address Section ── */}
        <div className="space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Current Selection</h2>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/40 rounded-bl-[90px] pointer-events-none" />

            <div className="flex items-start gap-3 relative z-10">
              <MapPin className="w-6 h-6 text-[#006C49] shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm">{tag}</h3>
                  <span className="bg-[#10B981] text-[#00422B] font-black text-[10px] uppercase px-2 py-0.5 rounded-full">
                    DEFAULT
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug">
                  {userProfile.address || 'No address configured yet.'}
                </p>
                <p className="text-xs font-semibold text-slate-500">Pincode: {userProfile.pincode || '751024'}</p>
                <p className="text-xs font-semibold text-slate-500">Phone: {userProfile.phone || '+91 9876543210'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Saved Addresses Section ── */}
        <div className="space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Saved Addresses</h2>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Home className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-slate-900 text-xs">Home Address</h4>
                <p className="text-[11px] text-slate-500 truncate">{userProfile.address || 'KIIT Road, Patia'}</p>
              </div>
              <span className="text-xs font-bold text-[#006C49]">Selected</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add New Address Button ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-20">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setShowAddModal(true)}
            data-testid="add_new_address_btn"
            className="w-full py-3.5 bg-[#10B981] text-[#00422B] font-black text-sm rounded-full flex items-center justify-center gap-2 hover:bg-emerald-400 shadow-md transition-colors"
          >
            <Plus className="w-5 h-5" /> Add New Address
          </button>
        </div>
      </div>

      {/* ── Add Address Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-4 animate-slideUp">
            <h3 className="text-lg font-black text-slate-900">Add New Address</h3>

            {/* Tag selector */}
            <div className="grid grid-cols-3 gap-2">
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`py-2 rounded-xl text-xs font-extrabold border transition-colors ${
                    tag === t ? 'bg-[#10B981] text-[#00422B] border-[#006C49]' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Auto fill button inside modal */}
            <button
              onClick={triggerGpsAutoFill}
              className="w-full py-2 bg-emerald-50 text-[#006C49] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-emerald-200"
            >
              <Navigation className="w-3.5 h-3.5" /> Auto-fill with Current GPS Location
            </button>

            {/* Address input fields */}
            <div className="space-y-2 text-xs font-semibold">
              <div>
                <label className="text-slate-500 mb-1 block">House / Flat No.</label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="e.g. Flat 302, Green Apartments"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#006C49]"
                />
              </div>

              <div>
                <label className="text-slate-500 mb-1 block">Street / Road Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. KIIT Road, Near Campus 6"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#006C49]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 mb-1 block">Village / Area</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Patia"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#006C49]"
                  />
                </div>
                <div>
                  <label className="text-slate-500 mb-1 block">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="751024"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#006C49]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#006C49]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 text-slate-600 font-bold text-xs bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 py-3 text-white font-black text-xs bg-[#006C49] rounded-xl hover:bg-emerald-800"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
