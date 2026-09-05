import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Store, Play, Pause, FastForward, Activity, ExternalLink } from 'lucide-react';
import { Badge } from './ui/Badge';
import { LOCATIONIQ_API_KEY, API_BASE } from '../config/api';
import type { DeliveryStep } from '../types';

interface Props {
  step: DeliveryStep;
  riderName?: string;
  orderId?: string;
  destLat?: number;
  destLon?: number;
  customerName?: string;
  customerAddress?: string;
}

export const LocationIQMap: React.FC<Props> = ({
  step,
  riderName = 'Alex Mercer',
  orderId = 'QM-849201',
  destLat: customDestLat,
  destLon: customDestLon,
  customerName = 'Customer',
  customerAddress
}) => {
  const storeLat = 12.9100;
  const storeLon = 77.6400;
  const destLat = customDestLat || 12.9250;
  const destLon = customDestLon || 77.6500;

  const [progress, setProgress] = useState<number>(step === 'PICKUP' ? 10 : step === 'DELIVERING' ? 55 : 98);
  const [isAutoSimulating, setIsAutoSimulating] = useState(true);
  const [speed, setSpeed] = useState(32);
  const [currentAddress, setCurrentAddress] = useState('Resolving GPS...');
  const [gpsActive, setGpsActive] = useState(false);

  const currentLat = parseFloat((storeLat + (destLat - storeLat) * (progress / 100)).toFixed(4));
  const currentLon = parseFloat((storeLon + (destLon - storeLon) * (progress / 100)).toFixed(4));

  useEffect(() => {
    if (step === 'PICKUP') setProgress(10);
    else if (step === 'DELIVERING') setProgress(55);
    else setProgress(100);
  }, [step]);

  useEffect(() => {
    let watchId: number | null = null;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setGpsActive(true);
          const realSpeed = Math.round((pos.coords.speed || 8) * 3.6);
          setSpeed(realSpeed > 0 ? realSpeed : 30);
        },
        () => setGpsActive(false),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [step]);

  useEffect(() => {
    if (!isAutoSimulating) return;
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 3;
        return next > 100 ? 10 : next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isAutoSimulating]);

  useEffect(() => {
    setCurrentAddress(`${currentLat.toFixed(4)}, ${currentLon.toFixed(4)}`);
  }, [currentLat, currentLon]);

  const tileUrl = LOCATIONIQ_API_KEY 
    ? `https://a-tiles.locationiq.com/v3/streets/r/14/11728/7532.png?key=${LOCATIONIQ_API_KEY}`
    : '';

  return (
    <div className="relative bg-fleet-900 rounded-2xl overflow-hidden border border-fleet-800 shadow-xl">
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ 
          backgroundImage: tileUrl 
            ? `url("${tileUrl}"), radial-gradient(circle, rgba(11,17,33,0.7) 0%, rgba(11,17,33,0.95) 100%)`
            : 'radial-gradient(circle, rgba(30,41,59,0.8) 0%, rgba(11,17,33,0.98) 100%)'
        }}
      >
        <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg">
          <line x1="15%" y1="75%" x2="85%" y2="25%" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8 4" className="opacity-60" />
        </svg>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 p-3 flex justify-between items-center bg-fleet-950/90 backdrop-blur-md border-b border-fleet-800">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-xs font-bold text-amber-400">GPS Telemetry</span>
          <Badge variant="default" size="sm" className="font-mono">{speed} km/h</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={gpsActive ? 'success' : 'info'} size="sm" dot>
            {gpsActive ? 'Device GPS' : 'Simulator'}
          </Badge>
          <button
            onClick={() => setIsAutoSimulating(!isAutoSimulating)}
            className="p-1.5 bg-fleet-800 hover:bg-fleet-700 text-amber-400 rounded-lg transition cursor-pointer"
          >
            {isAutoSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative z-10 h-40 p-4">
        {/* Darkstore Pin */}
        <div className="absolute left-[15%] top-[75%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 bg-amber-500 text-fleet-950 rounded-full flex items-center justify-center shadow-lg border-2 border-fleet-950">
            <Store className="w-4 h-4" />
          </div>
          <span className="text-[8px] font-black text-fleet-300 bg-fleet-950/90 px-2 py-0.5 rounded-full mt-1 border border-fleet-800">
            Store
          </span>
        </div>

        {/* Rider Pin */}
        <div 
          className="absolute transition-all duration-700 ease-out flex flex-col items-center"
          style={{
            left: `${15 + progress * 0.7}%`,
            top: `${75 - progress * 0.5}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-amber-400 text-fleet-950 rounded-full flex items-center justify-center shadow-2xl border-2 border-fleet-950 ring-4 ring-amber-400/30 animate-pulse">
              <Navigation className="w-5 h-5 fill-current transform rotate-45" />
            </div>
            <div className="bg-fleet-950 text-fleet-100 text-[9px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap border border-amber-500/40 shadow-lg mt-1 flex items-center gap-1">
              <span>🛵 {riderName}</span>
              <span className="text-amber-400 font-mono">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Customer Pin */}
        <div className="absolute right-[15%] top-[25%] transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-fleet-950 animate-bounce">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black text-fleet-300 bg-fleet-950/90 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-500/40 whitespace-nowrap shadow-md">
            {customerName}
          </span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 p-3 bg-fleet-950/90 backdrop-blur-md border-t border-fleet-800">
        <div className="flex items-center justify-between text-[10px] text-fleet-500 font-mono mb-2">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-fleet-300 truncate">{currentAddress}</span>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLon}`}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] bg-emerald-500 hover:bg-emerald-400 text-fleet-950 font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md transition cursor-pointer shrink-0"
          >
            <ExternalLink className="w-3 h-3" /> Maps
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 shrink-0">
            <FastForward className="w-3 h-3" /> Route
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => { setIsAutoSimulating(false); setProgress(Number(e.target.value)); }}
            className="w-full h-1.5 bg-fleet-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] font-mono text-fleet-400 font-bold shrink-0">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
