import React, { useState, useEffect } from 'react';
import { Compass, ShieldCheck, RefreshCw, Radio, MapPin, Store, Navigation, Play, Zap, Phone, Battery, Gauge } from 'lucide-react';
import { fetchLiveRidersApi, triggerSimulateMovementApi, LOCATIONIQ_API_KEY, type LiveRider } from '../services/locationiq';

export const AdminLocationIQMap: React.FC = () => {
  const [riders, setRiders] = useState<LiveRider[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRider, setSelectedRider] = useState<LiveRider | null>(null);

  const loadRiders = async () => {
    setLoading(true);
    const data = await fetchLiveRidersApi();
    setRiders(data);
    if (data.length > 0 && !selectedRider) {
      setSelectedRider(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRiders();
    const interval = setInterval(loadRiders, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerSimulate = async (riderId: string) => {
    await triggerSimulateMovementApi(riderId, 10);
    loadRiders();
  };

  const tileUrl = `https://a-tiles.locationiq.com/v3/streets/r/13/5864/3766.png?key=${LOCATIONIQ_API_KEY}`;

  return (
    <div className="space-y-4 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex flex-wrap justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400 text-black rounded-2xl shadow-md">
            <Compass className="w-6 h-6 animate-spin text-black" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">LocationIQ Central Fleet Control</h2>
            <p className="text-xs text-slate-400">101% Real-Time GPS Telemetry &amp; Rider Dispatch Map</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/90 border border-emerald-800 text-emerald-400 text-xs px-3.5 py-1.5 rounded-2xl font-bold flex items-center gap-2 shadow-xs">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{riders.length} Active Telemetry Nodes</span>
          </div>

          <button
            onClick={loadRiders}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-2xl transition cursor-pointer"
            title="Refresh LocationIQ Fleet Map"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main LocationIQ Map Canvas */}
      <div className="relative w-full h-[420px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url("${tileUrl}"), radial-gradient(circle, rgba(15,23,42,0.8) 0%, rgba(2,6,23,0.95) 100%)` }}
        />

        {/* Header Overlay */}
        <div className="relative z-20 p-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 flex justify-between items-center text-xs">
          <span className="font-extrabold text-amber-400 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            LocationIQ Telemetry Engine v3 • Bengaluru Metro Area
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/90 px-2.5 py-1 rounded-full border border-emerald-800">
              ● Live WebSocket Sync Active
            </span>
          </div>
        </div>

        {/* Map Node Markers */}
        <div className="relative z-10 flex-1 relative p-6">
          {/* Darkstores */}
          <div className="absolute left-[22%] top-[65%] flex flex-col items-center">
            <div className="w-10 h-10 bg-amber-400 text-black rounded-full flex items-center justify-center shadow-2xl border-2 border-white">
              <Store className="w-5 h-5 text-black" />
            </div>
            <span className="text-[10px] font-black text-white bg-slate-900/90 px-2.5 py-0.5 rounded-full mt-1 border border-slate-700 shadow-lg">
              DS-14 (HSR Layout)
            </span>
          </div>

          <div className="absolute left-[68%] top-[28%] flex flex-col items-center">
            <div className="w-10 h-10 bg-amber-400 text-black rounded-full flex items-center justify-center shadow-2xl border-2 border-white">
              <Store className="w-5 h-5 text-black" />
            </div>
            <span className="text-[10px] font-black text-white bg-slate-900/90 px-2.5 py-0.5 rounded-full mt-1 border border-slate-700 shadow-lg">
              DS-08 (Koramangala)
            </span>
          </div>

          {/* Active Live Riders */}
          {riders.map((r, idx) => {
            const leftPct = 25 + (idx * 28) % 60;
            const topPct = 30 + (idx * 22) % 50;
            const isSelected = selectedRider?.riderId === r.riderId;

            return (
              <div
                key={r.riderId}
                onClick={() => setSelectedRider(r)}
                className={`absolute transition-all duration-1000 ease-out flex flex-col items-center cursor-pointer ${
                  isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                }`}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-2xl border-2 border-white ring-4 ${
                  isSelected ? 'bg-amber-400 text-black ring-amber-400/80 animate-pulse' : 'bg-yellow-400 text-black ring-yellow-400/40'
                }`}>
                  <Navigation className="w-5 h-5 fill-black transform rotate-45" />
                </div>
                <div className="bg-slate-950 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full mt-1 border border-amber-400/70 shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                  <span>🛵 {r.riderName}</span>
                  <span className="text-emerald-400 font-mono">({r.speed || 30} km/h)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info bar */}
        <div className="relative z-20 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium text-[11px]">
              LocationIQ Real-Time GPS Tracking Active &amp; Synced Across All 5 App Nodes
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            2-Sec Telemetry Poll
          </span>
        </div>
      </div>

      {/* Live Telemetry Fleet Table & Selected Telemetry Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fleet Rider Cards */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Live Rider Fleet Telemetry ({riders.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Click rider to inspect</span>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            {riders.map((r) => (
              <div 
                key={r.riderId} 
                onClick={() => setSelectedRider(r)}
                className={`py-3 px-3 rounded-2xl flex justify-between items-center transition cursor-pointer ${
                  selectedRider?.riderId === r.riderId ? 'bg-slate-800/90 border border-amber-400/40' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold">
                    🛵
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{r.riderName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{r.vehicleNumber || 'KA-05-EV-4829'} • {r.riderId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono">
                  <div className="text-right">
                    <span className="text-slate-300 block">{r.lat.toFixed(4)}, {r.lon.toFixed(4)}</span>
                    <span className="text-amber-400 text-[10px]">{r.speed || 30} km/h • Battery {r.battery || 90}%</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerSimulate(r.riderId);
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs"
                    title="Simulate Next Movement Step"
                  >
                    <Play className="w-3 h-3 fill-slate-950" />
                    <span>Step GPS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Rider Detailed Telemetry Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-400" />
                Selected Telemetry Node
              </h3>
            </div>

            {selectedRider ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-amber-400">{selectedRider.riderName}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{selectedRider.riderId}</span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-800">
                    {selectedRider.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Latitude:</span>
                    <span>{selectedRider.lat}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Longitude:</span>
                    <span>{selectedRider.lon}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Speed:</span>
                    <span className="text-amber-400 font-bold">{selectedRider.speed || 32} km/h</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Battery Level:</span>
                    <span className="text-emerald-400 font-bold">{selectedRider.battery || 88}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Active Order:</span>
                    <span className="text-amber-300 font-bold">{selectedRider.orderId || 'QM-849201'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Select a rider node from the map or list.</p>
            )}
          </div>

          {selectedRider && (
            <button
              onClick={() => handleTriggerSimulate(selectedRider.riderId)}
              className="mt-4 w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Simulate GPS Move Step</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
