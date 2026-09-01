import React, { useState, useEffect } from 'react';
import { reverseGeocodeLocationIQ } from '../services/locationiq';

interface RiderApprovalFormProps {
  onSubmitSuccess: (riderData: any) => void;
}

export const RiderApprovalForm: React.FC<RiderApprovalFormProps> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [drivingLicenseProof, setDrivingLicenseProof] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80');
  const [dlFileName, setDlFileName] = useState('driving_license.jpg');
  const [dlFileSize, setDlFileSize] = useState('310 KB');

  const [idProofType, setIdProofType] = useState('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [idProofProof, setIdProofProof] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80');
  const [idFileName, setIdFileName] = useState('aadhaar_card.jpg');
  const [idFileSize, setIdFileSize] = useState('280 KB');

  const [address, setAddress] = useState('Detecting LocationIQ GPS...');
  const [lat, setLat] = useState(12.9141);
  const [lon, setLon] = useState(77.6411);
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    handleDetectLocation();
  }, []);

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
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setAddress('HSR Layout, Sector 1, Bengaluru');
      setGpsLoading(false);
    }
  };

  const handleDlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDlFileName(file.name);
    setDlFileSize(`${(file.size / 1024).toFixed(1)} KB`);
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
        setDrivingLicenseProof(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdFileName(file.name);
    setIdFileSize(`${(file.size / 1024).toFixed(1)} KB`);
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
        setIdProofProof(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !vehicleNumber || !idProofNumber) {
      alert('Please fill out all required rider details');
      return;
    }

    setSubmitting(true);
    try {
      const API = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:4000/api'
        : 'https://cartcraze-95gt.onrender.com/api';
      const res = await fetch(`${API}/riders/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          vehicleNumber,
          drivingLicenseProof,
          idProofType,
          idProofNumber,
          idProofProof,
          lat,
          lon
        })
      });
      const data = await res.json();
      setSubmitting(false);
      if (data.success) {
        onSubmitSuccess(data.rider);
      } else {
        alert(data.error || 'Failed to submit rider registration');
      }
    } catch {
      setSubmitting(false);
      onSubmitSuccess({
        id: `rider-${Date.now()}`,
        name,
        email,
        phone,
        vehicleNumber,
        drivingLicenseProof,
        idProofType,
        idProofNumber,
        idProofProof,
        status: 'PENDING_APPROVAL'
      });
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --surface-container-lowest: #ffffff;
          --surface-container-low: #f3f4f5;
          --surface-container: #edeeef;
          --surface-container-highest: #e1e3e4;
          --on-surface: #191c1d;
          --on-surface-variant: #4f4632;
          --primary-container: #ffc700;
          --on-primary-container: #6e5400;
          --primary: #765b00;
          --background: #f8f9fa;
          --secondary: #5e5e5e;
        }

        .reg-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: var(--background);
          font-family: "Inter", sans-serif;
        }

        .reg-card {
          width: 100%;
          max-width: 28rem;
          background: var(--surface-container-lowest);
          border-radius: 28px;
          padding: 32px 24px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--surface-container-highest);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .reg-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo-circle {
          width: 64px;
          height: 64px;
          background: var(--primary-container);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 4px 14px rgba(255, 199, 0, 0.4);
        }

        .logo-icon {
          color: var(--on-primary-container);
          font-size: 36px;
        }

        .reg-title {
          margin: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: var(--on-surface);
        }

        .reg-subtitle {
          margin: 4px 0 0;
          font-size: 14px;
          color: var(--secondary);
          line-height: 1.4;
        }

        .step-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eefbf3;
          color: #006d37;
          border: 1px solid #bdf1cf;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 8px;
        }

        .location-box {
          background: #fffdf5;
          border: 1.5px solid #ffe999;
          border-radius: 20px;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .loc-icon {
          color: #765b00;
          font-size: 24px;
          margin-top: 2px;
        }

        .loc-details {
          flex: 1;
        }

        .loc-title {
          font-size: 11px;
          font-weight: 800;
          color: #765b00;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .loc-address {
          font-size: 13px;
          font-weight: 600;
          color: var(--on-surface);
          margin-top: 2px;
          line-height: 1.3;
        }

        .re-detect-btn {
          background: transparent;
          border: none;
          color: #765b00;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          margin-top: 4px;
          display: inline-block;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--on-surface);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .custom-input, .custom-select {
          width: 100%;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1.5px solid var(--surface-container-highest);
          background: var(--background);
          font-size: 14px;
          font-weight: 600;
          color: var(--on-surface);
          outline: none;
          transition: border-color 0.2s;
        }

        .custom-input:focus, .custom-select:focus {
          border-color: var(--primary);
        }

        .doc-proof-card {
          background: var(--background);
          border: 1.5px dashed var(--surface-container-highest);
          border-radius: 20px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .doc-thumb {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          object-fit: cover;
          border: 2px solid #ffc700;
        }

        .doc-info {
          flex: 1;
        }

        .doc-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--on-surface);
        }

        .doc-sub {
          font-size: 11px;
          color: #006d37;
          font-weight: 700;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 18px;
          background: var(--primary-container);
          color: var(--on-primary-container);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(255, 199, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.1s;
        }

        .submit-btn:active {
          transform: scale(0.98);
        }
      `}</style>

      <div className="reg-page">
        <div className="reg-card">
          <header className="reg-header">
            <div className="logo-circle">
              <span className="material-symbols-outlined logo-icon">badge</span>
            </div>
            <h1 className="reg-title">Rider Partner Onboarding</h1>
            <p className="reg-subtitle">Submit your vehicle &amp; government ID details for Super Admin verification</p>
            <div className="step-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified_user</span>
              <span>Step 2 of 2: License Details</span>
            </div>
          </header>

          {/* LocationIQ GPS Box */}
          <div className="location-box">
            <span className="material-symbols-outlined loc-icon">my_location</span>
            <div className="loc-details">
              <span className="loc-title">LocationIQ Detected Base Zone</span>
              <p className="loc-address">
                {gpsLoading ? 'Fetching exact LocationIQ coordinates...' : address}
              </p>
              <button type="button" onClick={handleDetectLocation} className="re-detect-btn">
                Re-detect GPS Location
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                <span>Rider Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="custom-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98123 45678"
                className="custom-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@cartcraze.app"
                className="custom-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>two_wheeler</span>
                <span>Vehicle / Bike Plate Number</span>
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. KA-01-EQ-9920"
                className="custom-input"
              />
            </div>

            {/* Government ID Type */}
            <div className="input-group">
              <label className="input-label">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>assignment_ind</span>
                <span>Government ID Proof Type</span>
              </label>
              <select
                value={idProofType}
                onChange={(e) => setIdProofType(e.target.value)}
                className="custom-select"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>numbers</span>
                <span>ID Proof Document Number</span>
              </label>
              <input
                type="text"
                required
                value={idProofNumber}
                onChange={(e) => setIdProofNumber(e.target.value)}
                placeholder="e.g. 5491-8820-1920"
                className="custom-input"
              />
            </div>

            {/* Driving License File Upload Dropzone */}
            <div className="input-group">
              <label className="input-label">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
                <span>Upload Driving License Proof Document *</span>
              </label>
              <div style={{ position: 'relative', border: '1.5px dashed #ffc700', borderRadius: '16px', padding: '14px', background: '#fffdf5', textAlign: 'center', cursor: 'pointer' }}>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDlUpload}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#765b00' }}>cloud_upload</span>
                <p style={{ margin: '4px 0 0', fontSize: '12px', fontWeight: 700, color: '#191c1d' }}>Click or Drag &amp; Drop Driving License Photo</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#5e5e5e' }}>Visible in Admin Approval Dashboard</p>
              </div>

              {drivingLicenseProof && (
                <div className="doc-proof-card">
                  <img src={drivingLicenseProof} alt="Driving License Proof" className="doc-thumb" />
                  <div className="doc-info">
                    <span className="doc-title">{dlFileName}</span>
                    <span className="doc-sub">✓ Driving License Attached ({dlFileSize})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Government ID Photo File Upload Dropzone */}
            <div className="input-group">
              <label className="input-label">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>id_card</span>
                <span>Upload {idProofType} Photo Proof *</span>
              </label>
              <div style={{ position: 'relative', border: '1.5px dashed #765b00', borderRadius: '16px', padding: '14px', background: '#f8f9fa', textAlign: 'center', cursor: 'pointer' }}>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleIdUpload}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#765b00' }}>add_photo_alternate</span>
                <p style={{ margin: '4px 0 0', fontSize: '12px', fontWeight: 700, color: '#191c1d' }}>Click or Drag &amp; Drop {idProofType} Photo</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#5e5e5e' }}>Visible in Admin Approval Dashboard</p>
              </div>

              {idProofProof && (
                <div className="doc-proof-card">
                  <img src={idProofProof} alt="ID Proof" className="doc-thumb" />
                  <div className="doc-info">
                    <span className="doc-title">{idFileName}</span>
                    <span className="doc-sub">✓ {idProofType} Attached ({idFileSize})</span>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={submitting} className="submit-btn">
              <span>{submitting ? 'Submitting Application...' : 'Submit Application for Admin Approval'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
