import React from 'react';
import type { StoreOrder, OrderStatus, Rider } from '../types';
import { CheckCircle2, User, Check, Bike, Zap, Phone } from 'lucide-react';
import { ReadyForPickup } from '../components/ReadyForPickup';

interface OrdersViewProps {
  orders: StoreOrder[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onToggleItemPick: (orderId: string, itemId: string) => void;
  onAssignRider: (orderId: string, riderId: string) => void;
  riders: Rider[];
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onToggleItemPick,
  onAssignRider,
  riders
}) => {
  const sampleOrders: StoreOrder[] = [
    {
      id: 'QM-849201',
      orderTime: new Date(Date.now() - 4 * 60000).toISOString(),
      customerName: 'Ananya Sharma',
      deliveryAddress: 'Flat 402, Green Glen Layout, Sector 1, HSR Layout, Bengaluru',
      finalTotal: 349,
      status: 'PACKING',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      items: [
        { id: 'i1', name: 'Fresh Organic Milk (1L)', quantity: 2, price: 68 },
        { id: 'i2', name: 'Farm Fresh Eggs (12 Pack)', quantity: 1, price: 115 },
        { id: 'i3', name: 'Whole Wheat Bread (400g)', quantity: 1, price: 45 },
        { id: 'i4', name: 'Alphonso Mangoes (1kg)', quantity: 1, price: 120 }
      ]
    }
  ];

  const activeList = orders.length > 0 ? orders : sampleOrders;
  const newOrders = activeList.filter((o) => o.status === 'NEW' || o.status === 'PLACED');
  const packingOrders = activeList.filter((o) => o.status === 'PACKING' || o.status === 'NEW' || o.status === 'PLACED');
  const dispatchedOrders = activeList.filter((o) => o.status === 'DISPATCHED' || o.status === 'READY');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Store Stats KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase block">New Incoming</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">{newOrders.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">Requires instant acceptance</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase block">Packing In Progress</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{packingOrders.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">Avg SLA: 1.8 mins</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase block">Out For Delivery</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{dispatchedOrders.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">Riders en route</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase block">Total Delivered Today</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">48 Orders</span>
          <span className="text-[11px] text-emerald-600 font-bold">100% 9-min SLA Met</span>
        </div>
      </div>

      {/* Live Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUMN 1: NEW ORDERS */}
        <div className="bg-slate-100 rounded-3xl p-4 border border-slate-200 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-full animate-ping" />
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                1. New Orders ({newOrders.length})
              </h3>
            </div>
            <span className="bg-amber-100 text-amber-900 font-black text-[11px] px-2 py-0.5 rounded-full">Action Needed</span>
          </div>

          <div className="space-y-4">
            {newOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-4 border border-amber-300 shadow-md space-y-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-amber-400 text-black font-black text-[11px] px-2.5 py-0.5 rounded-md uppercase">
                      {order.id}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1 font-medium">{order.orderTime}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-base text-slate-900">₹{order.finalTotal}</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">{order.paymentStatus}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{order.customerName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">{order.deliveryAddress}</p>
                </div>

                {/* Items preview list */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700 block text-[11px]">Items to Pack ({order.items.length}):</span>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-slate-600">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-semibold text-slate-800">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onUpdateOrderStatus(order.id, 'PACKING')}
                  className="w-full bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                >
                  <Zap className="w-4 h-4 text-black fill-black" />
                  <span>ACCEPT &amp; START PACKING</span>
                </button>
              </div>
            ))}

            {newOrders.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                No new pending orders
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: PACKING IN PROGRESS */}
        <div className="bg-slate-100 rounded-3xl p-4 border border-slate-200 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full" />
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                2. Packing Queue ({packingOrders.length})
              </h3>
            </div>
            <span className="bg-blue-100 text-blue-900 font-bold text-[11px] px-2 py-0.5 rounded-full">Picker Active</span>
          </div>

          <div className="space-y-4">
            {packingOrders.map((order) => (
              <ReadyForPickup
                key={order.id}
                orderId={order.id}
                customerName={order.customerName}
                deliveryAddress={order.deliveryAddress}
                placedAt={order.orderTime}
                items={order.items.map((i) => ({ id: i.id, name: i.name, qty: i.quantity }))}
                onMarkReady={async () => {
                  onUpdateOrderStatus(order.id, 'DISPATCHED');
                }}
              />
            ))}

            {packingOrders.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                No orders currently being packed
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: DISPATCHED / EN ROUTE */}
        <div className="bg-slate-100 rounded-3xl p-4 border border-slate-200 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full" />
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                3. Out For Delivery ({dispatchedOrders.length})
              </h3>
            </div>
            <span className="bg-emerald-100 text-emerald-900 font-bold text-[11px] px-2 py-0.5 rounded-full">On the Way</span>
          </div>

          <div className="space-y-4">
            {dispatchedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-md space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-black text-xs text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {order.id}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1 font-medium">Dispatched</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900">₹{order.finalTotal}</span>
                  </div>
                </div>

                {/* Rider Card */}
                {order.assignedRider && (
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={order.assignedRider.photo}
                        alt={order.assignedRider.name}
                        className="w-8 h-8 rounded-full object-cover border border-emerald-400"
                      />
                      <div>
                        <span className="font-extrabold text-emerald-950 block">{order.assignedRider.name}</span>
                        <span className="text-[10px] text-emerald-700 font-medium">Riding EV Scooter</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${order.assignedRider.phone}`}
                      className="p-1.5 bg-white rounded-full text-emerald-700 hover:bg-emerald-100"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <button
                  onClick={() => onUpdateOrderStatus(order.id, 'DELIVERED')}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black text-xs py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>MARK DELIVERED</span>
                </button>
              </div>
            ))}

            {dispatchedOrders.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                No orders en route right now
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
