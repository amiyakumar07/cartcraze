import React from 'react';
import { Power, TrendingUp, Package, Clock, MapPin, Radio, Navigation } from 'lucide-react';
import { cn } from '../utils/cn';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SwipeToConfirm } from '../components/SwipeToConfirm';
import { useCountUp } from '../hooks/useCountUp';
import type { RiderProfile, AppTab, RiderOrder, DutyStatus } from '../types';

interface Props {
  riderProfile: RiderProfile;
  dutyStatus: DutyStatus;
  setDutyStatus: (s: DutyStatus) => void;
  apiError: boolean;
  setActiveTab: (tab: AppTab) => void;
  activeOrder: RiderOrder | null;
  setActiveOrder: (o: RiderOrder) => void;
}

export const HomeScreen: React.FC<Props> = ({
  riderProfile,
  dutyStatus,
  setDutyStatus,
  setActiveTab,
  activeOrder,
  setActiveOrder,
}) => {
  const isOnDuty = dutyStatus === 'ON_DUTY';
  const earningsCount = useCountUp(riderProfile.todayEarnings, 800);
  const deliveriesCount = useCountUp(riderProfile.todayDeliveries, 600);

  return (
    <div className="min-h-full flex flex-col bg-fleet-950 text-fleet-50 pb-6">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-fleet-950/90 backdrop-blur-xl border-b border-fleet-800/50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              <span className="gradient-text">CartCraze</span>
            </h1>
            <p className="text-[10px] text-fleet-500 font-bold tracking-widest uppercase mt-0.5">Rider Partner</p>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-10 h-10 rounded-full bg-fleet-800 border border-fleet-700 flex items-center justify-center text-sm font-bold text-amber-400 hover:bg-fleet-700 transition cursor-pointer"
          >
            {riderProfile.name?.charAt(0).toUpperCase() || 'R'}
          </button>
        </div>
      </header>

      <div className="px-5 pt-5 space-y-5">
        {/* Earnings + Toggle Card */}
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10" />

          <div className="relative flex items-center justify-between">
            <div onClick={() => setActiveTab('earnings')} className="cursor-pointer group">
              <p className="text-xs text-fleet-400 font-semibold flex items-center gap-1 group-hover:text-amber-400 transition">
                Today's Earnings <TrendingUp className="w-3 h-3" />
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-display font-bold text-white">₹{earningsCount}</span>
                <Badge variant="success" size="sm" dot>+12%</Badge>
              </div>
            </div>

            <button
              onClick={() => setDutyStatus(isOnDuty ? 'OFF_DUTY' : 'ON_DUTY')}
              className={cn(
                'relative flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 cursor-pointer',
                isOnDuty 
                  ? 'bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                  : 'bg-fleet-700/50 text-fleet-500'
              )}
            >
              <div className={cn(
                'w-12 h-7 rounded-full p-0.5 transition-colors duration-300 flex items-center',
                isOnDuty ? 'bg-emerald-500' : 'bg-fleet-600'
              )}>
                <div className={cn(
                  'w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300',
                  isOnDuty ? 'translate-x-5' : 'translate-x-0'
                )} />
              </div>
              <span className={cn(
                'text-[10px] font-black tracking-wider uppercase',
                isOnDuty ? 'text-emerald-400' : 'text-fleet-500'
              )}>
                {isOnDuty ? 'Online' : 'Offline'}
              </span>
              {isOnDuty && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse-glow" />}
            </button>
          </div>
        </Card>

        {/* Order Section */}
        {isOnDuty ? (
          activeOrder ? (
            <div className="animate-fade-in-up">
              <Card variant="glass" className="relative overflow-hidden border-amber-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

                {/* Order Header */}
                <div className="relative flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/15 rounded-xl">
                      <Package className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-400">Express Delivery</p>
                      <p className="text-[10px] text-fleet-500">{activeOrder.estimatedTime || '12 mins'}</p>
                    </div>
                  </div>
                  <span className="text-xl font-display font-bold text-white">₹{activeOrder.payoutAmount || 85}</span>
                </div>

                {/* Route */}
                <div className="space-y-4 relative pl-2">
                  {/* Pickup */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-fleet-500 border-2 border-fleet-400" />
                      <div className="w-0.5 h-8 bg-fleet-700 my-1" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-fleet-500 uppercase tracking-wider">Pickup</p>
                      <p className="text-sm font-bold text-fleet-100">{activeOrder.restaurantName || 'Fresh Valley Market'}</p>
                      <p className="text-xs text-fleet-500">{activeOrder.restaurantAddress || 'Sector 1, HSR Layout'}</p>
                    </div>
                  </div>

                  {/* Dropoff */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full border-2 border-amber-400 bg-fleet-950" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-fleet-500 uppercase tracking-wider">Dropoff</p>
                      <p className="text-sm font-bold text-fleet-100">{activeOrder.customerName}</p>
                      <p className="text-xs text-fleet-500">{activeOrder.deliveryAddress}</p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${activeOrder.customerLat},${activeOrder.customerLon}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[10px] bg-fleet-800 hover:bg-fleet-700 text-amber-400 font-bold px-2.5 py-1 rounded-lg border border-fleet-700 transition"
                      >
                        <Navigation className="w-3 h-3" /> Navigate
                      </a>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-4 p-3 bg-fleet-900/80 rounded-xl border border-fleet-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-fleet-300">{activeOrder.itemsCount || 1} items</span>
                    <Badge variant="success" size="sm">{activeOrder.paymentMethod}</Badge>
                  </div>
                  {activeOrder.items && (
                    <p className="text-[11px] text-fleet-500 truncate">
                      {activeOrder.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  )}
                </div>

                {/* Swipe Action */}
                <div className="mt-4">
                  <SwipeToConfirm
                    label="Swipe to accept"
                    confirmLabel="Accepted!"
                    variant="amber"
                    onConfirm={async () => {
                      try {
                        await fetch(`http://localhost:4000/api/orders/${activeOrder.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'OUT_FOR_DELIVERY', riderId: riderProfile.id })
                        });
                      } catch (e) {
                        console.warn('Status update failed:', e);
                      }
                      setActiveTab('delivery');
                    }}
                  />
                </div>
              </Card>
            </div>
          ) : (
            /* Searching State */
            <div className="animate-fade-in">
              <Card variant="glass" className="text-center py-10 border-fleet-700/50">
                <div className="relative inline-flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <Radio className="w-8 h-8 text-amber-400 animate-pulse" />
                  </div>
                  <span className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-radar" />
                </div>
                <h3 className="text-base font-bold text-fleet-100 mb-1">Scanning for Orders</h3>
                <p className="text-xs text-fleet-500 max-w-[240px] mx-auto mb-4">
                  LocationIQ GPS is actively monitoring for new delivery requests near HSR Layout
                </p>
                <Badge variant="amber" size="sm" dot>2.5 km Radius Active</Badge>
              </Card>
            </div>
          )
        ) : (
          /* Offline State */
          <div className="animate-fade-in">
            <Card variant="bordered" className="text-center py-10">
              <div className="w-16 h-16 bg-fleet-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Power className="w-8 h-8 text-fleet-600" />
              </div>
              <h3 className="text-base font-bold text-fleet-200 mb-2">You're Offline</h3>
              <p className="text-xs text-fleet-500 max-w-[260px] mx-auto mb-5">
                Go online to start receiving instant order requests from the darkstore
              </p>
              <Button variant="primary" onClick={() => setDutyStatus('ON_DUTY')} className="mx-auto">
                <Power className="w-4 h-4" /> Go Online
              </Button>
            </Card>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card variant="default" className="touch-feedback cursor-pointer" onClick={() => setActiveTab('orders')}>
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <Badge variant="info" size="sm">Today</Badge>
            </div>
            <p className="text-[10px] text-fleet-500 font-medium">Completed</p>
            <p className="text-xl font-display font-bold text-fleet-100 mt-0.5">{deliveriesCount} <span className="text-xs text-fleet-500 font-sans">orders</span></p>
          </Card>

          <Card variant="default" className="touch-feedback">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-[10px] text-fleet-500 font-medium">Online Time</p>
            <p className="text-xl font-display font-bold text-fleet-100 mt-0.5">4.5 <span className="text-xs text-fleet-500 font-sans">hrs</span></p>
          </Card>
        </div>

        {/* Zone Info */}
        <div className="flex items-center gap-2 px-4 py-3 bg-fleet-900/50 rounded-xl border border-fleet-800/50">
          <MapPin className="w-4 h-4 text-fleet-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-fleet-500 font-bold uppercase tracking-wider">Active Zone</p>
            <p className="text-xs text-fleet-400 truncate">HSR Layout Sector 1 • Bengaluru</p>
          </div>
          <Badge variant="success" size="sm" dot>Live</Badge>
        </div>
      </div>
    </div>
  );
};
