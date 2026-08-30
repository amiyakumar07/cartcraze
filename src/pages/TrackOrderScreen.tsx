import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, MessageSquare, Clock, Zap, ShoppingBag, ArrowRight } from 'lucide-react';
import { LocationIQMap } from '../components/LocationIQMap';
import { DriverChatModal } from '../components/DriverChatModal';

export const TrackOrderScreen: React.FC = () => {
  const { currentOrder, setActiveTab } = useApp();
  const [showChatModal, setShowChatModal] = useState(false);

  if (!currentOrder) {
    return (
      <div className="p-6 text-center space-y-5 py-16 font-sans animate-fadeIn">
        <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner border border-amber-200">
          🛵
        </div>

        <div className="space-y-1 max-w-xs mx-auto">
          <h2 className="text-base font-extrabold text-gray-900">No Active Deliveries Right Now</h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            When you place an order from your basket, real-time 9-minute live rider telemetry and GPS map will appear here!
          </p>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="bg-[#fdee24] hover:bg-yellow-400 text-black font-extrabold text-xs py-3 px-6 rounded-2xl shadow-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 mx-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Fresh Store</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const order = currentOrder;

  return (
    <div className="p-4 space-y-4 pb-24 font-sans animate-fadeIn">
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">Track Live Order</h2>
          <p className="text-xs text-gray-500 font-medium">Order ID: {order.id}</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 fill-emerald-700" />
          <span>{order.status || 'ON THE WAY'}</span>
        </span>
      </div>

      <LocationIQMap orderId={order.id} destinationAddress={order.deliveryAddress} />

      <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex justify-between items-center shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-400/20 text-yellow-300 rounded-xl">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">ESTIMATED ARRIVAL</span>
            <span className="font-black text-sm text-white">Approx 4 Minutes (1.2 km away)</span>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
          ● On Schedule
        </span>
      </div>

      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-4 rounded-3xl text-white shadow-xl flex items-center justify-between border border-amber-400">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase text-amber-200 block">
            {order.paymentMethod === 'Cash on Delivery' ? '💵 Cash Payment' : '🔑 Delivery Verification OTP'}
          </span>
          <span className="text-xs font-bold text-white block mt-0.5">
            {order.paymentMethod === 'Cash on Delivery'
              ? `Collect ₹${order.finalTotal || 319} Cash on Hand`
              : 'Share 4-digit code with delivery partner'}
          </span>
        </div>
        {order.paymentMethod !== 'Cash on Delivery' ? (
          <div className="bg-white text-slate-950 px-4 py-2 rounded-2xl font-mono text-xl font-black tracking-widest shadow-inner border border-amber-300">
            {order.otp || '4829'}
          </div>
        ) : (
          <div className="bg-white text-slate-950 px-3.5 py-1.5 rounded-2xl font-sans text-xs font-extrabold shadow-inner border border-amber-300">
            ₹{order.finalTotal || 319} COD
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src={order.driverPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={order.driverName || 'Rahul Kumar'}
            className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
          />
          <div>
            <h4 className="font-extrabold text-sm text-gray-900">{order.driverName || 'Rahul Kumar'}</h4>
            <p className="text-xs text-gray-500">EV Scooter • TVS iQube</p>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-600 font-bold">
              <span>⭐ {order.driverRating || 4.9}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-normal">1,420 deliveries</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${order.driverPhone || '+91 98123 45678'}`}
            className="p-3 bg-emerald-50 rounded-xl text-emerald-600 hover:bg-emerald-100 transition-colors"
            title="Call Driver"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => setShowChatModal(true)}
            className="p-3 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
            title="Chat with Driver"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
        <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">Live Order Status</h3>
        
        <div className="space-y-4 relative pl-4 border-l-2 border-amber-300 ml-2">
          <div className="relative">
            <div className="absolute -left-[23px] top-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
            <p className="font-bold text-xs text-gray-900">Order Placed & Confirmed</p>
            <p className="text-[11px] text-gray-400">Received at Darkstore</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[23px] top-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
            <p className="font-bold text-xs text-gray-900">Packed with Care</p>
            <p className="text-[11px] text-gray-400">Quality checked & sealed bag</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[23px] top-0.5 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-md animate-ping" />
            <p className="font-extrabold text-xs text-amber-700">Rider on the way to your location</p>
            <p className="text-[11px] text-gray-500 font-medium">Out for delivery via main road</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[23px] top-0.5 w-4 h-4 bg-gray-200 rounded-full border-2 border-white" />
            <p className="font-bold text-xs text-gray-400">Handed to You</p>
            <p className="text-[11px] text-gray-400">Est. 4 mins</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200/60 flex items-start gap-2.5 text-xs">
        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-gray-900 block">Delivery Address</span>
          <p className="text-gray-600 mt-0.5 leading-snug">{order.deliveryAddress}</p>
        </div>
      </div>

      <DriverChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        driverName={order.driverName}
        driverPhone={order.driverPhone}
        driverPhoto={order.driverPhoto}
      />
    </div>
  );
};
