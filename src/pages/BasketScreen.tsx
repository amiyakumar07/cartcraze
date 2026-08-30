import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Trash2, Zap, Ticket, CreditCard, ChevronRight, Check, MapPin, BellOff, PhoneCall, ShieldCheck, DoorOpen } from 'lucide-react';
import { AddressManagerModal } from '../components/AddressManagerModal';

export const BasketScreen: React.FC = () => {
  const {
    cart,
    updateQuantity,
    getCartTotal,
    getFinalPayAmount,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    tipAmount,
    setTipAmount,
    userProfile,
    placeOrder,
    setActiveTab
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<string>('UPI (Google Pay / PhonePe)');
  const [couponError, setCouponError] = useState<string>('');
  const [deliveryInstruction, setDeliveryInstruction] = useState<string>('Doorstep Delivery');
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  const itemTotal = getCartTotal();
  const deliveryFee = itemTotal >= 199 ? 0 : 25;
  const handlingFee = 5;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPay = getFinalPayAmount();

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (!success) {
      setCouponError('Invalid coupon code. Try QUICK50 or FRESH20');
    }
  };

  const handlePlaceOrderClick = () => {
    placeOrder(paymentMethod, userProfile.address);
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center space-y-4 py-16 animate-fadeIn">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          🛒
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Your Basket is Empty</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
            Browse our fresh fruits, dairy, and grocery items to fill up your basket!
          </p>
        </div>
        <button
          onClick={() => setActiveTab('home')}
          className="bg-[#fdee24] text-black font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-xs hover:bg-yellow-400 transition-all active:scale-95 cursor-pointer"
        >
          Browse Fresh Groceries
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-28 font-sans animate-fadeIn">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">Your Basket</h2>
          <p className="text-xs text-gray-500 font-medium">Guaranteed 9 mins express delivery</p>
        </div>
        <div className="bg-[#fdee24] px-2.5 py-1 rounded-full text-black font-extrabold text-xs flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 fill-black" />
          <span>9 Mins</span>
        </div>
      </div>

      {/* Selected Delivery Location Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="p-2 bg-amber-400 text-black rounded-xl shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">DELIVERING TO</span>
            <p className="text-xs font-bold text-white truncate leading-snug">{userProfile.address}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddressModal(true)}
          className="text-xs font-bold text-yellow-300 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer"
        >
          Change
        </button>
      </div>

      {/* Cart Items List */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 divide-y divide-gray-100 space-y-2">
        {cart.map((item) => (
          <div key={item.product.id} className="pt-2 first:pt-0 flex items-center gap-3">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-14 h-14 object-contain rounded-lg bg-gray-50 p-1 flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
              <p className="text-[11px] text-gray-400">{item.product.weight}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-extrabold text-xs text-gray-900">₹{item.product.price * item.quantity}</span>
                {item.product.originalPrice > item.product.price && (
                  <span className="text-[10px] text-gray-400 line-through">
                    ₹{item.product.originalPrice * item.quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
              <button
                onClick={() => updateQuantity(item.product.id, -1)}
                className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer"
              >
                {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
              </button>
              <span className="w-6 text-center font-bold text-xs text-gray-900">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Instructions Selector */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 space-y-2">
        <span className="text-xs font-bold text-gray-900 block">Delivery Instructions</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'Doorstep Delivery', label: 'Leave at Doorstep', icon: DoorOpen },
            { id: 'Avoid Ringing Bell', label: 'Don\'t Ring Bell', icon: BellOff },
            { id: 'Call on Arrival', label: 'Call on Arrival', icon: PhoneCall },
            { id: 'Guard Security', label: 'Hand to Security', icon: ShieldCheck }
          ].map((ins) => {
            const Icon = ins.icon;
            const isSelected = deliveryInstruction === ins.id;
            return (
              <button
                key={ins.id}
                type="button"
                onClick={() => setDeliveryInstruction(ins.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-50/50 text-gray-900 font-bold shadow-2xs'
                    : 'border-gray-100 bg-gray-50/50 text-gray-600 hover:border-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-gray-400'}`} />
                <span className="text-[11px] leading-tight">{ins.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Free Delivery Bar Progress */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-xs text-emerald-900">
        {itemTotal >= 199 ? (
          <div className="flex items-center gap-2 font-bold">
            <span>🎉</span>
            <span>You unlocked FREE Express Delivery on this order!</span>
          </div>
        ) : (
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Add ₹{199 - itemTotal} more for FREE delivery</span>
              <span>₹{itemTotal}/₹199</span>
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (itemTotal / 199) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Coupon Code Section */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
          <Ticket className="w-4 h-4 text-amber-500" />
          <span>Coupons & Offers</span>
        </div>

        {appliedCoupon ? (
          <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-xl p-2.5 text-xs">
            <div>
              <span className="font-extrabold text-green-800">"{appliedCoupon.code}" Applied</span>
              <p className="text-[11px] text-green-700">Saved ₹{appliedCoupon.discount} on this order</p>
            </div>
            <button
              onClick={removeCoupon}
              className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. QUICK50)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-gray-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-black transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
            <p className="text-[10px] text-gray-400">Try <strong className="text-gray-700">QUICK50</strong> for ₹50 off or <strong className="text-gray-700">FRESH20</strong> for 20% off</p>
          </div>
        )}
      </div>

      {/* Delivery Driver Tip */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-gray-900">Delivery Partner Tip</span>
          <span className="text-[10px] text-gray-400">100% goes to driver</span>
        </div>
        <div className="flex gap-2">
          {[0, 10, 20, 30, 50].map((amt) => (
            <button
              key={amt}
              onClick={() => setTipAmount(amt)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tipAmount === amt
                  ? 'bg-[#fdee24] text-black shadow-2xs border border-yellow-400'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {amt === 0 ? 'No Tip' : `₹${amt}`}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 space-y-2">
        <span className="text-xs font-bold text-gray-900 block">Select Payment Method</span>
        <div className="space-y-1.5 text-xs">
          {[
            'UPI (Google Pay / PhonePe)',
            'Credit / Debit Card',
            `CartCraze Wallet (Bal ₹${userProfile.walletBalance})`,
            'Cash on Delivery'
          ].map((method) => (
            <label
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === method
                  ? 'border-yellow-400 bg-yellow-50/40 text-gray-900 font-bold'
                  : 'border-gray-100 hover:border-gray-200 text-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span>{method}</span>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentMethod === method ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300'
              }`}>
                {paymentMethod === method && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Bill Breakdown */}
      <div className="bg-white rounded-2xl p-3.5 border border-gray-100 space-y-2 text-xs">
        <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-2">Bill Summary</h3>
        <div className="flex justify-between text-gray-600">
          <span>Item Total</span>
          <span className="font-bold text-gray-800">₹{itemTotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Charge</span>
          {deliveryFee === 0 ? (
            <span className="font-bold text-green-600">FREE</span>
          ) : (
            <span className="font-bold text-gray-800">₹{deliveryFee}</span>
          )}
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Handling & Packaging Fee</span>
          <span className="font-bold text-gray-800">₹{handlingFee}</span>
        </div>
        {tipAmount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Delivery Driver Tip</span>
            <span className="font-bold text-gray-800">₹{tipAmount}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-bold">
            <span>Coupon Discount ({appliedCoupon?.code})</span>
            <span>-₹{discount}</span>
          </div>
        )}
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm">
          <span className="font-extrabold text-gray-900">Total Payable</span>
          <span className="font-black text-base text-gray-900">₹{finalPay}</span>
        </div>
      </div>

      {/* Address Manager Modal */}
      <AddressManagerModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />

      {/* Sticky Place Order Bottom CTA */}
      <div className="fixed bottom-14 left-0 right-0 max-w-[440px] mx-auto p-3 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30 flex justify-between items-center shadow-xl rounded-t-xl">
        <div>
          <span className="text-[10px] text-gray-400 block font-semibold">TOTAL PAYABLE</span>
          <span className="text-lg font-black text-gray-900">₹{finalPay}</span>
        </div>

        <button
          onClick={handlePlaceOrderClick}
          className="bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-sm py-3 px-8 rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-2 cursor-pointer"
        >
          <span>PLACE ORDER</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
