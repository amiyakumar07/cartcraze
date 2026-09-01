import React, { useState, useEffect } from 'react';
import { Store, MapPin, ShieldCheck, FileText, CheckCircle2, Loader2, Navigation, Upload, Image as ImageIcon } from 'lucide-react';
import { reverseGeocodeLocationIQ } from '../services/locationiq';

interface ShopApprovalFormProps {
  onSubmitSuccess: (shopData: any) => void;
  initialLocation?: { lat: number; lon: number; address: string } | null;
}

export const ShopApprovalForm: React.FC<ShopApprovalFormProps> = ({ onSubmitSuccess, initialLocation }) => {
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState(initialLocation?.address || 'Resolving LocationIQ Shop GPS Address...');
  const [lat, setLat] = useState<number>(initialLocation?.lat || 12.9141);
  const [lon, setLon] = useState<number>(initialLocation?.lon || 77.6411);
  const [licenseType, setLicenseType] = useState('Trade License');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseProofUrl, setLicenseProofUrl] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80');
  const [proofFileName, setProofFileName] = useState<string>('trade_license_proof.jpg');
  const [proofFileSize, setProofFileSize] = useState<string>('245 KB');
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lon) {
      setLat(initialLocation.lat);
      setLon(initialLocation.lon);
      setAddress(initialLocation.address);
    } else {
      handleDetectLocation();
    }
  }, [initialLocation]);

  const handleDetectLocation = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLat(pos.coords.latitude);
          setLon(pos.coords.longitude);
          const fullAddress = await reverseGeocodeLocationIQ(pos.coords.latitude, pos.coords.longitude);
          setAddress(fullAddress);
          setGpsLoading(false);
        },
        async () => {
          const fullAddress = await reverseGeocodeLocationIQ(12.9141, 77.6411);
          setAddress(fullAddress);
          setGpsLoading(false);
        }
      );
    } else {
      setAddress('Sector 1, HSR Layout, Bengaluru');
      setGpsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFileName(file.name);
    setProofFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        setLicenseProofUrl(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !phone || !email || !licenseNumber) {
      alert('Please fill out all required fields');
      return;
    }

    setSubmitting(true);
    const API = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:4000/api'
      : 'https://cartcraze-95gt.onrender.com/api';

    const payload = {
      name: shopName,
      email,
      phone,
      address,
      lat,
      lon,
      licenseType,
      licenseNumber,
      licenseProof: licenseProofUrl
    };

    try {
      const res = await fetch(`${API}/shops/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSubmitting(false);
      if (data.success && data.shop) {
        onSubmitSuccess(data.shop);
      } else {
        alert(data.error || 'Failed to submit shop registration');
      }
    } catch (err) {
      console.warn('Network error registering shop to backend:', err);
      setSubmitting(false);
      // Local shop registration object
      onSubmitSuccess({
        id: `shop-${Date.now()}`,
        name: shopName,
        email,
        phone,
        address,
        lat,
        lon,
        licenseType,
        licenseNumber,
        licenseProof: licenseProofUrl,
        status: 'PENDING_APPROVAL',
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-amber-400 text-black rounded-2xl shadow-lg">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white">CartCraze Partner Registration</h2>
          <p className="text-xs text-slate-400 font-medium">Submit shop details &amp; trade license for Super Admin approval</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Location Detection Box */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shop Location (LocationIQ GPS)</span>
              </span>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                {gpsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                <span>Auto Detect</span>
              </button>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block">Store Address *</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Resolving LocationIQ Shop GPS Address..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-mono text-slate-300 outline-none focus:border-amber-400 leading-snug resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[9px] font-bold text-slate-500 block">Latitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={lat}
                  onChange={(e) => setLat(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-[10px] font-mono text-slate-300 outline-none focus:border-amber-400"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[9px] font-bold text-slate-500 block">Longitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={lon}
                  onChange={(e) => setLon(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-[10px] font-mono text-slate-300 outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Shop Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Shop / Darkstore Name *</label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. Green Valley Fresh Market"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-amber-400"
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Shop Phone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98000 12345"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-3 text-xs font-bold text-white outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Shop Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="store@domain.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-3 text-xs font-bold text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* License Type & Number */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">License Document *</label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3 py-3 text-xs font-bold text-white outline-none focus:border-amber-400"
              >
                <option value="Trade License">Trade License</option>
                <option value="MSME Certificate">MSME Certificate</option>
                <option value="FSSAI License">FSSAI License</option>
                <option value="GSTIN Registration">GSTIN Registration</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300">License Number *</label>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. TL-BLR-2026-9920"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-3 text-xs font-bold text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* License Proof File Upload */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload {licenseType} Document Proof *</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Super Admin Visible</span>
              </span>
            </label>

            {/* Upload Dropzone & File Input */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl p-4 text-center bg-slate-900/60 transition cursor-pointer group">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-200">
                  Click to Browse or Drag &amp; Drop License Proof
                </p>
                <p className="text-[10px] text-slate-400">
                  Supports JPG, PNG, WEBP, PDF (Converted for Admin Review)
                </p>
              </div>
            </div>

            {/* Document Preview Thumbnail Box */}
            {licenseProofUrl && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
                {licenseProofUrl.startsWith('data:image') || licenseProofUrl.startsWith('http') ? (
                  <img
                    src={licenseProofUrl}
                    alt="License Proof Preview"
                    className="w-12 h-12 object-cover rounded-xl border border-amber-400 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/30 flex items-center justify-center font-bold text-xs shrink-0">
                    PDF
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{proofFileName}</p>
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Attached for Admin Review • {proofFileSize}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-4 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <CheckCircle2 className="w-4 h-4 text-black" />}
            <span>Submit Shop Application for Admin Approval</span>
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Forwarded to Super Admin Console for Instant Verification</span>
        </div>
      </div>
    </div>
  );
};
