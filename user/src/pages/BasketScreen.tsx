import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Minus,
  Trash2,
  Zap,
  Ticket,
  CreditCard,
  ChevronRight,
  Check,
  MapPin,
  Phone,
  User,
  Building2,
  Home,
  Map,
  Compass,
  ShieldCheck,
  ArrowLeft,
  Navigation,
  CheckCircle2,
  Wallet,
  Lock,
  ArrowRight
} from 'lucide-react';
import { reverseGeocodeLocationIQ, reverseGeocodeDetailedLocationIQ } from '../services/locationiq';

export const BasketScreen: React.FC = () => {
  const {
    cart,
    updateQuantity,
    getCartTotal,
    getBuy2DiscountTotal,
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

  // Multi-step Checkout Pipeline: 'cart' -> 'address' -> 'payment' -> 'order_confirmed'
  const [step, setStep] = useState<'cart' | 'address' | 'payment'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<string>('Pay Online');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string>('');

  // Address Form State
  const [fullName, setFullName] = useState(userProfile.name || 'Customer Name');
  const [phone, setPhone] = useState(userProfile.phone || '+91 98765 43210');
  const [pincode, setPincode] = useState('560102');
  const [village, setVillage] = useState('HSR Layout Sector 1');
  const [street, setStreet] = useState('Flat 402, 14th Main Road');
  const [landmark, setLandmark] = useState('Opposite Government High School');
  const [lat, setLat] = useState<number>(12.9141);
  const [lon, setLon] = useState<number>(77.6411);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsSuccess, setGpsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (userProfile.name) setFullName(userProfile.name);
    if (userProfile.phone) setPhone(userProfile.phone);
  }, [userProfile]);

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

  const handleAutoDetectGPS = () => {
    setGpsLoading(true);
    setGpsSuccess(false);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const currentLat = pos.coords.latitude;
          const currentLon = pos.coords.longitude;
          setLat(currentLat);
          setLon(currentLon);

          try {
            const geocodeRes = await reverseGeocodeDetailedLocationIQ(currentLat, currentLon);
            if (geocodeRes) {
              if (geocodeRes.pincode) setPincode(geocodeRes.pincode);
              if (geocodeRes.village) setVillage(geocodeRes.village);
              if (geocodeRes.street) setStreet(geocodeRes.street);
              if (geocodeRes.landmark) setLandmark(geocodeRes.landmark);
            }
          } catch {
            setStreet(`GPS Pin (${currentLat.toFixed(4)}, ${currentLon.toFixed(4)})`);
          }

          setGpsLoading(false);
          setGpsSuccess(true);
        },
        async (err) => {
          setGpsLoading(false);
          alert(`GPS Notice: ${err.message || 'Permission Denied'}. Please enable location permissions in browser.`);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setGpsLoading(false);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !pincode.trim() || !village.trim() || !street.trim()) {
      alert('Please fill out all required address fields');
      return;
    }
    setStep('payment');
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (fullAddress: string, addressData: any) => {
    setIsProcessingPayment(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load Razorpay Payment SDK. Please check your internet connection.');
      setIsProcessingPayment(false);
      return;
    }

    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const API_URL = `http://${hostname}:4000/api`;
      const res = await fetch(`${API_URL}/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalPay, currency: 'INR' })
      });
      const data = await res.json();

      if (!data.success || !data.order) {
        alert('Could not initialize Razorpay payment. Please try again.');
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'CartCraze Express Delivery',
        description: `Order Payment for ${cart.length} items`,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            await fetch(`${API_URL}/razorpay/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
          } catch (e) {
            console.warn('Razorpay signature verification:', e);
          }
          setIsProcessingPayment(false);
          placeOrder('Razorpay (Online Payment)', fullAddress, addressData);
        },
        prefill: {
          name: fullName || 'CartCraze Customer',
          email: 'customer@cartcraze.com',
          contact: phone || '9876543210'
        },
        notes: {
          address: fullAddress,
          itemsCount: cart.length
        },
        theme: {
          color: '#00C985'
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error('Razorpay Error:', err);
      setIsProcessingPayment(false);
      placeOrder('Razorpay (Online Payment)', fullAddress, addressData);
    }
  };

  const syncCheckoutUserLocation = (addrData: any) => {
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      fetch(`http://${hostname}:4000/api/users/update-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addrData.fullName || userProfile.name,
          phone: addrData.phone || userProfile.phone,
          address: addrData.fullAddress,
          lat: addrData.lat || lat || 12.9141,
          lon: addrData.lon || lon || 77.6411,
          source: 'CHECKOUT'
        })
      }).catch(() => {});
    } catch {}
  };

  const handleFinalOrderPlacement = () => {
    const fullAddress = `${street}, ${village}, Landmark: ${landmark}, Pincode: ${pincode}`;
    const addressData = {
      fullName,
      phone,
      pincode,
      village,
      street,
      landmark,
      fullAddress,
      lat: lat || 12.9141,
      lon: lon || 77.6411
    };

    syncCheckoutUserLocation(addressData);

    if (paymentMethod === 'Razorpay') {
      handleRazorpayPayment(fullAddress, addressData);
    } else {
      placeOrder('Cash on Delivery (COD)', fullAddress, addressData);
    }
  };

  if (cart.length === 0 && step === 'cart') {
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
    <div className="p-4 space-y-4 pb-32 animate-fadeIn font-sans max-w-lg mx-auto">
      {/* CHECKOUT PROGRESS TRACKER HEADER */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md text-xs">
        <div className={`flex items-center gap-1.5 font-bold ${step === 'cart' ? 'text-amber-400' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'cart' ? 'bg-amber-400 text-black font-black' : 'bg-slate-800'}`}>1</span>
          <span>Cart Items</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <div className={`flex items-center gap-1.5 font-bold ${step === 'address' ? 'text-amber-400' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'address' ? 'bg-amber-400 text-black font-black' : 'bg-slate-800'}`}>2</span>
          <span>Delivery Address</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <div className={`flex items-center gap-1.5 font-bold ${step === 'payment' ? 'text-amber-400' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-amber-400 text-black font-black' : 'bg-slate-800'}`}>3</span>
          <span>Payment</span>
        </div>
      </div>

      {/* ─── STEP 1: CART ITEMS VIEW ────────────────────────────────────────────── */}
      {step === 'cart' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex justify-between items-center">
              <span>Basket Items ({cart.length})</span>
              <span className="text-xs font-bold text-emerald-600">⚡ 9-Min Express</span>
            </h2>

            <div className="divide-y divide-gray-100">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-contain bg-gray-50 rounded-xl p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{product.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{product.weight}</p>
                    <p className="text-xs font-black text-gray-900 mt-0.5">₹{product.price * quantity}</p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-[#0c831f] text-white rounded-xl overflow-hidden h-[30px] shadow-xs shrink-0">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-7 h-full flex items-center justify-center hover:bg-[#0a7019] transition-colors cursor-pointer"
                    >
                      {quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-white" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="w-6 text-center font-black text-xs">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-7 h-full flex items-center justify-center hover:bg-[#0a7019] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Code Card */}
          <div className="bg-white rounded-2xl p-3.5 border border-gray-100 space-y-2 text-xs">
            <h3 className="font-extrabold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Ticket className="w-4 h-4 text-amber-500" />
              <span>Apply Promo Coupon</span>
            </h3>

            {appliedCoupon ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex justify-between items-center text-emerald-800 font-bold">
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Coupon <strong>{appliedCoupon.code}</strong> Applied (-₹{appliedCoupon.discount})</span>
                </span>
                <button onClick={removeCoupon} className="text-xs text-red-500 underline cursor-pointer">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (QUICK50 / FRESH20)"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none uppercase focus:border-amber-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-slate-900 text-amber-400 font-black px-4 py-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}
            {couponError && <p className="text-[10px] font-bold text-red-500">{couponError}</p>}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-2xl p-3.5 border border-gray-100 space-y-2 text-xs">
            <h3 className="font-extrabold text-gray-900 uppercase tracking-wider text-[11px]">Bill Summary</h3>
            <div className="flex justify-between text-gray-600">
              <span>Item Subtotal</span>
              <span className="font-bold text-gray-800">₹{itemTotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              {deliveryFee === 0 ? (
                <span className="font-bold text-emerald-600">FREE</span>
              ) : (
                <span className="font-bold text-gray-800">₹{deliveryFee}</span>
              )}
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Handling &amp; Packaging</span>
              <span className="font-bold text-gray-800">₹{handlingFee}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            {getBuy2DiscountTotal() > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span className="flex items-center gap-1">🏷️ Buy 2+ Items (5% OFF)</span>
                <span>-₹{getBuy2DiscountTotal()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="font-black text-gray-900">Total Payable</span>
              <span className="font-black text-base text-gray-900">₹{finalPay}</span>
            </div>
          </div>

          {/* Sticky Step 1 CTA */}
          <div className="fixed bottom-14 left-0 right-0 max-w-[440px] mx-auto p-3 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30 flex justify-between items-center shadow-xl rounded-t-xl">
            <div>
              <span className="text-[10px] text-gray-400 block font-semibold">TOTAL PAYABLE</span>
              <span className="text-lg font-black text-gray-900">₹{finalPay}</span>
            </div>
            <button
              onClick={() => setStep('address')}
              className="bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-xs py-3 px-6 rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
            >
              <span>PROCEED TO ADDRESS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 2: DELIVERY ADDRESS PAGE ───────────────────────────────────────── */}
      {step === 'address' && (
        <div className="space-y-4">
          {/* Back to Cart Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('cart')}
              className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Basket</span>
            </button>
            <span className="text-xs text-gray-500 font-bold">Step 2 of 3: Address</span>
          </div>

          {/* Address Form Container */}
          <form onSubmit={handleProceedToPayment} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-md space-y-3.5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-2xl">
                <MapPin className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 leading-none">Enter Delivery Address</h3>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">Enter details or auto-detect via GPS</p>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Pincode & Village */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pincode *</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 560102"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold font-mono text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-amber-600" />
                  <span>Village / Area / Colony *</span>
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. HSR Layout Sector 1"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Street / Flat */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Map className="w-3.5 h-3.5 text-amber-600" />
                <span>Street / Flat / Door Number *</span>
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Flat 402, 14th Main Road"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            {/* Landmark */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>Nearby Landmark (Optional)</span>
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Government High School"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            {/* AUTO DETECT GPS BUTTON */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleAutoDetectGPS}
                disabled={gpsLoading}
                className="w-full bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer active:scale-98"
              >
                <Navigation className={`w-4 h-4 text-amber-700 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Detecting Device GPS...' : '📍 Auto-Detect & Use My Current GPS Location'}</span>
              </button>
              {gpsSuccess && (
                <p className="text-[10px] text-emerald-600 font-bold text-center mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>GPS Pin Updated ({lat.toFixed(4)}, {lon.toFixed(4)}). Check Name &amp; Phone!</span>
                </p>
              )}
            </div>

            {/* Sticky Step 2 Submit */}
            <button
              type="submit"
              className="w-full bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-xs py-4 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-98 mt-3"
            >
              <span>PROCEED TO PAYMENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ─── STEP 3: PAYMENT SELECTION PAGE ─────────────────────────────────────── */}
      {step === 'payment' && (
        <div className="space-y-4">
          {/* Back to Address Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('address')}
              className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Address</span>
            </button>
            <span className="text-xs text-gray-500 font-bold">Step 3 of 3: Payment</span>
          </div>

          {/* Delivery Address Review Banner */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex justify-between items-center text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-amber-900 font-black uppercase tracking-wider block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" /> Deliver To
              </span>
              <p className="font-bold text-gray-900">{fullName} • {phone}</p>
              <p className="text-gray-600 font-medium text-[11px]">{street}, {village}, Pincode: {pincode}</p>
            </div>
            <button
              onClick={() => setStep('address')}
              className="text-amber-800 font-extrabold text-[11px] underline shrink-0 cursor-pointer"
            >
              Edit
            </button>
          </div>

          {/* Payment Method Selector Container */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-md space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 leading-none">Select Payment Method</h3>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">Encrypted &amp; Secure 256-bit Checkout</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'Pay Online',
                  name: 'Pay Online (UPI, Cards, NetBanking, Wallets)',
                  sub: '⚡ Instant 1-Click Pay • Safe & Secure via Razorpay Gateway',
                  icon: ShieldCheck
                },
                {
                  id: 'Cash on Delivery',
                  name: 'Cash on Delivery (COD)',
                  sub: '💵 Pay Cash to Delivery Partner at Doorstep',
                  icon: Wallet
                }
              ].map((pm) => {
                const IconComponent = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/60 shadow-xs'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-amber-400 text-black' : 'bg-gray-100 text-gray-600'}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{pm.name}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">{pm.sub}</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-amber-500 bg-amber-500 text-black' : 'border-gray-300'}`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bill Total Recap */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-amber-400 font-bold block uppercase">Total Order Amount</span>
                <span className="font-extrabold text-white text-sm">₹{finalPay}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Payment Mode</span>
                <span className="font-bold text-amber-300">{paymentMethod.split(' ')[0]}</span>
              </div>
            </div>

            {/* FINAL PLACE ORDER BUTTON */}
            <button
              onClick={handleFinalOrderPlacement}
              disabled={isProcessingPayment}
              className="w-full bg-[#fdee24] hover:bg-yellow-400 text-slate-950 font-black text-sm py-4 rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              <span>
                {isProcessingPayment
                  ? 'INITIALIZING RAZORPAY SECURE GATEWAY...'
                  : `PAY ₹${finalPay} & CONFIRM ORDER NOW`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
