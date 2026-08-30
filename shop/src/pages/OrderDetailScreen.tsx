import React, { useState } from 'react';
import { ArrowLeft, Phone, Headphones, Printer, Check, CheckCircle2, Box, Bike, User, MapPin, Clock } from 'lucide-react';
import { LocationIQMap } from '../components/LocationIQMap';
import type { StoreOrder, Rider } from '../types';

interface Props {
  order: StoreOrder | null;
  riders?: Rider[];
  onBack: () => void;
  onMarkReady: (orderId: string) => void;
  onToggleItemPick?: (orderId: string, itemId: string) => void;
  onAssignRider?: (orderId: string, riderId: string) => void;
}

export const OrderDetailScreen: React.FC<Props> = ({
  order,
  riders = [],
  onBack,
  onMarkReady,
  onToggleItemPick,
  onAssignRider,
}) => {
  const orderItems = order?.items?.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    image: item.image || 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=200&q=80',
    location: (item as any).shelfLocation || 'Darkstore',
    picked: item.picked ?? false,
    weight: item.weight || '',
  })) || [];

  // Local picked state (mirrors props + local toggle)
  const [localItems, setLocalItems] = useState(orderItems);

  const togglePick = (itemId: string) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, picked: !item.picked } : item))
    );
    if (onToggleItemPick && order) onToggleItemPick(order.id, itemId);
  };

  const pickedCount = localItems.filter((i) => i.picked).length;
  const isAllPicked = localItems.length > 0 && pickedCount === localItems.length;
  const progressPercent = localItems.length > 0 ? (pickedCount / localItems.length) * 100 : 0;

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
    <div className="bg-[#f9f9f9] font-sans pb-24 min-h-screen">
      {/* Top Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-30 shadow-xs">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-50 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-black text-gray-900">Order #{order?.id || '—'}</h1>
          <p className="text-[10px] text-gray-400 font-medium">{order?.orderTime || 'Just placed'}</p>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase ${statusColor(order?.status || 'NEW')}`}>
          {order?.status || 'NEW'}
        </span>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">

        {/* Customer + Order Summary */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-amber-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black text-gray-900">{order?.customerName || 'Customer'}</h3>
              <p className="text-xs text-gray-500 font-medium">{order?.customerPhone || '—'}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-gray-900">₹{order?.finalTotal}</p>
              <span className={`text-[10px] font-black ${order?.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order?.paymentStatus || 'PAID'}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-600 font-medium leading-snug">
              {order?.deliveryAddress || 'Delivery address not specified'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
            <Clock className="w-3.5 h-3.5" />
            <span>9-Minute Express Delivery SLA</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {order?.customerPhone && (
            <a
              href={`tel:${order.customerPhone}`}
              className="bg-white border border-gray-100 shadow-xs hover:bg-gray-50 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Customer</span>
            </a>
          )}
          <button className="bg-white border border-gray-100 shadow-xs hover:bg-gray-50 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition shrink-0">
            <Headphones className="w-3.5 h-3.5 text-blue-500" />
            <span>Support</span>
          </button>
          <button className="bg-white border border-gray-100 shadow-xs hover:bg-gray-50 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition shrink-0">
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            <span>Print Bill</span>
          </button>
        </div>

        {/* Packing Progress */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-900">Packing Progress</h3>
            <span className="text-xs font-black text-amber-700">
              {pickedCount}/{localItems.length} Picked
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAllPicked ? 'bg-emerald-500' : 'bg-[#ffc800]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {isAllPicked && (
            <p className="text-xs text-emerald-600 font-black text-center">✅ All items packed! Ready to dispatch.</p>
          )}
        </div>

        {/* Items Checklist */}
        <div>
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2 px-1 flex items-center gap-2">
            <Box className="w-3.5 h-3.5" />
            Items to Pack ({localItems.length})
          </h3>
          <div className="space-y-2">
            {localItems.map((item) => (
              <div
                key={item.id}
                onClick={() => togglePick(item.id)}
                className={`bg-white rounded-2xl p-3.5 border transition cursor-pointer flex items-center gap-3 shadow-xs ${
                  item.picked ? 'border-emerald-300 bg-emerald-50/30' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition shrink-0 ${
                  item.picked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white'
                }`}>
                  {item.picked && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=100&q=80';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className={`text-xs font-black leading-tight ${item.picked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {item.name}
                    </h4>
                    <span className="text-xs font-black text-gray-900 shrink-0">×{item.quantity}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.location} • ₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}

            {localItems.length === 0 && (
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 text-xs text-gray-400 font-medium">
                No items found for this order
              </div>
            )}
          </div>
        </div>

        {/* Rider Assignment */}
        {onAssignRider && riders.length > 0 && (
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-gray-900 flex items-center gap-2">
              <Bike className="w-4 h-4 text-amber-600" />
              Assign Delivery Rider
            </h3>
            {order?.assignedRider ? (
              <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
                <img
                  src={order.assignedRider.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.assignedRider.name)}&background=ffc800&color=000&bold=true`}
                  alt={order.assignedRider.name}
                  className="w-10 h-10 rounded-full border-2 border-emerald-400"
                />
                <div>
                  <p className="text-xs font-black text-emerald-900">{order.assignedRider.name}</p>
                  <p className="text-[10px] text-emerald-700 font-medium">{order.assignedRider.phone}</p>
                </div>
                <span className="ml-auto bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  Assigned
                </span>
              </div>
            ) : (
              <select
                onChange={(e) => onAssignRider(order!.id, e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 bg-gray-50 outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="">Select a delivery rider...</option>
                {riders
                  .filter((r) => r.status === 'AVAILABLE')
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — ⭐{r.rating} ({r.deliveriesToday} deliveries today)
                    </option>
                  ))}
              </select>
            )}
          </div>
        )}

        {/* Live Map */}
        <div className="pt-1">
          <LocationIQMap orderId={order?.id} customerAddress={order?.deliveryAddress} />
        </div>

        {/* Mark Ready Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (order) onMarkReady(order.id);
            }}
            disabled={!isAllPicked && localItems.length > 0}
            className={`w-full py-4 rounded-full font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              isAllPicked || localItems.length === 0
                ? 'bg-[#ffc800] hover:bg-[#ebd000] active:scale-[0.98] text-gray-900 shadow-md shadow-[#ffc800]/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>
              {isAllPicked || localItems.length === 0
                ? '✅ Mark as Ready for Pickup'
                : `Pack all ${localItems.length - pickedCount} remaining items first`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
