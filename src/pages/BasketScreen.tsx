import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddressManagerModal } from '../components/AddressManagerModal';

export const BasketScreen: React.FC = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
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
    setActiveTab,
    clearCart
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<string>('UPI (Google Pay / PhonePe)');
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [selectedTip, setSelectedTip] = useState<number>(30);
  const [activeInstructions, setActiveInstructions] = useState<string[]>(['Avoid ringing bell', 'Leave at door']);

  const pantryItems = [
    {
      id: 'p1',
      name: 'Fresh Mint Leaves',
      unit: '100 g',
      price: 10,
      discount: '₹10 OFF',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKVmA9rPONTXfYOrIVha7nc6EZfbn72VUuDpdEVMy0QrCF8IMpCFMvQqgaIJ_YyAdHBMF7afeXAx-J53UqJPtQKqcMU8gFP6iRqAL3jTcj2TgnKGwZptXGDIbBUxEho15qp157ys7XsRsOOqOkkfo3l8oRFyn-kgR4dtjCeSMvYh5RIawBALFgSoO2RSQc6hSh6sM6WshCPkxbGAZ2KLiPWy7Zx_9Qh3BWWMlQutBT-RYlgovw9UQr7w'
    },
    {
      id: 'p2',
      name: 'Coca-Cola Classic',
      unit: '300 ml can',
      price: 40,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu8ueGFSK7d1nLfQJS5s6bslmcmSbhO9jURYW2OKcd-wHknmEcytgA02Jy3ja6dMdODoOkTHuPZeE-Ecc_MXK8snmmAKYA_e-k2sLjhZlUM5Ugb105DPMbdo2233e6MYYfusbTMoHLw5NlUh0Q0eJtm2oWCsQJvAVkiuCCTl5h6CPVonODKscidrvNSxbVlj_HIrbTqTwdhkYmm2tyjBjg-xh0b4LVh_yPoj-rp_YIw2SsI4EnY2mzDg'
    },
    {
      id: 'p3',
      name: 'Paper Boat Coconut',
      unit: '250 ml pack',
      price: 45,
      tag: 'NATURAL',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAngKFMA7spTjcjPIatv6fPebFslXeecCEZcMskEJn86D9tQ4l4ixW_uYvvPZDj3Ab0yhlnpH9M5zZdzx5E65dFnM6wYBsziXkvCYB_-4uzB3yLKwBnufYXNh3t9uhcFedNf59zB_w09KikyyWFuLrQuAoCHqecsyj0_9NrsINwsXX2DvGkGtUVBCS8E5OlhM-eSp_PJ3EuDy6t3vtMzFG11tGPA1JRSrUZkiXZnxPPjLAyfmF9hmJBwg'
    }
  ];

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
  const productDiscount = Math.round(itemsTotal * 0.25);
  const deliveryFee = 0; // Unlocked Free
  const handlingFee = 6;
  const couponDiscount = 100;
  const taxes = 12.5;
  const toPay = Math.max(0, itemsTotal - productDiscount + handlingFee - couponDiscount + selectedTip + taxes);

  const handlePlaceOrder = () => {
    placeOrder(paymentMethod, userProfile.address);
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center bg-[#faf8ff] min-h-[70vh] flex flex-col items-center justify-center font-sans animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#00676d] mb-3 shadow-inner">
          <span className="material-symbols-outlined text-[44px]">shopping_bag</span>
        </div>
        <p className="text-base font-extrabold text-[#131b2e]">Your cart is empty</p>
        <p className="text-xs text-[#6e797a] mt-1 max-w-xs">
          Add items from fresh produce or grocery shelves to start instant 12-min delivery!
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="mt-4 bg-[#00676d] text-white text-xs font-extrabold px-6 py-3 rounded-full shadow-md active:scale-95 transition-transform"
        >
          Explore Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-36 font-sans animate-fadeIn">
      {/* 1. Gamified Free Delivery Ribbon */}
      <section className="px-4 py-2.5 bg-gradient-to-r from-[#00676d]/10 via-[#6ffbbe]/25 to-[#fb7800]/15 rounded-b-2xl shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#006a48] text-white text-xs">
              <span className="material-symbols-outlined text-[13px]">celebration</span>
            </span>
            <span className="text-xs font-bold text-[#131b2e]">
              You unlocked <span className="text-[#006a48] font-extrabold">FREE Delivery</span>!
            </span>
          </div>
          <span className="text-[9px] bg-[#006a48]/15 text-[#006a48] px-2 py-0.5 rounded-full font-extrabold">
            SAVED ₹35
          </span>
        </div>

        {/* Full Progress Bar */}
        <div className="w-full bg-[#dae2fd] h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#00676d] to-[#006a48] h-full rounded-full w-full transition-all duration-500"></div>
        </div>

        <div className="flex items-center justify-between mt-1.5 text-[10px] text-[#6e797a]">
          <div className="flex items-center gap-1 font-semibold text-[#00676d]">
            <span className="material-symbols-outlined text-[13px]">bolt</span>
            <span>Delivering in <strong>11 mins</strong></span>
          </div>
          <span>Order value: ₹{itemsTotal}</span>
        </div>
      </section>

      {/* 2. Cart Items List */}
      <section className="px-4 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-[#131b2e]">Cart Items</h2>
            <span className="w-4 h-4 rounded-full bg-[#00676d]/10 text-[#00676d] flex items-center justify-center text-[9px] font-extrabold">
              {cart.length}
            </span>
          </div>
          <button 
            onClick={clearCart}
            className="text-[11px] text-[#ba1a1a] font-semibold hover:opacity-80 transition-opacity flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[13px]">delete_sweep</span>
            <span>Empty Cart</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {cart.map(({ product, quantity }) => (
            <article 
              key={product.id}
              className="bg-white rounded-2xl p-2.5 shadow-2xs flex items-center justify-between gap-2.5 border border-[#eaedff]"
            >
              <div className="relative w-14 h-14 rounded-xl bg-[#f2f3ff] overflow-hidden shrink-0 flex items-center justify-center">
                <img className="w-full h-full object-contain p-1" alt={product.name} src={product.image} />
                <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#006a48] ring-2 ring-white"></span>
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-xs font-bold text-[#131b2e] truncate">{product.name}</h3>
                <span className="text-[10px] text-[#6e797a]">{product.unit || '1 unit'}</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs font-extrabold text-[#131b2e]">₹{product.price * quantity}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-[9px] text-[#6e797a] line-through">₹{product.originalPrice * quantity}</span>
                  )}
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center bg-[#00676d] text-white rounded-full px-1 py-0.5 shadow-xs shrink-0">
                <button 
                  onClick={() => removeFromCart(product.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95 transition-transform text-xs font-bold"
                >
                  -
                </button>
                <span className="w-4 text-center text-xs font-bold text-white">
                  {quantity}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95 transition-transform text-xs font-bold"
                >
                  +
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Before you checkout Shelf */}
      <section className="mt-3.5">
        <div className="px-4 flex items-center justify-between mb-1.5">
          <div>
            <h3 className="text-xs font-bold text-[#131b2e]">Before you checkout</h3>
            <p className="text-[10px] text-[#6e797a]">Customers usually add these pantry essentials</p>
          </div>
          <span className="text-[9px] bg-[#fb7800]/15 text-[#fb7800] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
            Quick Add
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto px-4 py-1 scrollbar-none">
          {pantryItems.map((p) => (
            <div key={p.id} className="shrink-0 w-32 bg-white rounded-2xl p-2 shadow-2xs flex flex-col justify-between border border-[#eaedff]">
              <div className="w-full h-20 rounded-xl bg-[#f2f3ff] flex items-center justify-center relative overflow-hidden mb-1.5">
                <img className="w-full h-full object-cover" alt={p.name} src={p.img} />
                {p.discount && (
                  <span className="absolute top-1 left-1 text-[8px] font-extrabold bg-[#00676d] text-white px-1 py-0.2 rounded">
                    {p.discount}
                  </span>
                )}
                {p.tag && (
                  <span className="absolute top-1 left-1 text-[8px] font-extrabold bg-[#006a48] text-white px-1 py-0.2 rounded">
                    {p.tag}
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#131b2e] truncate">{p.name}</h4>
                <span className="text-[9px] text-[#6e797a]">{p.unit}</span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-extrabold text-[#131b2e]">₹{p.price}</span>
                <button 
                  onClick={() => addToCart({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    originalPrice: p.price,
                    image: p.img,
                    unit: p.unit,
                    category: 'staples',
                    subCategory: 'pantry',
                    inStock: true,
                    stockCount: 50,
                    description: p.name,
                    rating: 4.8,
                    reviewCount: 40,
                    discountPercentage: 0
                  })}
                  className="bg-[#f2f3ff] hover:bg-[#00676d] hover:text-white text-[#00676d] text-[10px] font-extrabold px-2.5 py-1 rounded-full transition-colors active:scale-95 shadow-2xs"
                >
                  + ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Coupons & Super Savings Module */}
      <section className="px-4 mt-3">
        <div className="bg-gradient-to-br from-white via-[#f2f3ff] to-[#6ffbbe]/15 rounded-2xl p-3 shadow-2xs border border-[#eaedff]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#006a48]/15 text-[#006a48] flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-extrabold text-[#131b2e] tracking-wider">CRAZE100</span>
                  <span className="text-[8px] font-extrabold bg-[#006a48] text-white px-1.5 py-0.2 rounded">APPLIED</span>
                </div>
                <p className="text-[10px] text-[#006a48] font-bold">You saved ₹100 with this coupon</p>
              </div>
            </div>
            <button className="text-[11px] font-bold text-[#00676d] hover:opacity-80">
              Change
            </button>
          </div>
          <div className="mt-2 pt-1.5 flex items-center justify-between text-[10px] text-[#6e797a] border-t border-[#dae2fd]/50">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#fb7800]">local_offer</span>
              <span>5 more coupons available for you</span>
            </span>
            <button className="text-[#00676d] font-bold flex items-center">
              View All <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Delivery Instructions */}
      <section className="px-4 mt-3">
        <h3 className="text-xs font-bold text-[#131b2e] mb-1.5">Delivery Instructions</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Avoid ringing bell', icon: 'notifications_off' },
            { label: 'Leave at door', icon: 'door_front' },
            { label: 'Call before drop', icon: 'phone_in_talk' },
            { label: 'Hand to Guard', icon: 'security' }
          ].map((chip) => {
            const isSelected = activeInstructions.includes(chip.label);
            return (
              <button
                key={chip.label}
                onClick={() => toggleInstruction(chip.label)}
                className={`flex items-center gap-1.5 p-2 rounded-xl text-left shadow-2xs transition-colors ${
                  isSelected 
                    ? 'bg-[#00676d] text-white' 
                    : 'bg-white text-[#131b2e] hover:bg-[#f2f3ff] border border-[#eaedff]'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-white' : 'text-[#6e797a]'}`}>
                  {chip.icon}
                </span>
                <span className="text-[11px] font-semibold leading-tight">{chip.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. Tip Your Delivery Partner */}
      <section className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-3 shadow-2xs border border-[#eaedff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-full bg-[#fb7800]/20 text-[#fb7800] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#131b2e]">Tip your delivery hero</h4>
              <p className="text-[10px] text-[#6e797a]">100% of your tip goes to the rider</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[20, 30, 50, 0].map((amt) => {
              const isSelected = selectedTip === amt;
              return (
                <button
                  key={amt}
                  onClick={() => handleSelectTip(amt)}
                  className={`flex-1 py-1.5 rounded-xl text-center transition-colors text-xs font-bold ${
                    isSelected 
                      ? 'bg-[#00676d] text-white shadow-xs' 
                      : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                  }`}
                >
                  {amt > 0 ? `₹${amt}` : 'Custom'}
                  {amt === 30 && (
                    <span className="text-[8px] block leading-none font-normal opacity-90 mt-0.5">Most chosen</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Detailed Bill Breakdown */}
      <section className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-[#eaedff]">
          <h3 className="text-xs font-bold text-[#131b2e] mb-2.5 flex items-center justify-between">
            <span>Bill Details</span>
            <span className="text-[9px] text-[#006a48] bg-[#006a48]/10 px-2 py-0.5 rounded-full font-extrabold">
              TOTAL SAVINGS ₹{productDiscount + couponDiscount + 35}
            </span>
          </h3>

          <div className="flex flex-col gap-1.5 text-xs text-[#6e797a]">
            <div className="flex justify-between items-center">
              <span>Items Total</span>
              <span className="text-[#131b2e] font-semibold">₹{itemsTotal}.00</span>
            </div>
            <div className="flex justify-between items-center text-[#006a48]">
              <span className="flex items-center gap-1">
                <span>Product Discount</span>
                <span className="material-symbols-outlined text-[13px]">info</span>
              </span>
              <span className="font-semibold">- ₹{productDiscount}.00</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span>Delivery Partner Fee</span>
                <span className="text-[10px] line-through text-[#6e797a]">₹35.00</span>
              </div>
              <span className="text-[#006a48] font-bold uppercase text-[10px]">FREE</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Handling &amp; Packaging</span>
              <span className="text-[#131b2e] font-semibold">₹{handlingFee}.00</span>
            </div>
            <div className="flex justify-between items-center text-[#006a48]">
              <span className="flex items-center gap-1">
                <span>Coupon Discount (CRAZE100)</span>
                <span className="material-symbols-outlined text-[13px]">redeem</span>
              </span>
              <span className="font-semibold">- ₹{couponDiscount}.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Delivery Partner Tip</span>
              <span className="text-[#131b2e] font-semibold">₹{selectedTip}.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Taxes &amp; Govt. Charges</span>
              <span className="text-[#131b2e] font-semibold">₹{taxes.toFixed(2)}</span>
            </div>
          </div>

          {/* Grand Total Row */}
          <div className="mt-3 pt-2 flex justify-between items-baseline bg-[#f2f3ff] p-2 rounded-xl">
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-[#131b2e]">To Pay</span>
              <span className="text-[9px] text-[#006a48] font-bold">Inclusive of all taxes</span>
            </div>
            <span className="text-base font-black text-[#131b2e]">₹{toPay.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* 8. Cancellation Guarantee */}
      <section className="px-4 mt-3">
        <div className="bg-[#f2f3ff] rounded-2xl p-2.5 flex items-start gap-2 text-[#6e797a] text-xs">
          <span className="material-symbols-outlined text-[20px] text-[#00676d] shrink-0 mt-0.5">verified_user</span>
          <div className="flex flex-col">
            <h5 className="text-[11px] font-bold text-[#131b2e]">Instant Replacement &amp; Easy Cancellation</h5>
            <p className="text-[10px] text-[#6e797a] mt-0.5 leading-relaxed">
              Quality issue? We process 100% instant refund straight to your UPI without question.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Sticky Bottom Checkout Ribbon */}
      <aside className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md shadow-[0_-6px_20px_rgba(0,0,0,0.08)] z-40 pb-safe max-w-[440px] mx-auto border-t border-[#dae2fd]/60">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0 max-w-[42%]">
            <button 
              onClick={() => setShowAddressModal(true)}
              className="flex items-center gap-0.5 text-left group"
            >
              <span className="material-symbols-outlined text-[16px] text-[#00676d]">location_on</span>
              <span className="text-xs font-bold text-[#131b2e] truncate group-hover:text-[#00676d] transition-colors">
                {userProfile.address ? userProfile.address.slice(0, 16) + '...' : 'B-402, Green Glen...'}
              </span>
              <span className="material-symbols-outlined text-[14px] text-[#6e797a]">expand_more</span>
            </button>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black text-[#131b2e]">₹{toPay.toFixed(2)}</span>
              <span className="text-[9px] text-[#006a48] font-bold">VIEW BILL</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            className="flex-1 h-11 bg-[#fb7800] hover:bg-[#994700] text-white font-extrabold rounded-2xl shadow-md active:scale-[0.98] transition-all flex items-center justify-between px-4"
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span className="text-xs">Proceed to Pay</span>
            </div>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </aside>

      {/* Address Manager Modal */}
      <AddressManagerModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
    </div>
  );
};
