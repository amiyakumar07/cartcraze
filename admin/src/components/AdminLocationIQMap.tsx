import React, { useState, useEffect } from 'react';
import { Compass, ShieldCheck, RefreshCw, Radio, Store, Navigation, Play, Zap, Phone, Battery, Gauge, User, ExternalLink, MapPin } from 'lucide-react';
import { fetchLiveRidersApi, triggerSimulateMovementApi, LOCATIONIQ_API_KEY, type LiveRider } from '../services/locationiq';

interface CustomerLocation {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  lat: number;
  lon: number;
  ordersPlaced: number;
  source: string;
  lastUpdated?: string;
}

export const AdminLocationIQMap: React.FC = () => {
  const [riders, setRiders] = useState<LiveRider[]>([]);
  const [users, setUsers] = useState<CustomerLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRider, setSelectedRider] = useState<LiveRider | null>(null);
  const [selectedUser, setSelectedUser] = useState<CustomerLocation | null>(null);

  const loadData = async () => {
    setLoading(true);
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

    // 1. Fetch live riders
    const riderData = await fetchLiveRidersApi();
    setRiders(riderData);
    if (riderData.length > 0 && !selectedRider) {
      setSelectedRider(riderData[0]);
    }

    // 2. Fetch customer user locations (Login GPS & Checkout GPS)
    try {
      const API = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:4000/api'
        : 'https://cartcraze-95gt.onrender.com/api';
      const res = await fetch(`${API}/users`);
      const data = await res.json();
      if (data && data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch {
      // Keep mock default if offline
      setUsers([
        {
          id: 'usr-001',
          name: 'Amiya Sahoo',
          phone: '+91 98765 43210',
          email: 'amiyasahoo392@gmail.com',
          address: 'Sector 1, HSR Layout, Bengaluru',
          lat: 12.9141,
          lon: 77.6411,
          ordersPlaced: 5,
          source: 'CHECKOUT GPS'
        },
        {
          id: 'usr-002',
          name: 'Rahul Sharma',
          phone: '+91 98123 45678',
          email: 'rahul.s@gmail.com',
          address: '27th Main Rd, HSR Layout, Bengaluru',
          lat: 12.9200,
          lon: 77.6450,
          ordersPlaced: 2,
          source: 'LOGIN GPS'
        }
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerSimulate = async (riderId: string) => {
    await triggerSimulateMovementApi(riderId, 10);
    loadData();
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
            <h2 className="text-base font-black text-white">LocationIQ Fleet &amp; Customer GPS Map</h2>
            <p className="text-xs text-slate-400">Real-Time Telemetry for Riders, Stores &amp; Customer Order Locations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/90 border border-emerald-800 text-emerald-400 text-xs px-3.5 py-1.5 rounded-2xl font-bold flex items-center gap-2 shadow-xs">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{riders.length} Riders • {users.length} Customer Locations</span>
          </div>

          <button
            onClick={loadData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-2xl transition cursor-pointer"
            title="Refresh LocationIQ Fleet Map"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>



      {/* Fleet Telemetry Tables: Riders & Customer Users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Customer User Locations List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Customer GPS Locations ({users.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Login &amp; Checkout GPS</span>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs max-h-72 overflow-y-auto pr-1">
            {users.map((u) => (
              <div 
                key={u.id}
                onClick={() => { setSelectedUser(u); setSelectedRider(null); }}
                className={`py-3 px-3 rounded-2xl space-y-1.5 transition cursor-pointer ${
                  selectedUser?.id === u.id ? 'bg-slate-800/90 border border-cyan-400/40' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-xs flex items-center gap-1">
                      <span>🏠 {u.name}</span>
                      <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800 font-mono">
                        {u.source || 'GPS'}
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">{u.phone}</p>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${u.lat},${u.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-[10px] font-extrabold px-2 py-1 rounded-xl flex items-center gap-1 transition shrink-0"
                  >
                    <span>Open Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-[10px] text-slate-300 truncate">📍 {u.address}</p>
                <p className="text-[9px] text-slate-500 font-mono">GPS Coords: {u.lat.toFixed(4)}, {u.lon.toFixed(4)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Rider Fleet Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Live Rider Fleet ({riders.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Click rider to inspect</span>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs max-h-72 overflow-y-auto pr-1">
            {riders.map((r) => (
              <div 
                key={r.riderId} 
                onClick={() => { setSelectedRider(r); setSelectedUser(null); }}
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
                    <p className="text-[10px] text-slate-400 font-mono">{r.vehicleNumber || 'KA-05-EV-4829'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <div className="text-right">
                    <span className="text-slate-300 block">{r.lat.toFixed(4)}, {r.lon.toFixed(4)}</span>
                    <span className="text-amber-400 text-[10px]">{r.speed || 30} km/h</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTriggerSimulate(r.riderId);
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black px-2 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs shrink-0"
                    title="Simulate Next Movement Step"
                  >
                    <Play className="w-3 h-3 fill-slate-950" />
                    <span>Step</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Inspector Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-400" />
                Selected Node Inspector
              </h3>
            </div>

            {selectedUser ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-2xl border border-cyan-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-cyan-400">🏠 {selectedUser.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{selectedUser.phone}</span>
                  </div>
                  <span className="bg-cyan-950 text-cyan-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-cyan-800">
                    {selectedUser.source || 'GPS'}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Address:</span>
                    <span className="text-right font-sans font-bold text-white text-[11px] truncate max-w-[150px]">{selectedUser.address}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Latitude:</span>
                    <span className="text-cyan-400 font-bold">{selectedUser.lat}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Longitude:</span>
                    <span className="text-cyan-400 font-bold">{selectedUser.lon}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Orders Placed:</span>
                    <span className="text-amber-400 font-bold">{selectedUser.ordersPlaced} Orders</span>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${selectedUser.lat},${selectedUser.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Customer Location in Google Maps</span>
                </a>
              </div>
            ) : selectedRider ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-amber-400">🛵 {selectedRider.riderName}</h4>
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
                </div>

                <button
                  onClick={() => handleTriggerSimulate(selectedRider.riderId)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Simulate GPS Move Step</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Select a rider or customer node to inspect.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
