import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { ArrowRight, Key } from 'lucide-react';
import lottie from 'lottie-web';
import orderConfirmAnimation from '../assets/orderConfirmAnimation.json';

const OrderSuccessLottie: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: orderConfirmAnimation,
    });

    return () => {
      anim.destroy();
    };
  }, []);

  return <div ref={containerRef} className="w-[132px] h-[132px] mx-auto mb-2 flex items-center justify-center overflow-hidden" />;
};

export const OrderConfirmedScreen: React.FC = () => {
  const { currentOrder, setActiveTab } = useApp();
  const [countdown, setCountdown] = useState(540); // 9 mins in seconds

  useEffect(() => {
    // Fire celebration confetti upon order confirmation screen launch
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#00C985', '#048F63', '#142420', '#fdee24', '#3b82f6']
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  if (!currentOrder) {
    return (
      <div className="p-6 text-center py-20 space-y-4 font-sans">
        <p className="text-gray-500 font-bold text-sm">No active order placed yet.</p>
        <button
          onClick={() => setActiveTab('home')}
          className="bg-[#00C985] text-slate-950 font-extrabold text-xs py-2.5 px-5 rounded-xl hover:bg-[#048F63] hover:text-white transition-colors cursor-pointer"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFF5F0] p-4 sm:p-6 flex flex-col items-center justify-center font-sans text-[#142420] pb-24 animate-fadeIn">
      <div className="w-full max-w-md space-y-3">
        {/* Header Eyebrow */}
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#728479] px-1">
          <span className="w-2 h-2 rounded-full bg-[#00C985] animate-pulse" />
          <span>CartCraze &nbsp;/&nbsp; Checkout</span>
        </div>

        {/* Ticket Stub Card */}
        <div className="bg-white rounded-t-2xl shadow-xl overflow-visible border border-[#DCE6DF]/60">
          {/* Hero Section */}
          <div className="pt-8 px-6 pb-4 text-center">
            <OrderSuccessLottie />
            <h1 className="font-serif text-3xl font-medium text-[#142420] tracking-tight mt-1 mb-2">
              Order confirmed
            </h1>
            <p className="text-sm text-[#728479] leading-relaxed max-w-xs mx-auto mb-4">
              Thanks for shopping with us — <b className="text-[#142420] font-semibold">FreshCart Express</b> is preparing your order now. We'll text you the moment a rider is on the way.
            </p>
          </div>

          {/* Ticket Perforation Cutout Divider */}
          <div className="relative h-0">
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#EFF5F0] border-r border-[#DCE6DF]/60" />
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#EFF5F0] border-l border-[#DCE6DF]/60" />
            <div className="absolute top-0 left-3 right-3 border-t-2 border-dashed border-[#DCE6DF]" />
          </div>

          {/* Receipt Section */}
          <div className="bg-white rounded-b-2xl p-6 pt-5 space-y-3.5">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="text-[10.5px] text-[#728479] tracking-wider uppercase">Order</span>
              <span className="font-semibold text-[#142420]">#{currentOrder.id}</span>
            </div>

            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="text-[10.5px] text-[#728479] tracking-wider uppercase">Items</span>
              <span className="font-semibold text-[#142420]">{currentOrder.items.length} products</span>
            </div>

            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="text-[10.5px] text-[#728479] tracking-wider uppercase">Delivery window</span>
              <span className="font-semibold text-[#142420]">
                Express 9-Min ({minutes}:{seconds < 10 ? `0${seconds}` : seconds})
              </span>
            </div>

            <div className="flex justify-between items-center font-mono text-xs bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/80">
              <div className="flex items-center gap-1.5 text-[#048F63] font-bold text-[10.5px]">
                <Key className="w-3.5 h-3.5" />
                <span>DELIVERY OTP</span>
              </div>
              <span className="font-mono text-base font-black tracking-widest text-[#048F63]">
                {currentOrder.otp || '4829'}
              </span>
            </div>

            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="text-[10.5px] text-[#728479] tracking-wider uppercase">Paid with</span>
              <span className="font-semibold text-[#142420]">{currentOrder.paymentMethod}</span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-[#DCE6DF] font-mono">
              <span className="text-xs font-semibold text-[#142420] uppercase">Total paid</span>
              <span className="font-serif text-xl font-semibold text-[#142420]">₹{currentOrder.finalTotal}</span>
            </div>

            {/* Actions */}
            <div className="pt-3 space-y-2.5">
              <button
                onClick={() => setActiveTab('track_order')}
                className="w-full bg-[#00C985] hover:bg-[#048F63] text-[#08201A] hover:text-white font-semibold text-sm py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Track your order</span>
              </button>

              <button
                onClick={() => setActiveTab('home')}
                className="w-full bg-transparent hover:bg-slate-100 text-[#728479] hover:text-[#142420] font-semibold text-sm py-3 px-4 rounded-xl border border-[#DCE6DF] transition-all cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#728479]">
          Need help? <a href="tel:+919800011111" className="text-[#048F63] font-semibold hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
};
