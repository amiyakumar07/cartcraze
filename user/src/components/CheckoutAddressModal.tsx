import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle2, X, Phone, User, Home, Building2, Map, Compass, ShieldCheck } from 'lucide-react';
import { reverseGeocodeLocationIQ, reverseGeocodeDetailedLocationIQ } from '../services/locationiq';

interface CheckoutAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  totalPayable: number;
  onConfirmAddress: (addressData: {
    fullName: string;
    phone: string;
    pincode: string;
    village: string;
    street: string;
    landmark: string;
    fullAddress: string;
    lat: number;
    lon: number;
  }) => void;
  initialProfile?: {
    name?: string;
    phone?: string;
    address?: string;
  };
}

export const CheckoutAddressModal: React.FC<CheckoutAddressModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  totalPayable,
  onConfirmAddress,
  initialProfile
}) => {
  const [fullName, setFullName] = useState(initialProfile?.name || 'Customer Name');
  const [phone, setPhone] = useState(initialProfile?.phone || '+91 98765 43210');
  const [pincode, setPincode] = useState('751002');
  const [village, setVillage] = useState('Old Town');
  const [street, setStreet] = useState('Main Road');
  const [landmark, setLandmark] = useState('Near Temple');
  const [lat, setLat] = useState<number>(20.2316);
  const [lon, setLon] = useState<number>(85.8300);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsSuccess, setGpsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (initialProfile?.name) setFullName(initialProfile.name);
    if (initialProfile?.phone) setPhone(initialProfile.phone);
  }, [initialProfile]);

  if (!isOpen) return null;

  const handleAutoDetectGPS = () => {
    setGpsLoading(true);
    setGpsSuccess(false);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const currentLat = pos.coords.latitude;
          const currentLon = pos.coords.longitude;
          setLat(currentLat);
          setLon(currentLon);

          try {
            const geocodeRes = await reverseGeocodeDetailedLocationIQ(currentLat, currentLon);
            if (geocodeRes) {
              if (geocodeRes.pincode) setPincode(geocodeRes.pincode);
              if (geocodeRes.village) setVillage(geocodeRes.village);
              if (geocodeRes.street) setStreet(geocodeRes.street);
              if (geocodeRes.landmark) setLandmark(geocodeRes.landmark);
            }
          } catch {
            setStreet(`GPS Pin (${currentLat.toFixed(4)}, ${currentLon.toFixed(4)})`);
          }

          setGpsLoading(false);
          setGpsSuccess(true);
        },
        async (err) => {
          setGpsLoading(false);
          console.warn('GPS Detection Error:', err);
          alert(`Location access notice (${err.message || 'Permission Denied'}). Please enable GPS location permissions in your browser.`);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setGpsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !pincode.trim() || !village.trim() || !street.trim()) {
      alert('Please fill out all required address details.');
      return;
    }

    const fullAddress = `${street}, ${village}, Landmark: ${landmark}, Pincode: ${pincode}`;
    onConfirmAddress({
      fullName,
      phone,
      pincode,
      village,
      street,
      landmark,
      fullAddress,
      lat,
      lon
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-sans">
      <div className="bg-white max-w-lg w-full rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-100 text-amber-900 rounded-2xl">
              <MapPin className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 leading-none">Confirm Delivery Address</h2>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">Enter details before proceeding to payment</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Address Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name & Phone Number */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>Phone Number *</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Pincode & Village / Area */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Pincode *</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 560102"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold font-mono text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-amber-600" />
                <span>Village / Area / Colony *</span>
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. HSR Layout Sector 1"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Street / Door No */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <Map className="w-3.5 h-3.5 text-amber-600" />
              <span>Street / Flat / Door Number *</span>
            </label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Flat 402, 14th Main Road, 5th Cross"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Landmark */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Nearby Landmark (Optional)</span>
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Government High School / Near Water Tank"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* AUTO-DETECT GPS BUTTON */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAutoDetectGPS}
              disabled={gpsLoading}
              className="w-full bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer active:scale-98"
            >
              <Navigation className={`w-4 h-4 text-amber-700 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? 'Detecting GPS Coordinates...' : '📍 Auto-Detect & Use My Current GPS Location'}</span>
            </button>
            {gpsSuccess && (
              <p className="text-[10px] text-emerald-600 font-bold text-center mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GPS Pin Updated (Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}). You only need to check Name &amp; Phone!</span>
              </p>
            )}
          </div>

          {/* Payment & Total Summary Bar */}
          <div className="bg-slate-900 text-white p-3 rounded-2xl flex justify-between items-center text-xs mt-2 border border-slate-800">
            <div>
              <span className="text-[10px] text-amber-400 font-bold block uppercase">Selected Payment</span>
              <span className="font-extrabold text-white">{paymentMethod}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Payable</span>
              <span className="font-black text-sm text-amber-400">₹{totalPayable}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#fdee24] hover:bg-yellow-400 text-slate-950 font-black text-xs py-4 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>CONFIRM ADDRESS &amp; PAY ₹{totalPayable} NOW</span>
          </button>
        </form>
      </div>
    </div>
  );
};
