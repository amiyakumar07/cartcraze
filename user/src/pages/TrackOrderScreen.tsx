import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, MessageSquare, Clock, Zap, ShoppingBag, ArrowRight, Star, Check } from 'lucide-react';
import { LocationIQMap } from '../components/LocationIQMap';
import { DriverChatModal } from '../components/DriverChatModal';

export const TrackOrderScreen: React.FC = () => {
  const { currentOrder, setActiveTab } = useApp();
  const [showChatModal, setShowChatModal] = useState(false);

  // Delivered Rating State
  const [riderRating, setRiderRating] = useState<number>(5);
  const [riderFeedbackTag, setRiderFeedbackTag] = useState<string>('Polite & Fast');
  const [riderRated, setRiderRated] = useState<boolean>(false);

  const [productRating, setProductRating] = useState<number>(5);
  const [productReviewText, setProductReviewText] = useState<string>('');
  const [productRated, setProductRated] = useState<boolean>(false);

  // If no active order has been placed by the user, show Empty Active Orders view
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
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="p-4 space-y-4 pb-24 font-sans animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">
            {isDelivered ? 'Order Delivered' : 'Track Live Order'}
          </h2>
          <p className="text-xs text-gray-500 font-medium">Order ID: {order.id}</p>
        </div>
        <span className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 ${
          isDelivered ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'
        }`}>
          <Zap className={`w-3.5 h-3.5 ${isDelivered ? 'fill-emerald-700' : 'fill-amber-700'}`} />
          <span>{isDelivered ? 'DELIVERED' : order.status || 'ON THE WAY'}</span>
        </span>
      </div>

      {/* ─── DELIVERED STATE VIEW (NO MAP) ─────────────────────────────────── */}
      {isDelivered ? (
        <div className="space-y-4 animate-fadeIn">
          {/* Delivered Banner */}
          <div className="bg-emerald-600 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between border-2 border-emerald-400">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                🎉
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block">DELIVERY COMPLETE</span>
                <h3 className="font-extrabold text-base text-white">Order Delivered Successfully!</h3>
                <p className="text-xs text-emerald-100 font-medium">Package handed to you at your address</p>
              </div>
            </div>
          </div>

          {/* User Delivery Address & Status Card */}
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Delivery Address</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ Handed over
              </span>
            </div>
            <p className="text-xs text-gray-700 font-medium leading-relaxed">
              {order.deliveryAddress}
            </p>
          </div>

          {/* 1. RIDER RATING COMPONENT */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={order.driverPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={order.driverName || 'Rahul Kumar'}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">RATE YOUR RIDER</span>
                <h4 className="font-extrabold text-sm text-gray-900">{order.driverName || 'Rahul Kumar'}</h4>
                <p className="text-[11px] text-gray-500 font-medium">Express Delivery Partner</p>
              </div>
            </div>

            {!riderRated ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRiderRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= riderRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Quick Feedback Chips */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {['Polite & Fast', 'Followed Instructions', 'Safe Packaging', 'On Time'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setRiderFeedbackTag(tag)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full transition cursor-pointer ${
                        riderFeedbackTag === tag
                          ? 'bg-amber-400 text-black shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setRiderRated(true)}
                  className="w-full bg-[#00C985] hover:bg-emerald-600 text-black font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition cursor-pointer"
                >
                  Submit Rider Rating
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-emerald-800 font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Thank you for rating {order.driverName || 'Rahul'} ⭐{riderRating}!</span>
                </div>
                <p className="text-[10px] text-emerald-700 font-medium">Your feedback helps reward great delivery partners.</p>
              </div>
            )}
          </div>

          {/* 2. PRODUCT RATING COMPONENT */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-md space-y-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">RATE YOUR PRODUCTS</span>
              <h4 className="font-extrabold text-sm text-gray-900">How were your items?</h4>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                {order.items.map((item, idx) => (
                  <div key={item.product?.id || idx} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-800 truncate">{item.quantity}x {item.product?.name || 'Item'}</span>
                    <span className="text-emerald-700 font-extrabold text-[11px]">₹{(item.product?.price || 0) * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            {!productRated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setProductRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= productRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={productReviewText}
                  onChange={(e) => setProductReviewText(e.target.value)}
                  placeholder="Tell us about the freshness or quality of your items..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 outline-none focus:border-amber-400 focus:bg-white resize-none"
                />

                <button
                  type="button"
                  onClick={() => setProductRated(true)}
                  className="w-full bg-[#fdee24] hover:bg-yellow-400 text-black font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition cursor-pointer"
                >
                  Submit Product Review
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-emerald-800 font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Product Review Submitted ⭐{productRating}!</span>
                </div>
                <p className="text-[10px] text-emerald-700 font-medium">Thank you for helping us maintain top quality standards.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ─── ACTIVE IN-FLIGHT ORDER VIEW (SHOW MAP) ───────────────────────── */
        <>
          {/* Real Interactive Leaflet Map with Real-Time Rider Telemetry */}
          <LocationIQMap orderId={order.id} destinationAddress={order.deliveryAddress} />

          {/* Live Delivery ETA Card */}
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

          {/* DELIVERY OTP / CASH ON DELIVERY CARD */}
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

          {/* Driver Info Card */}
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

          {/* Delivery Address Card */}
          <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200/60 flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900 block">Delivery Address</span>
              <p className="text-gray-600 mt-0.5 leading-snug">{order.deliveryAddress}</p>
            </div>
          </div>
        </>
      )}

      {/* Driver Chat Modal */}
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
