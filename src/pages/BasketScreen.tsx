import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddressSearchModal } from '../components/AddressSearchModal';
import { AddressManagerModal } from '../components/AddressManagerModal';
import { MapPin, AlertTriangle, ShieldCheck, ArrowRight, Lock, CheckCircle2, Clock } from 'lucide-react';

export const BasketScreen: React.FC = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getFinalPayAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    tipAmount,
    setTipAmount,
    userProfile,
    setUserProfile,
    setUserCoords,
    placeOrder,
    setActiveTab,
    serviceabilityStatus,
    deliveryEta,
    products
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [selectedTip, setSelectedTip] = useState<number>(20);
  const [activeInstructions, setActiveInstructions] = useState<string[]>(['Avoid ringing bell', 'Leave at door']);
  const [couponInput, setCouponInput] = useState<string>('');
  const [orderError, setOrderError] = useState<string>('');

  const toggleInstruction = (inst: string) => {
    if (activeInstructions.includes(inst)) {
      setActiveInstructions(activeInstructions.filter((i) => i !== inst));
    } else {
      setActiveInstructions([...activeInstructions, inst]);
    }
  };

  const handleSelectTip = (amount: number) => {
    setSelectedTip(amount);
    setTipAmount(amount);
  };

  const itemsTotal = getCartTotal();
  const deliveryFee = itemsTotal >= 199 ? 0 : 25;
  const handlingFee = 5;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const toPay = getFinalPayAmount();

  const handlePlaceOrder = () => {
    if (serviceabilityStatus !== 'SERVICEABLE') {
      setOrderError('Your selected address is outside CartCraze\'s 5 km serviceable delivery radius. Please choose an address in Jaydev Vihar, Bhubaneswar to place an order.');
      return;
    }
    try {
      placeOrder(paymentMethod, userProfile.address);
    } catch (err: any) {
      setOrderError(err.message || 'Unable to place order');
    }
  };

  // Recommendations from operational catalog not yet in cart
  const cartIds = new Set(cart.map((c) => c.product.id));
  const suggestedItems = products.filter((p) => !cartIds.has(p.id) && p.inStock).slice(0, 4);

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center bg-[#faf8ff] min-h-[70vh] flex flex-col items-center justify-center font-sans animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#00676d] mb-3 shadow-inner">
          <span className="material-symbols-outlined text-[44px]">shopping_bag</span>
        </div>
        <p className="text-base font-extrabold text-[#131b2e]">Your cart is empty</p>
        <p className="text-xs text-[#6e797a] mt-1 max-w-xs">
          Add items from fresh produce or grocery shelves to start express {deliveryEta || '10-18 min'} delivery!
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="mt-4 bg-[#00676d] text-white text-xs font-extrabold px-6 py-3 rounded-full shadow-md active:scale-95 transition-transform cursor-pointer"
        >
          Explore Store Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-36 font-sans animate-fadeIn">
      {/* Serviceability Gating Alert if NOT serviceable */}
      {serviceabilityStatus !== 'SERVICEABLE' && (
        <div className="mx-4 mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black">Delivery Unavailable at This Location</h4>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
              Your address is outside CartCraze Store #01's 5 km delivery radius. Ordering is currently blocked until a serviceable address is selected.
            </p>
            <button
              onClick={() => setShowSearchModal(true)}
              className="mt-2 bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs cursor-pointer"
            >
              Change to Bhubaneswar Address
            </button>
          </div>
        </div>
      )}

      {orderError && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold">
          {orderError}
        </div>
      )}

      {/* 1. Delivery & Free Delivery Ribbon */}
      <section className="px-4 py-2.5 bg-gradient-to-r from-[#00676d]/10 via-[#6ffbbe]/25 to-[#fb7800]/15 rounded-b-2xl shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#006a48] text-white text-xs">
              <span className="material-symbols-outlined text-[13px]">celebration</span>
            </span>
            <span className="text-xs font-bold text-[#131b2e]">
              {itemsTotal >= 199 ? (
                <>You unlocked <span className="text-[#006a48] font-extrabold">FREE Delivery</span>!</>
              ) : (
                <>Add ₹{199 - itemsTotal} more for <span className="text-[#006a48] font-extrabold">FREE Delivery</span></>
              )}
            </span>
          </div>
          {itemsTotal >= 199 && (
            <span className="text-[9px] bg-[#006a48]/15 text-[#006a48] px-2 py-0.5 rounded-full font-extrabold">
              SAVED ₹25
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#dae2fd] h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#00676d] to-[#006a48] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (itemsTotal / 199) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-1.5 text-[10px] text-[#6e797a]">
          <div className="flex items-center gap-1 font-semibold text-[#00676d]">
            <Clock className="w-3 h-3 text-[#00676d]" />
            <span>Delivery ETA: <strong>{deliveryEta}</strong></span>
          </div>
          <span>Item Total: ₹{itemsTotal}</span>
        </div>
      </section>

      {/* 2. Cart Items List */}
      <section className="px-4 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-[#131b2e]">Your Basket Items</h2>
            <span className="w-5 h-5 rounded-full bg-[#00676d]/10 text-[#00676d] flex items-center justify-center text-[10px] font-extrabold">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <span className="text-xs text-[#00676d] font-bold">Store #01 Jaydev Vihar</span>
        </div>

        <div className="space-y-2.5">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-2xl p-3 shadow-2xs border border-[#eaedff] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center p-1 shrink-0 overflow-hidden border border-gray-100">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#131b2e] truncate">{product.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{product.weight}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs font-extrabold text-[#131b2e]">₹{product.price * quantity}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice * quantity}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center bg-[#131b2e] text-white rounded-xl p-0.5 shadow-xs shrink-0">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg text-xs font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-xs text-amber-300">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Operational Catalog Add-ons */}
      {suggestedItems.length > 0 && (
        <section className="px-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">You might also need</h3>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {suggestedItems.map((item) => (
              <div key={item.id} className="w-36 bg-white border border-gray-100 rounded-2xl p-2 shrink-0 flex flex-col justify-between shadow-2xs">
                <div className="h-16 w-full flex items-center justify-center mb-1">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <p className="text-[11px] font-bold text-gray-800 truncate">{item.name}</p>
                <p className="text-[9px] text-gray-400">{item.weight}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-black text-gray-900">₹{item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-[#00676d] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg hover:bg-[#00555a] transition"
                  >
                    + ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Delivery Instructions */}
      <section className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-3 shadow-2xs border border-[#eaedff]">
          <h3 className="text-xs font-bold text-[#131b2e] mb-2">Delivery Instructions</h3>
          <div className="flex flex-wrap gap-1.5">
            {['Avoid ringing bell', 'Leave at door', 'Don\'t call', 'Leave with guard'].map((inst) => {
              const selected = activeInstructions.includes(inst);
              return (
                <button
                  key={inst}
                  onClick={() => toggleInstruction(inst)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition cursor-pointer ${
                    selected ? 'bg-[#00676d] text-white border-[#00676d]' : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {inst}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Bill Details */}
      <section className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-[#eaedff]">
          <h3 className="text-xs font-bold text-[#131b2e] mb-2.5 flex items-center justify-between">
            <span>Bill Details</span>
            {discountAmount > 0 && (
              <span className="text-[9px] text-[#006a48] bg-[#006a48]/10 px-2 py-0.5 rounded-full font-extrabold">
                DISCOUNT APPLIED
              </span>
            )}
          </h3>

          <div className="flex flex-col gap-1.5 text-xs text-[#6e797a]">
            <div className="flex justify-between items-center">
              <span>Items Subtotal</span>
              <span className="text-[#131b2e] font-semibold">₹{itemsTotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span>Delivery Partner Fee</span>
                {deliveryFee === 0 && <span className="text-[10px] line-through text-gray-400">₹25</span>}
              </div>
              <span className={deliveryFee === 0 ? 'text-[#006a48] font-bold' : 'text-[#131b2e] font-semibold'}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Handling &amp; Packaging</span>
              <span className="text-[#131b2e] font-semibold">₹{handlingFee}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-[#006a48]">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span className="font-semibold">- ₹{discountAmount}</span>
              </div>
            )}
            {tipAmount > 0 && (
              <div className="flex justify-between items-center">
                <span>Delivery Partner Tip</span>
                <span className="text-[#131b2e] font-semibold">₹{tipAmount}</span>
              </div>
            )}
          </div>

          {/* Grand Total Row */}
          <div className="mt-3 pt-2 flex justify-between items-baseline bg-[#f2f3ff] p-2.5 rounded-xl">
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-[#131b2e]">To Pay</span>
              <span className="text-[9px] text-[#006a48] font-bold">Inclusive of all taxes</span>
            </div>
            <span className="text-base font-black text-[#131b2e]">₹{toPay}</span>
          </div>
        </div>
      </section>

      {/* 6. Sticky Bottom Checkout Ribbon */}
      <aside className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md shadow-[0_-6px_20px_rgba(0,0,0,0.08)] z-40 pb-safe max-w-[440px] mx-auto border-t border-[#dae2fd]/60">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0 max-w-[42%]">
            <button 
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-0.5 text-left group cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#00676d] shrink-0" />
              <span className="text-xs font-bold text-[#131b2e] truncate group-hover:text-[#00676d] transition-colors">
                {userProfile.address || 'Select Delivery Address'}
              </span>
              <span className="material-symbols-outlined text-[14px] text-[#6e797a]">expand_more</span>
            </button>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black text-[#131b2e]">₹{toPay}</span>
              <span className="text-[9px] text-[#006a48] font-bold">FINAL TOTAL</span>
            </div>
          </div>

          <button 
            disabled={serviceabilityStatus !== 'SERVICEABLE'}
            onClick={handlePlaceOrder}
            className={`flex-1 h-11 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-between px-4 cursor-pointer ${
              serviceabilityStatus === 'SERVICEABLE'
                ? 'bg-[#fb7800] hover:bg-[#994700] active:scale-[0.98]'
                : 'bg-gray-400 cursor-not-allowed opacity-80'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span className="text-xs">
                {serviceabilityStatus === 'SERVICEABLE' ? 'Proceed to Pay' : 'Store Unavailable'}
              </span>
            </div>
            {serviceabilityStatus === 'SERVICEABLE' && (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Modals */}
      <AddressSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectAddress={(addr, coords) => {
          setUserProfile((prev) => ({ ...prev, address: addr }));
          localStorage.setItem('cartcraze_user_selected_address', addr);
          if (coords) setUserCoords(coords);
        }}
      />

      <AddressManagerModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
    </div>
  );
};
