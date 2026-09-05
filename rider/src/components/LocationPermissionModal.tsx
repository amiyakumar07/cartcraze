import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { DEFAULT_COORDS } from '../config/api';
import type { LocationCoords } from '../types';

interface Props {
  isOpen: boolean;
  onClose: (coords?: LocationCoords) => void;
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
          setDetectedAddress(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          setLoading(false);
          setTimeout(() => onClose({ lat, lon, address: '' }), 600);
        },
        () => {
          setDetectedAddress(DEFAULT_COORDS.address);
          setLoading(false);
          setTimeout(() => onClose(DEFAULT_COORDS), 600);
        }
      );
    } else {
      setLoading(false);
      onClose(DEFAULT_COORDS);
    }
  };

  const handleUseDefault = () => {
    onClose(DEFAULT_COORDS);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-fleet-950/90 backdrop-blur-lg flex items-center justify-center p-5 animate-fade-in">
      <Card variant="elevated" className="w-full max-w-sm text-center py-8 px-6 relative overflow-hidden animate-scale-in">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

        <div className="relative">
          <div className="w-16 h-16 bg-amber-500/15 border-2 border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <MapPin className="w-8 h-8 text-amber-400" />
          </div>

          <h2 className="text-xl font-display font-bold text-white mb-2">Location Access</h2>
          <p className="text-sm text-fleet-500 leading-relaxed mb-6">
            CartCraze needs your location for real-time GPS tracking and instant order dispatch.
          </p>

          {detectedAddress && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mb-5 text-left">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-emerald-400 truncate">{detectedAddress}</span>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth 
              isLoading={loading}
              onClick={handleAllowLocation}
              leftIcon={<Navigation className="w-4 h-4" />}
            >
              {loading ? 'Detecting...' : 'Allow Location Access'}
            </Button>
            <Button 
              variant="ghost" 
              fullWidth 
              onClick={handleUseDefault}
            >
              Use Default Zone
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
