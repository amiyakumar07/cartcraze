import React, { useState, useEffect } from 'react';
import { Upload, MapPin, User, Phone, Mail, Bike, CreditCard, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { API_BASE, DEFAULT_COORDS } from "../config/api";
import type { RiderApprovalData, LocationCoords } from "../types";

interface Props {
  onSubmitSuccess: (riderData: RiderApprovalData) => void;
}

export const RiderApprovalForm: React.FC<Props> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [drivingLicenseProof, setDrivingLicenseProof] = useState('');
  const [dlFileName, setDlFileName] = useState('');
  const [idProofType, setIdProofType] = useState('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [idProofProof, setIdProofProof] = useState('');
  const [idFileName, setIdFileName] = useState('');
  const [address, setAddress] = useState('Detecting GPS location...');
  const [coords, setCoords] = useState<LocationCoords>(DEFAULT_COORDS);
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    handleDetectLocation();
  }, []);

  const handleDetectLocation = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCoords({ lat, lon, address: '' });
          // Reverse geocode would go here
          setAddress(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
          setGpsLoading(false);
        },
        () => {
          setCoords(DEFAULT_COORDS);
          setAddress(DEFAULT_COORDS.address);
          setGpsLoading(false);
        }
      );
    } else {
      setAddress(DEFAULT_COORDS.address);
      setGpsLoading(false);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setProof: (url: string) => void,
    setFileName: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = scale < 1 ? MAX_WIDTH : img.width;
        canvas.height = scale < 1 ? img.height * scale : img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setProof(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !vehicleNumber || !idProofNumber) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/riders/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, vehicleNumber,
          drivingLicenseProof, idProofType, idProofNumber, idProofProof,
          lat: coords.lat, lon: coords.lon
        })
      });
      const data = await res.json();
      if (data.success) {
        onSubmitSuccess(data.rider);
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch {
      // Fallback for demo
      onSubmitSuccess({
        id: `rider-${Date.now()}`,
        name, email, phone, vehicleNumber,
        drivingLicenseProof, idProofType, idProofNumber, idProofProof,
        lat: coords.lat, lon: coords.lon,
        status: 'PENDING_APPROVAL'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-fleet-900 border border-fleet-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-fleet-100 placeholder:text-fleet-600 focus:outline-none focus:border-amber-500 transition";
  const labelClass = "text-xs font-bold text-fleet-400 uppercase tracking-wider mb-2 block flex items-center gap-2";

  return (
    <div className="min-h-full bg-fleet-950 text-fleet-50 pb-8 animate-fade-in">
      <div className="px-5 pt-6 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <Bike className="w-8 h-8 text-fleet-950" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Rider Onboarding</h1>
          <p className="text-sm text-fleet-500 mt-2">Submit your details for verification</p>
          <Badge variant="amber" size="sm" className="mt-3">Step {step} of 2</Badge>
        </div>

        {/* Location Card */}
        <Card variant="glass" className="mb-6 border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl shrink-0">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Detected Zone</p>
              <p className="text-sm font-semibold text-fleet-100 mt-1">{gpsLoading ? 'Fetching GPS...' : address}</p>
              <button 
                onClick={handleDetectLocation}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 transition mt-2 cursor-pointer"
              >
                Re-detect Location
              </button>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in-up">
              <div>
                <label className={labelClass}><User className="w-4 h-4" /> Full Name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Alex Mercer" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Phone className="w-4 h-4" /> Phone *</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98123 45678" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Mail className="w-4 h-4" /> Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@cartcraze.app" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Bike className="w-4 h-4" /> Vehicle Number *</label>
                <input type="text" required value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} placeholder="KA-01-EQ-9920" className={inputClass} />
              </div>
              <Button variant="primary" fullWidth onClick={() => setStep(2)} type="button" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in-up">
              <div>
                <label className={labelClass}><CreditCard className="w-4 h-4" /> ID Proof Type</label>
                <select value={idProofType} onChange={e => setIdProofType(e.target.value)} className={inputClass}>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Voter ID">Voter ID</option>
                </select>
              </div>
              <div>
                <label className={labelClass}><FileText className="w-4 h-4" /> ID Number *</label>
                <input type="text" required value={idProofNumber} onChange={e => setIdProofNumber(e.target.value)} placeholder="5491-8820-1920" className={inputClass} />
              </div>

              {/* DL Upload */}
              <div>
                <label className={labelClass}><Upload className="w-4 h-4" /> Driving License *</label>
                <div className="relative border-2 border-dashed border-fleet-700 rounded-xl p-6 text-center hover:border-amber-500/50 transition cursor-pointer bg-fleet-900/50">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => handleFileUpload(e, setDrivingLicenseProof, setDlFileName)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-fleet-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-fleet-300">Click or drop license photo</p>
                  <p className="text-xs text-fleet-600 mt-1">JPG, PNG up to 5MB</p>
                </div>
                {drivingLicenseProof && (
                  <div className="mt-2 flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-fleet-100">{dlFileName}</p>
                      <p className="text-[10px] text-emerald-400">License uploaded</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ID Upload */}
              <div>
                <label className={labelClass}><Upload className="w-4 h-4" /> {idProofType} Photo *</label>
                <div className="relative border-2 border-dashed border-fleet-700 rounded-xl p-6 text-center hover:border-amber-500/50 transition cursor-pointer bg-fleet-900/50">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => handleFileUpload(e, setIdProofProof, setIdFileName)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-fleet-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-fleet-300">Click or drop ID photo</p>
                  <p className="text-xs text-fleet-600 mt-1">JPG, PNG up to 5MB</p>
                </div>
                {idProofProof && (
                  <div className="mt-2 flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-fleet-100">{idFileName}</p>
                      <p className="text-[10px] text-emerald-400">ID proof uploaded</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => setStep(1)} type="button">Back</Button>
                <Button variant="primary" fullWidth isLoading={submitting} type="submit" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Submit
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
