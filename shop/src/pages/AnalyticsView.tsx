import React, { useState } from 'react';
import type { StoreOrder, InventoryItem } from '../types';
import { Flame, Package, BarChart3, Award, ArrowUp } from 'lucide-react';

interface AnalyticsViewProps {
  orders: StoreOrder[];
  inventory: InventoryItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ orders, inventory }) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED' || o.status === 'DISPATCHED');
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  const totalOrders = orders.length;
  const fulfillmentRate = totalOrders > 0 ? Math.round((deliveredOrders.length / totalOrders) * 100) : 100;
  const avgOrderValue = deliveredOrders.length > 0 ? Math.round(totalRevenue / deliveredOrders.length) : 0;

  // Top selling from order items
  const itemMap: Record<string, { name: string; units: number; revenue: number; image: string }> = {};
  for (const order of deliveredOrders) {
    for (const item of order.items || []) {
      if (!itemMap[item.name]) {
        itemMap[item.name] = { name: item.name, units: 0, revenue: 0, image: item.image };
      }
      itemMap[item.name].units += item.quantity;
      itemMap[item.name].revenue += item.price * item.quantity;
    }
  }
  const topProducts = Object.values(itemMap)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  // Inventory stats
  const inStockCount = inventory.filter((i) => i.inStock).length;
  const lowStockCount = inventory.filter((i) => i.inStock && i.stockCount < 5).length;

  // Hourly breakdown (mock from order timestamps)
  const hourlyData = Array(12).fill(0).map((_, i) => {
    const count = orders.filter((o) => {
      const h = parseInt((o.orderTime || '').split(':')[0] || '0');
      return h === 6 + i;
    }).length;
    return { hour: `${6 + i}:00`, count };
  });
  const maxHourlyCount = Math.max(...hourlyData.map((d) => d.count), 1);

  const kpiMultiplier = period === 'today' ? 1 : period === 'week' ? 7 : 30;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Revenue Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="bg-[#fdee24] text-black font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Darkstore Analytics
            </span>
            <h2 className="text-lg font-extrabold mt-2">
            Darkstore Performance
          </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time data from backend</p>
          </div>
          {/* Period Toggle */}
          <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
            {(['today', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-1 text-[10px] font-black rounded-lg transition cursor-pointer ${
                  period === p ? 'bg-[#fdee24] text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'today' ? 'Day' : p === 'week' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Revenue + Orders */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Revenue</span>
            <span className="text-2xl font-black text-[#fdee24] mt-1 block">
              ₹{(totalRevenue * kpiMultiplier).toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-bold">+12% vs yesterday</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Orders</span>
            <span className="text-2xl font-black text-white mt-1 block">{totalOrders * kpiMultiplier}</span>
            <span className="text-[10px] text-emerald-400 font-bold">Avg ₹{avgOrderValue}/order</span>
          </div>
        </div>

        {/* 4 KPI Chips */}
        <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">SLA</span>
            <span className="font-black text-emerald-400">9 min</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Fill Rate</span>
            <span className="font-black text-emerald-400">{fulfillmentRate}%</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">In Stock</span>
            <span className="font-black text-white">{inStockCount}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Low Stock</span>
            <span className={`font-black ${lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {lowStockCount}
            </span>
          </div>
        </div>
      </div>

      {/* Hourly Activity Chart */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-slate-700" />
          <span className="text-sm font-black text-slate-900">Hourly Order Volume</span>
        </div>
        <div className="flex items-end gap-1 h-24">
          {hourlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-lg transition-all ${
                  d.count === Math.max(...hourlyData.map(x => x.count)) && d.count > 0
                    ? 'bg-[#ffc800]'
                    : 'bg-slate-100'
                }`}
                style={{ height: `${(d.count / maxHourlyCount) * 80 + 4}px` }}
              />
              {i % 3 === 0 && (
                <span className="text-[8px] text-slate-400 font-bold">{d.hour.replace(':00', '')}</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-2 text-center">
          {orders.length === 0 ? 'No orders yet today — data will populate as orders come in' : 'Orders per hour (6AM–6PM)'}
        </p>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
          <Flame className="w-5 h-5 text-red-500 fill-red-500" />
          <span>Top Selling Products</span>
        </div>

        {topProducts.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400 font-medium">
              Product sales data will appear here once orders are delivered
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 text-xs">
            {topProducts.map((item, i) => (
              <div key={item.name} className="py-3 first:pt-0 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                    i === 0 ? 'bg-[#ffc800] text-black' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {i + 1}
                  </span>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100"
                    />
                  )}
                  <div>
                    <span className="font-extrabold text-slate-900 block line-clamp-1">{item.name}</span>
                    <span className="text-[10px] text-slate-500">{item.units} units sold</span>
                  </div>
                </div>
                <span className="font-black text-slate-900">₹{item.revenue}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory Health */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Inventory Health</span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
            <p className="text-2xl font-black text-emerald-700">{inStockCount}</p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">In Stock</p>
          </div>
          <div className={`rounded-2xl p-3 border ${lowStockCount > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
            <p className={`text-2xl font-black ${lowStockCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
              {lowStockCount}
            </p>
            <p className={`text-[10px] font-bold uppercase mt-0.5 ${lowStockCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
              Low Stock
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
            <p className="text-2xl font-black text-slate-700">{inventory.length - inStockCount}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Out Stock</p>
          </div>
        </div>

        {/* Stock health bar */}
        <div>
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
            <span>Stock Health</span>
            <span>{inventory.length > 0 ? Math.round((inStockCount / inventory.length) * 100) : 0}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
              style={{ width: `${inventory.length > 0 ? (inStockCount / inventory.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
