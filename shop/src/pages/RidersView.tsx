import React, { useState } from 'react';
import type { Rider } from '../types';
import { Phone, Star, Bike, RefreshCw, MapPin, Package } from 'lucide-react';

interface RidersViewProps {
  riders: Rider[];
  onRefresh?: () => void;
}

export const RidersView: React.FC<RidersViewProps> = ({ riders, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);

  const activeRiders = riders.filter((r) => r.status === 'DELIVERING');
  const availableRiders = riders.filter((r) => r.status === 'AVAILABLE');
  const offlineRiders = riders.filter((r) => r.status === 'OFFLINE');

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setRefreshing(false), 1200);
  };

  const statusConfig = {
    AVAILABLE: {
      label: 'Available',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
      dot: 'bg-emerald-500 animate-pulse',
    },
    DELIVERING: {
      label: 'On Delivery',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      dot: 'bg-amber-500 animate-bounce',
    },
    OFFLINE: {
      label: 'Offline',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      badge: 'bg-slate-100 text-slate-500',
      dot: 'bg-slate-300',
    },
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="bg-[#fdee24] text-black font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Delivery Executives
            </span>
            <h2 className="text-xl font-black mt-2">EV Scooter Fleet</h2>
            <p className="text-xs text-slate-400 mt-0.5">{riders.length} registered delivery partners</p>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-2xl transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Status Overview Chips */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-3">
            <p className="text-2xl font-black text-emerald-400">{availableRiders.length}</p>
            <p className="text-[10px] text-emerald-300 font-bold">Available</p>
          </div>
          <div className="bg-amber-500/20 border border-amber-500/30 rounded-2xl p-3">
            <p className="text-2xl font-black text-amber-400">{activeRiders.length}</p>
            <p className="text-[10px] text-amber-300 font-bold">On Route</p>
          </div>
          <div className="bg-slate-700/50 border border-slate-600 rounded-2xl p-3">
            <p className="text-2xl font-black text-slate-300">{offlineRiders.length}</p>
            <p className="text-[10px] text-slate-400 font-bold">Offline</p>
          </div>
        </div>
      </div>

      {/* Riders List */}
      {riders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-xs space-y-3">
          <div className="w-14 h-14 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto">
            <Bike className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">No Riders Registered</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Delivery executives assigned to your darkstore will appear here with their live delivery status.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Group: Delivering */}
          {activeRiders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  Currently On Delivery ({activeRiders.length})
                </span>
              </div>
              <div className="space-y-2">
                {activeRiders.map((rider) => (
                  <RiderCard key={rider.id} rider={rider} config={statusConfig.DELIVERING} />
                ))}
              </div>
            </div>
          )}

          {/* Group: Available */}
          {availableRiders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1 mt-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  Ready to Deploy ({availableRiders.length})
                </span>
              </div>
              <div className="space-y-2">
                {availableRiders.map((rider) => (
                  <RiderCard key={rider.id} rider={rider} config={statusConfig.AVAILABLE} />
                ))}
              </div>
            </div>
          )}

          {/* Group: Offline */}
          {offlineRiders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1 mt-3">
                <span className="w-2 h-2 bg-slate-400 rounded-full" />
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Offline ({offlineRiders.length})
                </span>
              </div>
              <div className="space-y-2 opacity-60">
                {offlineRiders.map((rider) => (
                  <RiderCard key={rider.id} rider={rider} config={statusConfig.OFFLINE} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RiderCard: React.FC<{ rider: Rider; config: any }> = ({ rider, config }) => {
  return (
    <div className={`bg-white rounded-3xl p-4 border ${config.border} shadow-xs`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={rider.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(rider.name)}&background=ffc800&color=000&bold=true`}
              alt={rider.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#ffc800] shadow-xs"
            />
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${config.dot}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-slate-900">{rider.name}</h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${config.badge}`}>
                {config.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{rider.phone}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
              <span className="font-bold text-amber-600 flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {rider.rating}
              </span>
              <span className="flex items-center gap-0.5 font-medium text-slate-500">
                <Package className="w-3 h-3" />
                {rider.deliveriesToday} deliveries
              </span>
              {rider.status === 'DELIVERING' && rider.currentOrderId && (
                <span className="flex items-center gap-0.5 font-bold text-amber-700">
                  <MapPin className="w-3 h-3" />
                  #{rider.currentOrderId}
                </span>
              )}
            </div>
          </div>
        </div>

        <a
          href={`tel:${rider.phone}`}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 transition-colors"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
