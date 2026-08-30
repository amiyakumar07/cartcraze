import React, { useState, useEffect } from 'react';
import { Bell, ShoppingBag, Radio, Wallet, ChevronRight, Check, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import type { StoreOrder } from '../types';

interface Props {
  isStoreOpen: boolean;
  setIsStoreOpen: (open: boolean) => void;
  orders: StoreOrder[];
  onSelectOrder: (order: StoreOrder) => void;
  onOpenTriggerModal?: () => void;
  shopData?: any;
  onToggleStoreOpen?: (open: boolean) => void;
}

export const HomeScreen: React.FC<Props> = ({
  isStoreOpen,
  setIsStoreOpen,
  orders,
  onSelectOrder,
  onOpenTriggerModal,
  shopData,
  onToggleStoreOpen,
}) => {
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'NEW' || o.status === 'PACKING' || o.status === 'READY'
  ).length;
  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;
  const dailySales = orders
    .filter((o) => o.status === 'DELIVERED' || o.status === 'DISPATCHED')
    .reduce((sum, o) => sum + (o.finalTotal || 0), 0);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const handleToggleStore = async (open: boolean) => {
    setIsStoreOpen(open);
    if (onToggleStoreOpen) onToggleStoreOpen(open);
    // Sync to backend
    if (shopData?.id) {
      try {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        await fetch(`http://${hostname}:4000/api/shops/${shopData.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isOpen: open }),
        });
      } catch { /* silent */ }
    }
  };

  const recentOrders = [...orders]
    .sort((a, b) => (a.status === 'NEW' ? -1 : b.status === 'NEW' ? 1 : 0))
    .slice(0, 5);

  const statusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PACKING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'READY': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DISPATCHED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DELIVERED': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-[#f9f9f9] font-sans pb-28 min-h-screen">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ffc800] flex items-center justify-center shadow-sm">
              <span className="text-lg font-black text-gray-900">
                {shopData?.name?.[0] || 'C'}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">{greeting},</p>
              <span className="text-sm font-black text-gray-900 tracking-tight">
                {shopData?.name || 'CartCraze Darkstore'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Store Open indicator */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${
              isStoreOpen
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
              <span>{isStoreOpen ? 'OPEN' : 'CLOSED'}</span>
            </div>

            <button
              onClick={onOpenTriggerModal}
              className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-50 rounded-xl transition relative"
            >
              <Bell className="w-5 h-5 text-gray-800" />
              {newOrdersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white text-[7px] text-white font-black flex items-center justify-center">
                  {newOrdersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* STORE STATUS TOGGLE CARD */}
        <div className={`rounded-3xl p-5 border shadow-sm flex items-center justify-between transition-all ${
          isStoreOpen
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
            : 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700'
        }`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isStoreOpen ? 'text-emerald-600' : 'text-slate-400'}`}>
              Store Status
            </p>
            <h3 className={`text-lg font-black mt-0.5 ${isStoreOpen ? 'text-emerald-900' : 'text-white'}`}>
              {isStoreOpen ? '✅ Accepting Orders' : '🔴 Closed — Tap to Open'}
            </h3>
            <p className={`text-xs mt-0.5 font-medium ${isStoreOpen ? 'text-emerald-700' : 'text-slate-400'}`}>
              {isStoreOpen
                ? `Serving customers since ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Toggle to start accepting orders'}
            </p>
          </div>

          <button
            onClick={() => handleToggleStore(!isStoreOpen)}
            className={`w-16 h-9 rounded-full transition-all duration-300 p-1 flex items-center shadow-inner ${
              isStoreOpen ? 'bg-emerald-500' : 'bg-slate-600'
            }`}
          >
            <div
              className={`w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
                isStoreOpen ? 'translate-x-7' : 'translate-x-0'
              }`}
            >
              {isStoreOpen && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* KPI METRICS ROW */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Orders */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs text-center">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-gray-900 leading-none">{orders.length}</p>
            <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Orders Today</p>
          </div>

          {/* Live Queue */}
          <div className="bg-[#ffc800] rounded-2xl p-4 border border-[#ffc800] shadow-sm text-center relative overflow-hidden">
            <div className="w-8 h-8 bg-black/10 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <Radio className="w-4 h-4 text-gray-900" />
            </div>
            <p className="text-2xl font-black text-gray-900 leading-none">{activeOrdersCount}</p>
            <p className="text-[10px] text-gray-900/70 font-bold mt-1 uppercase">Live Queue</p>
            {activeOrdersCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </div>

          {/* Daily Sales */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs text-center">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-gray-900 leading-none">
              ₹{dailySales > 999 ? `${(dailySales / 1000).toFixed(1)}k` : dailySales}
            </p>
            <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Daily Sales</p>
          </div>
        </div>

        {/* NEW ORDERS ALERT STRIP */}
        {newOrdersCount > 0 && (
          <div
            onClick={onOpenTriggerModal}
            className="bg-red-500 text-white rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer hover:bg-red-600 transition animate-pulse"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black">⚡ {newOrdersCount} New Order{newOrdersCount > 1 ? 's' : ''} Waiting!</p>
              <p className="text-[10px] text-red-100 font-medium">Tap to view & accept</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/70" />
          </div>
        )}

        {/* RECENT ORDERS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-700" />
              Recent Orders
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase">
              {orders.length} total
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
                🛍️
              </div>
              <h4 className="text-sm font-extrabold text-gray-900">No Orders Yet</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                {isStoreOpen
                  ? 'Your store is Online. Customer orders will appear here in real time.'
                  : 'Toggle the Store Status to OPEN above to start accepting orders.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${
                      order.status === 'NEW' ? 'bg-amber-400' :
                      order.status === 'PACKING' ? 'bg-blue-400' :
                      order.status === 'READY' ? 'bg-purple-400' :
                      order.status === 'DISPATCHED' ? 'bg-emerald-400' : 'bg-gray-300'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-gray-900">#{order.id}</h4>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border uppercase ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        {order.customerName || 'Customer'} • {order.items?.length || 1} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-black text-sm text-gray-900">₹{order.finalTotal}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PERFORMANCE STRIP */}
        {orders.length > 0 && (
          <div className="bg-slate-900 rounded-3xl p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#ffc800]" />
              <div>
                <p className="text-xs font-black text-white">9-min SLA</p>
                <p className="text-[10px] text-slate-400 font-medium">Fulfillment Rate</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-[#ffc800]">100%</p>
              <p className="text-[10px] text-slate-400 font-medium">All orders on time</p>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
};
