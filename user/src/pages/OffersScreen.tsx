import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Tag, Zap, ShieldCheck, Copy, CheckCircle, Gift, Sparkles } from 'lucide-react';

export const OffersScreen: React.FC = () => {
  const { products, appliedCoupon, applyCoupon, removeCoupon } = useApp();

  const availableCoupons = [
    {
      code: 'FLASHCRAZE',
      title: '9 PM FLASH SALE - Everything @ ₹1',
      description: 'Applicable during 9 PM - 10 PM daily. Max 5 items per user quota.',
      discountAmount: 150,
      minOrderValue: 99,
      tag: '🔥 9 PM SALE',
      expiryText: 'Expires in 4 hours'
    },
    {
      code: 'CRAZE50',
      title: 'Flat ₹50 Instant Cashback',
      description: 'Valid on orders above ₹299. Instant deduction at checkout.',
      discountAmount: 50,
      minOrderValue: 299,
      tag: 'CASHBACK',
      expiryText: 'Valid till midnight'
    },
    {
      code: 'SUPERBUY',
      title: 'Buy 2+ Items 5% OFF Extra',
      description: 'Automatic bundle savings applied on all fresh produce & essentials.',
      discountAmount: 40,
      minOrderValue: 199,
      tag: 'BUNDLE OFFER',
      expiryText: 'Always active'
    }
  ];

  const bankOffers = [
    { bank: 'HDFC Bank', code: 'HDFC10', desc: '10% Instant Discount via HDFC Credit/Debit Cards', tag: '10% OFF' },
    { bank: 'ICICI Bank', code: 'ICICI50', desc: 'Flat ₹50 Cashback via ICICI Net Banking', tag: '₹50 CASHBACK' },
    { bank: 'Paytm Wallet', code: 'PAYTM25', desc: 'Flat ₹25 Cashback via Paytm UPI/Wallet', tag: '₹25 CASHBACK' }
  ];

  const under99Products = products.filter((p) => p.price <= 99);
  const megaDeals = products.filter((p) => p.originalPrice && p.originalPrice > p.price);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code ${code} copied to clipboard!`);
  };

  return (
    <div className="bg-[#F4FBF4] min-h-screen pb-28 font-[Inter,sans-serif] animate-fadeIn">
      {/* ── Top Header Bar ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-emerald-100 shadow-2xs p-4">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold shrink-0">
            <Tag className="w-5 h-5 text-[#E29100]" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">Offers & Super Savings</h1>
            <p className="text-xs font-semibold text-slate-500">Coupons, bank cashbacks & 9 PM ₹1 flash deals</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5 max-w-md mx-auto">
        {/* ── Hero Banner Card ── */}
        <div className="rounded-2xl bg-gradient-to-r from-[#005338] via-[#007A53] to-[#10B981] p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-[-10px] top-[-10px] opacity-20 pointer-events-none">
            <Sparkles className="w-32 h-32 text-amber-300" />
          </div>
          <span className="inline-flex items-center gap-1 bg-[#E29100] text-slate-900 font-black text-[10px] uppercase px-2.5 py-1 rounded-md mb-2">
            <Zap className="w-3 h-3 fill-current" /> Quick Commerce Mega Sale
          </span>
          <h2 className="text-xl font-black leading-tight mb-1">Up to 50% OFF<br />on Daily Essentials</h2>
          <p className="text-xs text-emerald-100 font-medium">
            Lightning 10-minute delivery to your doorstep. Free delivery on orders above ₹199!
          </p>
        </div>

        {/* ── Available Coupons ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#006C49]" /> Available Coupons
            </h2>
            {appliedCoupon && (
              <span className="text-[11px] font-black bg-emerald-100 text-[#006C49] px-2.5 py-0.5 rounded-full border border-emerald-300">
                {appliedCoupon.code} Active
              </span>
            )}
          </div>

          {availableCoupons.map((c) => {
            const isApplied = appliedCoupon?.code === c.code;
            return (
              <div
                key={c.code}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-2xs ${
                  isApplied ? 'border-[#006C49] bg-emerald-50/40 ring-1 ring-[#006C49]' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#006C49] text-white font-black text-xs px-2.5 py-1 rounded-lg">
                      {c.code}
                    </span>
                    <span className="bg-amber-100 text-[#855300] font-extrabold text-[10px] px-2 py-0.5 rounded">
                      {c.tag}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (isApplied) {
                        removeCoupon();
                      } else {
                        applyCoupon({
                          code: c.code,
                          discountAmount: c.discountAmount,
                          minOrderValue: c.minOrderValue
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors ${
                      isApplied
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        : 'bg-[#006C49] text-white hover:bg-emerald-800'
                    }`}
                  >
                    {isApplied ? 'REMOVE' : 'APPLY'}
                  </button>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">{c.title}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3">{c.description}</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400 font-semibold">
                  <span>⏱️ {c.expiryText}</span>
                  <button
                    onClick={() => handleCopy(c.code)}
                    className="flex items-center gap-1 text-[#006C49] font-bold hover:underline"
                  >
                    <Copy className="w-3 h-3" /> Copy Code
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bank & Wallet Cashbacks ── */}
        <div className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#006C49]" /> Bank & Wallet Cashbacks
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {bankOffers.map((b) => (
              <div key={b.code} className="min-w-[240px] bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-[#006C49] bg-emerald-100 px-2 py-0.5 rounded">
                    {b.bank}
                  </span>
                  <span className="font-black text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    {b.tag}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug">{b.desc}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono font-bold text-slate-500">Use: {b.code}</span>
                  <button
                    onClick={() => handleCopy(b.code)}
                    className="text-xs font-black text-[#006C49] hover:underline"
                  >
                    COPY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Under ₹99 Store ── */}
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Under ₹99 Store ⚡</h2>
            <p className="text-xs font-semibold text-slate-500">Pocket-friendly daily grocery essentials</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {under99Products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* ── Steal Deals & Top Discounts ── */}
        <div className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900">Steal Deals & Top Discounts 🏷️</h2>
          <div className="grid grid-cols-2 gap-3">
            {megaDeals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
