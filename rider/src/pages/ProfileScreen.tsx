import React from 'react';
import { 
  Bike, CreditCard, BarChart3, LogOut, ChevronRight, Star, 
  CheckCircle2, MapPin, Zap, PhoneCall, Bell, Settings, ShieldCheck, Sparkles, Wallet
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';
import type { RiderProfile, AppTab } from '../types';

interface Props {
  riderProfile: RiderProfile;
  setRiderProfile: React.Dispatch<React.SetStateAction<RiderProfile>>;
  setActiveTab: (tab: AppTab) => void;
  onReRegister?: () => void;
}

export const ProfileScreen: React.FC<Props> = ({
  riderProfile,
  setRiderProfile,
  setActiveTab,
  onReRegister,
}) => {
  const handleLogout = () => {
    setRiderProfile(prev => ({ ...prev, isLoggedIn: false }));
  };

  const menuItems = [
    { icon: Bike, label: 'Vehicle & License', value: 'DL Verified', color: 'text-amber-400', bg: 'bg-amber-500/10', onClick: () => {} },
    { icon: CreditCard, label: 'Payout & Bank', value: 'UPI Linked', color: 'text-emerald-400', bg: 'bg-emerald-500/10', onClick: () => setActiveTab('earnings') },
    { icon: BarChart3, label: 'Performance', value: 'Top 5%', color: 'text-blue-400', bg: 'bg-blue-500/10', onClick: () => setActiveTab('ratings') },
    { icon: MapPin, label: 'GPS Telemetry', value: 'Live', color: 'text-purple-400', bg: 'bg-purple-500/10', onClick: () => {} },
    { icon: PhoneCall, label: 'Emergency Helpline', value: '24/7', color: 'text-rose-400', bg: 'bg-rose-500/10', onClick: () => {} },
  ];

  return (
    <div className="min-h-full bg-fleet-950 text-fleet-50 pb-32 animate-fade-in">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-fleet-800 to-fleet-950 pt-6 pb-12 px-5 rounded-b-[32px] border-b border-fleet-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-fleet-950 text-sm shadow-lg shadow-amber-500/20">
              CC
            </div>
            <div>
              <p className="text-[10px] font-black text-fleet-500 tracking-widest uppercase">Rider Partner</p>
              <h1 className="text-lg font-display font-bold text-fleet-100">Profile</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-xl bg-fleet-800/80 hover:bg-fleet-700 text-fleet-400 transition cursor-pointer border border-fleet-700/50">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl bg-fleet-800/80 hover:bg-fleet-700 text-fleet-400 transition cursor-pointer border border-fleet-700/50">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-3xl p-1 bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl">
              <img
                src={riderProfile.photo || `https://ui-avatars.com/api/?name=${riderProfile.name}&background=random`}
                alt={riderProfile.name}
                className="w-full h-full object-cover rounded-[20px] bg-fleet-800"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-fleet-900 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-display font-bold text-white">{riderProfile.name || 'Rider'}</h2>
              <Badge variant="amber" size="sm" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gold
              </Badge>
            </div>
            <p className="text-xs text-fleet-400 flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5" /> {riderProfile.vehicleNumber || 'Active Vehicle'}
            </p>
            <p className="text-xs text-fleet-500 font-mono mt-1">{riderProfile.phone}</p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 space-y-4 relative z-10">
        {/* Stats Bento */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="touch-feedback cursor-pointer" onClick={() => setActiveTab('earnings')}>
            <div className="p-2 bg-amber-500/10 rounded-xl w-fit mb-2">
              <Wallet className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[10px] text-fleet-500">Earnings</p>
            <p className="text-base font-display font-bold text-fleet-100">₹{riderProfile.todayEarnings}</p>
          </Card>
          <Card className="touch-feedback cursor-pointer" onClick={() => setActiveTab('orders')}>
            <div className="p-2 bg-blue-500/10 rounded-xl w-fit mb-2">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-[10px] text-fleet-500">Orders</p>
            <p className="text-base font-display font-bold text-fleet-100">{riderProfile.todayDeliveries}</p>
          </Card>
          <Card className="touch-feedback cursor-pointer" onClick={() => setActiveTab('ratings')}>
            <div className="p-2 bg-emerald-500/10 rounded-xl w-fit mb-2">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            </div>
            <p className="text-[10px] text-fleet-500">Rating</p>
            <p className="text-base font-display font-bold text-fleet-100 flex items-center gap-1">
              {riderProfile.rating} <span className="text-amber-400 text-xs">★</span>
            </p>
          </Card>
        </div>

        {/* Menu List */}
        <Card variant="glass" className="divide-y divide-fleet-700/50">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center justify-between p-4 hover:bg-fleet-800/50 transition cursor-pointer text-left first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div className="flex items-center gap-3.5">
                <div className={cn('p-2.5 rounded-xl', item.bg, item.color)}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-fleet-100">{item.label}</h4>
                  <p className="text-[11px] text-fleet-500">{item.value}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-fleet-600" />
            </button>
          ))}
        </Card>

        {/* Re-register */}
        {onReRegister && (
          <button
            onClick={() => { localStorage.removeItem('cartcraze_rider_data'); onReRegister(); }}
            className="w-full flex items-center justify-between p-4 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 rounded-2xl transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-400">Submit New Documents</h4>
                <p className="text-[11px] text-fleet-500">Update license & ID proof</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-500" />
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-400">Sign Out</h4>
              <p className="text-[11px] text-fleet-500">End session</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-500" />
        </button>
      </div>
    </div>
  );
};
