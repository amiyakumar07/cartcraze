import React from 'react';
import { DollarSign, ShoppingBag, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

export const PlatformOverview: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Today's Net GMV</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400 block">₹0</span>
          <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> Real-time live billing active
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Total Deliveries Today</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-amber-400 block">0</span>
          <span className="text-[11px] text-slate-400 font-medium">Waiting for customer orders</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Average Delivery SLA</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-3xl font-black text-blue-400 block">7.4 Mins</span>
          <span className="text-[11px] text-emerald-400 font-bold">100% within 9-min SLA</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Security &amp; System Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-white block">99.98%</span>
          <span className="text-[11px] text-emerald-400 font-bold">Firewall Active • 0 Intrusion Alerts</span>
        </div>
      </div>

      {/* Quick City-Wise Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-white">City-Wise QuickCommerce Performance</h3>
            <p className="text-xs text-slate-400">Live order dispatch metrics per urban hub</p>
          </div>
          <span className="bg-slate-800 text-slate-300 font-mono text-xs px-3 py-1 rounded-full">
            5 Major Metro Hubs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { city: 'Bengaluru Metro', stores: 0, orders: '0', revenue: '₹0', status: 'Ready for Onboarding' },
            { city: 'Mumbai Metro', stores: 0, orders: '0', revenue: '₹0', status: 'Ready for Onboarding' },
            { city: 'Delhi-NCR Metro', stores: 0, orders: '0', revenue: '₹0', status: 'Ready for Onboarding' }
          ].map((hub) => (
            <div key={hub.city} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-white">{hub.city}</span>
                <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-800">
                  {hub.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span>Active Stores:</span>
                  <strong className="text-slate-200">{hub.stores} Darkstores</strong>
                </div>
                <div className="flex justify-between">
                  <span>Orders Today:</span>
                  <strong className="text-slate-200">{hub.orders}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gross Sales:</span>
                  <strong className="text-amber-400 font-black">{hub.revenue}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
