import React, { useState } from 'react';
import { reverseGeocodeLocationIQ } from '../services/locationiq';

interface Props {
  isOpen: boolean;
  onClose: (coords?: { lat: number; lon: number; address: string }) => void;
}

export const LocationPermissionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('');

  if (!isOpen) return null;

  const handleAllowLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geo = await reverseGeocodeLocationIQ(lat, lon);
          setDetectedAddress(geo.address);
          setLoading(false);
          setTimeout(() => onClose({ lat, lon, address: geo.address }), 800);
        },
        async () => {
          const lat = 12.9141;
          const lon = 77.6411;
          const geo = await reverseGeocodeLocationIQ(lat, lon);
          setDetectedAddress(geo.address);
          setLoading(false);
          setTimeout(() => onClose({ lat, lon, address: geo.address }), 800);
        }
      );
    } else {
      setLoading(false);
      onClose({ lat: 12.9141, lon: 77.6411, address: 'HSR Layout, Sector 1, Bengaluru' });
    }
  };

  const handleUseDefault = () => {
    onClose({ lat: 12.9141, lon: 77.6411, address: 'HSR Layout, Sector 1, Bengaluru' });
  };

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: "Inter", sans-serif;
        }

        .modal-card {
          width: 100%;
          max-width: 24rem;
          background: #ffffff;
          border-radius: 28px;
          padding: 32px 24px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .modal-icon-circle {
          width: 64px;
          height: 64px;
          background: #fff8e1;
          color: #765b00;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffe082;
        }

        .modal-title {
          margin: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #191c1d;
        }

        .modal-subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          color: #5e5e5e;
          line-height: 1.4;
        }

        .detected-chip {
          width: 100%;
          background: #eefbf3;
          border: 1px solid #bdf1cf;
          color: #006d37;
          font-weight: 700;
          font-size: 12px;
          padding: 10px 14px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          width: 100%;
          padding: 16px;
          border-radius: 18px;
          border: none;
          background: #ffc700;
          color: #6e5400;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(255, 199, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-secondary {
          width: 100%;
          padding: 12px;
          border-radius: 16px;
          border: 1.5px solid #e1e3e4;
          background: #f8f9fa;
          color: #191c1d;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-icon-circle">
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>my_location</span>
          </div>

          <div>
            <h2 className="modal-title">Live GPS Access Required</h2>
            <p className="modal-subtitle">
              CartCraze Rider Portal needs your location permission for LocationIQ real-time GPS tracking and instant 9-minute order dispatch.
            </p>
          </div>

          {detectedAddress && (
            <div className="detected-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detectedAddress}</span>
            </div>
          )}

          <button onClick={handleAllowLocation} disabled={loading} className="btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>near_me</span>
            <span>{loading ? 'Detecting LocationIQ GPS...' : 'Approve Rider Location Access'}</span>
          </button>

          <button onClick={handleUseDefault} className="btn-secondary">
            Use Default HSR Layout Rider Base
          </button>
        </div>
      </div>
    </>
  );
};
