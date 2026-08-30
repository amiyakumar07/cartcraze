import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Store, Compass, ShieldCheck, Play, Pause, FastForward, Activity, ExternalLink } from 'lucide-react';
import { reverseGeocodeLocationIQ, pushRiderLocationApi, LOCATIONIQ_API_KEY } from '../services/locationiq';

interface RiderLocationIQMapProps {
  step: 'PICKUP' | 'DELIVERING' | 'DONE';
  riderName?: string;
  orderId?: string;
  destLat?: number;
  destLon?: number;
  customerName?: string;
  customerAddress?: string;
}

export const LocationIQMap: React.FC<RiderLocationIQMapProps> = ({
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

  // Simulator route progress (0 to 100)
  const [progress, setProgress] = useState<number>(step === 'PICKUP' ? 10 : step === 'DELIVERING' ? 55 : 98);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(32);
  const [currentAddress, setCurrentAddress] = useState('LocationIQ Resolving Rider GPS...');
  const [gpsActive, setGpsActive] = useState<boolean>(false);

  // Compute dynamic Lat/Lon along vector
  const currentLat = parseFloat((storeLat + (destLat - storeLat) * (progress / 100)).toFixed(4));
  const currentLon = parseFloat((storeLon + (destLon - storeLon) * (progress / 100)).toFixed(4));

  // Sync step prop to progress
  useEffect(() => {
    if (step === 'PICKUP') setProgress(10);
    else if (step === 'DELIVERING') setProgress(55);
    else setProgress(100);
  }, [step]);

  // Real device Geolocation Watcher
  useEffect(() => {
    let watchId: number | null = null;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setGpsActive(true);
          const realLat = pos.coords.latitude;
          const realLon = pos.coords.longitude;
          const realSpeed = Math.round((pos.coords.speed || 8) * 3.6);
          setSpeed(realSpeed > 0 ? realSpeed : 30);

          pushRiderLocationApi({
            riderId: 'rider-001',
            riderName,
            lat: realLat,
            lon: realLon,
            speed: realSpeed > 0 ? realSpeed : 30,
            status: step === 'PICKUP' ? 'PICKUP' : step === 'DELIVERING' ? 'EN_ROUTE' : 'DELIVERED',
            orderId
          });
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
  }, [step, riderName, orderId]);

  // Auto-Drive Simulator interval
  useEffect(() => {
    if (!isAutoSimulating) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 3;
        return next > 100 ? 10 : next;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isAutoSimulating]);

  // Push Telemetry and reverse geocode when coordinates change
  useEffect(() => {
    let isMounted = true;
    reverseGeocodeLocationIQ(currentLat, currentLon).then((res) => {
      if (isMounted) setCurrentAddress(res.address);
    });

    pushRiderLocationApi({
      riderId: 'rider-001',
      riderName,
      lat: currentLat,
      lon: currentLon,
      heading: progress * 3.6,
      speed,
      battery: 88,
      status: step === 'PICKUP' ? 'PICKUP' : step === 'DELIVERING' ? 'EN_ROUTE' : 'DELIVERED',
      orderId
    });

    return () => { isMounted = false; };
  }, [currentLat, currentLon, speed, step, riderName, orderId, progress]);

  const tileUrl = `https://a-tiles.locationiq.com/v3/streets/r/14/11728/7532.png?key=${LOCATIONIQ_API_KEY}`;

  return (
    <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between">
      {/* Background Map Tile */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 transition-opacity"
        style={{ backgroundImage: `url("${tileUrl}"), radial-gradient(circle, rgba(15,23,42,0.8) 0%, rgba(2,6,23,0.95) 100%)` }}
      >
        <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg">
          <line x1="15%" y1="75%" x2="85%" y2="25%" stroke="#F5A800" strokeWidth="4" strokeDasharray="6 4" />
        </svg>
      </div>

      {/* Top Telemetry Bar */}
      <div className="relative z-20 p-3 flex justify-between items-center bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Compass className="w-4 h-4 animate-spin text-amber-400" />
          <span>Rider GPS Telemetry</span>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-400/40">
            {speed} km/h
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
            gpsActive ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800' : 'bg-blue-950/90 text-blue-400 border-blue-800'
          }`}>
            <Activity className="w-3 h-3" />
            <span>{gpsActive ? 'Device GPS' : 'Auto Simulator'}</span>
          </span>

          <button
            onClick={() => setIsAutoSimulating(!isAutoSimulating)}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition"
            title={isAutoSimulating ? 'Pause Auto Drive' : 'Play Auto Drive'}
          >
            {isAutoSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div className="relative z-10 h-44 p-4">
        {/* Darkstore Pin */}
        <div className="absolute left-[15%] top-[75%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 bg-amber-400 text-black rounded-full flex items-center justify-center shadow-lg border border-white">
            <Store className="w-4 h-4 text-black" />
          </div>
          <span className="text-[8px] font-extrabold text-white bg-slate-900/90 px-2 py-0.5 rounded-full mt-1 border border-slate-700">
            Darkstore
          </span>
        </div>

        {/* Dynamic Moving Rider Pin */}
        <div 
          className="absolute transition-all duration-700 ease-out flex flex-col items-center"
          style={{
            left: `${15 + progress * 0.7}%`,
            top: `${75 - progress * 0.5}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-yellow-400/40 animate-pulse">
              <Navigation className="w-5 h-5 fill-black transform rotate-45" />
            </div>
            <div className="bg-slate-950 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap border border-amber-400/60 shadow-lg mt-1 flex items-center gap-1">
              <span>🛵 {riderName}</span>
              <span className="text-amber-400 font-mono">({progress}%)</span>
            </div>
          </div>
        </div>

        {/* Customer Pin */}
        <div className="absolute right-[15%] top-[25%] transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white animate-bounce">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-[9px] font-extrabold text-white bg-slate-900/90 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-500/50 whitespace-nowrap shadow-md">
            📍 Customer: {customerName} ({destLat.toFixed(3)}, {destLon.toFixed(3)})
          </span>
        </div>
      </div>

      {/* Simulator Controls & Address Bar */}
      <div className="relative z-20 p-3 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-200 truncate">{currentAddress}</span>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLon}`}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md transition cursor-pointer shrink-0"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open Google Maps</span>
          </a>
        </div>

        {/* Manual Progress Slider */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 shrink-0">
            <FastForward className="w-3 h-3" />
            Route Simulator
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              setIsAutoSimulating(false);
              setProgress(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-[10px] font-mono text-slate-300 font-bold shrink-0">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
