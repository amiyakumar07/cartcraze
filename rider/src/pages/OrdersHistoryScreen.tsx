import React, { useState } from 'react';
import type { RiderOrder } from '../types';
import { Search, Filter, Calendar, MapPin, Store, CheckCircle2, XCircle, Clock, ChevronRight, DollarSign, Eye, X } from 'lucide-react';

interface OrdersHistoryScreenProps {
  activeOrder: RiderOrder | null;
  setActiveTab: (tab: any) => void;
}

interface CompletedHistoryOrder {
  id: string;
  storeName: string;
  customerName: string;
  address: string;
  completedAt: string;
  payout: number;
  paymentMethod: 'UPI' | 'COD' | 'CARD';
  status: 'COMPLETED' | 'CANCELLED';
  durationMins: number;
  distanceKm: number;
  itemsCount: number;
}

export const OrdersHistoryScreen: React.FC<OrdersHistoryScreenProps> = ({
  activeOrder,
  setActiveTab
}) => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrderModal, setSelectedOrderModal] = useState<CompletedHistoryOrder | null>(null);

  const mockHistory: CompletedHistoryOrder[] = [
    {
      id: 'CC-9401',
      storeName: 'Fresh Valley Market',
      customerName: 'Amiya Sahoo',
      address: 'Sector 1, HSR Layout, Bengaluru',
      completedAt: 'Today, 05:42 PM',
      payout: 85,
      paymentMethod: 'UPI',
      status: 'COMPLETED',
      durationMins: 14,
      distanceKm: 3.2,
      itemsCount: 4
    },
    {
      id: 'CC-9388',
      storeName: 'Organic Greens Express',
      customerName: 'Rahul Sharma',
      address: '27th Main Rd, HSR Layout, Bengaluru',
      completedAt: 'Today, 03:15 PM',
      payout: 65,
      paymentMethod: 'COD',
      status: 'COMPLETED',
      durationMins: 11,
      distanceKm: 2.1,
      itemsCount: 2
    },
    {
      id: 'CC-9275',
      storeName: 'Daily Dairy & Bakery Hub',
      customerName: 'Priya Verma',
      address: 'Koramangala 5th Block, Bengaluru',
      completedAt: 'Yesterday, 08:10 PM',
      payout: 110,
      paymentMethod: 'UPI',
      status: 'COMPLETED',
      durationMins: 18,
      distanceKm: 4.8,
      itemsCount: 7
    },
    {
      id: 'CC-9120',
      storeName: 'Fresh Valley Market',
      customerName: 'Anish Kumar',
      address: 'Sector 3, HSR Layout, Bengaluru',
      completedAt: 'Yesterday, 02:40 PM',
      payout: 0,
      paymentMethod: 'UPI',
      status: 'CANCELLED',
      durationMins: 5,
      distanceKm: 1.5,
      itemsCount: 3
    }
  ];

  const filteredOrders = mockHistory.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.storeName.toLowerCase().includes(search.toLowerCase());
    const matchesTab = filterTab === 'ALL' || o.status === filterTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-24 font-sans animate-fadeIn">
      {/* Top Action Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-20 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-black text-white">Delivery Order History</h1>
            <p className="text-[11px] text-slate-400 font-medium">Track your completed &amp; assigned deliveries</p>
          </div>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-black px-2.5 py-1 rounded-full">
            {mockHistory.length} Total Deliveries
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, Customer, or Store..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none font-medium"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 text-xs">
          {(['ALL', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                filterTab === tab
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'All Orders' : tab === 'COMPLETED' ? 'Completed ✓' : 'Cancelled ✕'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Active Order Banner if live delivery in progress */}
        {activeOrder && (
          <div
            onClick={() => setActiveTab('delivery')}
            className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 border border-amber-500/50 p-4 rounded-3xl shadow-xl flex items-center justify-between cursor-pointer group hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md animate-bounce">
                🛵
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ACTIVE DELIVERY IN PROGRESS
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">#{activeOrder.id}</span>
                </div>
                <h4 className="text-xs font-extrabold text-white mt-1">Deliver to {activeOrder.customerName}</h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">{activeOrder.deliveryAddress}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-amber-400 group-hover:underline block">Resume →</span>
              <span className="text-[10px] text-emerald-400 font-bold">₹{activeOrder.payoutAmount || 75}</span>
            </div>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrderModal(order)}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-sm hover:border-slate-700 transition-all cursor-pointer space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-xs font-mono">{order.id}</span>
                  <span className="text-[10px] text-slate-400 font-medium">• {order.completedAt}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-300 mt-1 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{order.storeName}</span>
                </h4>
              </div>

              <div className="text-right">
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                  order.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {order.status === 'COMPLETED' ? `+ ₹${order.payout}` : 'Cancelled'}
                </span>
                <span className="text-[9px] text-slate-400 block font-mono mt-1">{order.paymentMethod}</span>
              </div>
            </div>

            <div className="h-px bg-slate-800/80" />

            <div className="flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[220px]">{order.address}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] shrink-0">
                <span>{order.distanceKm} km</span>
                <span>•</span>
                <span>{order.durationMins}m</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 text-white relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-mono">ORDER TIMELINE SUMMARY</span>
                <h3 className="text-sm font-black text-white">Order #{selectedOrderModal.id}</h3>
              </div>
              <button onClick={() => setSelectedOrderModal(null)} className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Rider Payout</span>
                <span className="font-extrabold text-emerald-400 text-sm">₹{selectedOrderModal.payout}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Items Count</span>
                <span className="font-bold text-white">{selectedOrderModal.itemsCount} SKUs</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Total Delivery Duration</span>
                <span className="font-bold text-white">{selectedOrderModal.durationMins} Minutes</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Payment Type</span>
                <span className="font-bold text-amber-300">{selectedOrderModal.paymentMethod}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-300">Delivery Route Breakdown</h4>
              <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/40 space-y-2">
                <p className="text-[11px]"><strong>Store:</strong> {selectedOrderModal.storeName}</p>
                <p className="text-[11px]"><strong>Customer:</strong> {selectedOrderModal.customerName}</p>
                <p className="text-[11px] text-slate-400"><strong>Address:</strong> {selectedOrderModal.address}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderModal(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-2xl cursor-pointer"
            >
              Close Order Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
