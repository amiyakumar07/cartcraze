import React from "react";
import { TrendingUp, Clock, Package, ArrowUpRight, Wallet } from 'lucide-react';
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useCountUp } from "../hooks/useCountUp";
import type { RiderProfile, EarningsBreakdown } from "../types";

interface Props {
  riderProfile?: RiderProfile;
}

const weeklyData: EarningsBreakdown[] = [
  { day: 'M', amount: 68, deliveries: 6, isToday: false },
  { day: 'T', amount: 112, deliveries: 9, isToday: false },
  { day: 'W', amount: 95, deliveries: 8, isToday: false },
  { day: 'T', amount: 148, deliveries: 12, isToday: true },
  { day: 'F', amount: 42, deliveries: 4, isToday: false },
  { day: 'S', amount: 125, deliveries: 10, isToday: false },
  { day: 'S', amount: 58, deliveries: 5, isToday: false },
];

const recentDeliveries = [
  { id: '#4920', time: '2:15 PM', distance: '3.2 mi', amount: 12.50, status: 'completed' as const },
  { id: '#4919', time: '1:30 PM', distance: '1.5 mi', amount: 8.00, status: 'completed' as const },
  { id: '#4915', time: '11:45 AM', distance: '4.1 mi', amount: 15.75, status: 'completed' as const },
];

export const EarningsScreen: React.FC<Props> = ({ riderProfile }) => {
  const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.amount, 0);
  const weeklyCount = useCountUp(Math.round(weeklyTotal), 1000);
  const todayCount = useCountUp(riderProfile?.todayEarnings || 0, 800);
  const deliveryCount = useCountUp(42, 800);

  const maxAmount = Math.max(...weeklyData.map(d => d.amount));

  return (
    <div className="min-h-full bg-fleet-950 text-fleet-50 pb-24 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-fleet-950/95 backdrop-blur-xl border-b border-fleet-800/50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-white">Earnings</h1>
            <p className="text-[10px] text-fleet-500 font-bold tracking-wider uppercase mt-0.5">Oct 16 - Oct 22, 2026</p>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Wallet className="w-4 h-4" />}>
            Cash Out
          </Button>
        </div>
      </header>

      <div className="px-5 pt-5 space-y-5">
        {/* Hero Stat */}
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative">
            <p className="text-xs text-fleet-500 font-bold uppercase tracking-wider mb-1">Weekly Earnings</p>
            <p className="text-4xl font-display font-bold text-white">₹{weeklyCount}</p>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 mt-6 h-28">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: `${(d.amount / maxAmount) * 100}%` }}>
                    <div 
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-500 min-h-[4px]",
                        d.isToday ? "bg-amber-500 shadow-lg shadow-amber-500/20" : "bg-fleet-700 hover:bg-fleet-600"
                      )} 
                    />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold",
                    d.isToday ? "text-amber-400" : "text-fleet-600"
                  )}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="touch-feedback">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Package className="w-4 h-4 text-emerald-400" />
              </div>
              <Badge variant="success" size="sm" dot>+12%</Badge>
            </div>
            <p className="text-[10px] text-fleet-500 font-medium">Deliveries</p>
            <p className="text-2xl font-display font-bold text-fleet-100">{deliveryCount}</p>
          </Card>

          <Card className="touch-feedback">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-[10px] text-fleet-500 font-medium">Time Online</p>
            <p className="text-2xl font-display font-bold text-fleet-100">28h 15m</p>
          </Card>
        </div>

        {/* Today's Earnings */}
        <Card variant="glass" className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-fleet-500 font-bold uppercase tracking-wider">Today</p>
            <p className="text-2xl font-display font-bold text-amber-400">₹{todayCount}</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-amber-400" />
          </div>
        </Card>

        {/* Recent Deliveries */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-fleet-100">Recent Deliveries</h3>
            <button className="text-xs font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer">
              View All <ArrowUpRight className="w-3 h-3 inline" />
            </button>
          </div>

          <div className="space-y-2">
            {recentDeliveries.map((d) => (
              <Card key={d.id} variant="default" className="flex items-center justify-between touch-feedback cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fleet-800 flex items-center justify-center border border-fleet-700">
                    <Package className="w-5 h-5 text-fleet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-fleet-100">Order {d.id}</p>
                    <p className="text-[11px] text-fleet-500">{d.time} • {d.distance}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-fleet-100">₹{d.amount.toFixed(2)}</p>
                  <Badge variant="success" size="sm">Completed</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from "../utils/cn";
