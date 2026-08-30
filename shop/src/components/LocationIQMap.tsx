import React, { useState, useEffect } from 'react';
import { Store, Navigation, MapPin, Compass, ShieldCheck } from 'lucide-react';
import { reverseGeocodeLocationIQ, fetchOrderLocationApi, LOCATIONIQ_API_KEY, type LiveRiderLocation } from '../services/locationiq';

interface ShopLocationIQMapProps {
  orderId?: string;
  customerAddress?: string;
}

export const LocationIQMap: React.FC<ShopLocationIQMapProps> = ({ orderId = 'QM-849201', customerAddress }) => {
  const storeLat = 12.9100;
  const destLat = 12.9250;

  const [liveLocation, setLiveLocation] = useState<LiveRiderLocation | null>(null);
  const [address, setAddress] = useState(customerAddress || 'HSR Layout 27th Main, Bengaluru');

  useEffect(() => {
    let isMounted = true;

    const pollLocation = async () => {
      const locationData = await fetchOrderLocationApi(orderId);
      if (isMounted && locationData) {
        setLiveLocation(locationData);
      }
    };

    pollLocation();
    const interval = setInterval(pollLocation, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  const currentRiderLat = liveLocation?.lat ?? 12.9160;
  const currentRiderLon = liveLocation?.lon ?? 77.6440;

  const calcPct = Math.min(100, Math.max(10, Math.round(((currentRiderLat - storeLat) / (destLat - storeLat || 0.0001)) * 100)));
  const progressPct = isNaN(calcPct) ? 45 : calcPct;

  useEffect(() => {
    if (!customerAddress) {
      reverseGeocodeLocationIQ(currentRiderLat, currentRiderLon).then((res) => setAddress(res.address));
    }
  }, [currentRiderLat, currentRiderLon, customerAddress]);

  const tileUrl = `https://a-tiles.locationiq.com/v3/streets/r/14/11728/7532.png?key=${LOCATIONIQ_API_KEY}`;

  return (
    <div className="relative bg-slate-900 rounded-3xl overflow-hidden h-48 border border-slate-800 shadow-md flex flex-col justify-between">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url("${tileUrl}"), radial-gradient(circle, rgba(15,23,42,0.8) 0%, rgba(2,6,23,0.95) 100%)` }}
      >
        <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg">
          <line x1="15%" y1="75%" x2="85%" y2="25%" stroke="#ffc800" strokeWidth="3" strokeDasharray="6 4" />
        </svg>
      </div>

      <div className="relative z-20 p-2.5 flex justify-between items-center bg-slate-950/85 backdrop-blur-xs text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>LocationIQ Live Dispatch Radar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
            Order #{orderId}
          </span>
          <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Synced</span>
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-1 relative">
        {/* Darkstore */}
        <div className="absolute left-[15%] top-[75%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 bg-[#ffc800] text-black rounded-full flex items-center justify-center shadow-lg border border-white">
            <Store className="w-4 h-4 text-black" />
          </div>
          <span className="text-[8px] font-bold text-white bg-slate-900/90 px-1.5 rounded-full mt-0.5">DS-14 Darkstore</span>
        </div>

        {/* Dispatch Rider */}
        <div 
          className="absolute transition-all duration-1000 ease-out flex flex-col items-center"
          style={{
            left: `${15 + progressPct * 0.7}%`,
            top: `${75 - progressPct * 0.5}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-xl border border-white ring-2 ring-amber-400/50 animate-bounce">
            <Navigation className="w-4 h-4 fill-black transform rotate-45" />
          </div>
          <span className="text-[8px] font-black text-white bg-slate-950 px-2 py-0.5 rounded-full mt-0.5 border border-amber-400">
            🛵 {liveLocation?.riderName || 'Rider En Route'}
          </span>
        </div>

        {/* Customer Dest */}
        <div className="absolute right-[15%] top-[25%] transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border border-white">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-[8px] font-bold text-white bg-slate-900/90 px-1.5 rounded-full mt-0.5">Customer Home</span>
        </div>
      </div>

      <div className="relative z-20 p-2 bg-slate-950/90 backdrop-blur-xs border-t border-slate-800 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-slate-300 truncate font-mono text-[9px]">{address}</span>
        </div>
        <span className="text-[8px] text-amber-400 font-mono shrink-0">
          {liveLocation?.speed ? `${liveLocation.speed} km/h` : '32 km/h'}
        </span>
      </div>
    </div>
  );
};
