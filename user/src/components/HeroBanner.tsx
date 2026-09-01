import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getFlashSaleStatus } from '../utils/flashSale';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  category: string;
  bgGradient: string;
  accentColor: string;
  image: string;
  tag: string;
}

const SLIDES: Slide[] = [
  {
    id: 0,
    badge: '🍎 FRESH FRUITS',
    title: '50% OFF\non Organic Fruits',
    subtitle: 'Handpicked from farms • Delivered in 9 mins',
    buttonText: 'Shop Now',
    category: 'fruits',
    bgGradient: 'linear-gradient(135deg, #1a4731 0%, #166534 60%, #15803d 100%)',
    accentColor: '#4ade80',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=85',
    tag: 'LIMITED OFFER'
  },
  {
    id: 1,
    badge: '🥛 DAILY DAIRY',
    title: 'Fresh A2 Milk\nEvery Morning',
    subtitle: 'Pure Gir Cow milk • Organic certified',
    buttonText: 'Order Dairy',
    category: 'dairy',
    bgGradient: 'linear-gradient(135deg, #78350f 0%, #92400e 60%, #b45309 100%)',
    accentColor: '#fcd34d',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=85',
    tag: 'SUPER SAVINGS'
  },
  {
    id: 2,
    badge: '🥐 FRESH BAKERY',
    title: 'Zero Maida\nBaked Daily',
    subtitle: 'Sourdough loaves & croissants • Artisan quality',
    buttonText: 'Explore Bakery',
    category: 'bakery',
    bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 60%, #c2410c 100%)',
    accentColor: '#fb923c',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=85',
    tag: 'BACK IN STOCK'
  }
];

export const FlashSaleBannerCard: React.FC = () => {
  const [flashStatus, setFlashStatus] = useState(getFlashSaleStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashStatus(getFlashSaleStatus());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { isActiveNow, itemsRemainingThisMonth, isQuotaExhausted, timeRemainingStr, nextResetDateStr } = flashStatus;

  if (isQuotaExhausted) {
    return (
      <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border border-purple-500/50 text-white rounded-3xl p-4.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs mb-3 font-sans relative overflow-hidden group">
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
            🎉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-500/30 text-purple-300 border border-purple-400/40 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                MONTHLY ₹1 OFFER COMPLETE
              </span>
            </div>
            <h3 className="text-sm font-black text-amber-300 mt-1">5 / 5 Items Purchased at ₹1 Each!</h3>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">
              Your ₹1 offer quota resets on <strong className="text-emerald-400">{nextResetDateStr}</strong>.
            </p>
          </div>
        </div>

        <div className="z-10 bg-purple-900/40 backdrop-blur-md border border-purple-500/30 px-3 py-1.5 rounded-2xl font-mono text-[10px] text-purple-200">
          Quota: <strong className="text-amber-400">0 / 5 Left</strong>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-3xl p-4.5 shadow-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-sans relative overflow-hidden transition-all duration-300 mb-3 group ${
        isActiveNow
          ? 'bg-gradient-to-r from-red-950 via-slate-950 to-amber-950 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
          : 'bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 border border-amber-500/30'
      }`}
    >
      {/* Animated Background Light Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Shimmer Light Sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      {/* Main Content */}
      <div className="flex items-center gap-3.5 z-10 min-w-[260px] flex-1">
        {/* Animated Flame Icon Container */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl shrink-0 transition-transform duration-300 group-hover:scale-105 ${
            isActiveNow
              ? 'bg-gradient-to-tr from-red-500 to-amber-400 text-slate-950 ring-4 ring-amber-400/30 shadow-red-900/50 animate-bounce'
              : 'bg-gradient-to-tr from-amber-500/20 to-amber-400/10 text-amber-400 border border-amber-500/40 shadow-inner'
          }`}
        >
          🔥
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm ${
                isActiveNow
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white animate-pulse'
                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActiveNow ? 'bg-white animate-ping' : 'bg-amber-400'}`} />
              <span>{isActiveNow ? 'LIVE NOW • 9 PM - 10 PM' : 'DAILY 9 PM - 10 PM FLASH SALE'}</span>
            </span>

            {isActiveNow && (
              <span className="bg-red-950/80 text-red-300 border border-red-500/40 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                ⏱️ ENDS IN {timeRemainingStr}
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-black tracking-tight text-white drop-shadow-md">
            EVERYTHING @ <span className="text-amber-400 underline decoration-amber-400/60 decoration-wavy">₹1 EACH!</span>
            <span className="text-xs text-slate-300 font-bold ml-1.5">(LIMIT: 5 ITEMS/USER)</span>
          </h3>

          <p className="text-[11px] text-slate-300 font-medium leading-normal">
            {isActiveNow
              ? `⚡ Flash Sale active! Add up to 5 items to cart at ₹1 each.`
              : `⏰ Set your alarm for 9:00 PM tonight! All products ₹1 each (max 5 items/user).`}
          </p>
        </div>
      </div>

      {/* Interactive 5-Slot Quota Visualizer */}
      <div className="z-10 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 p-3 rounded-2xl flex flex-col items-end gap-1.5 shrink-0 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Your ₹1 Quota</span>
          <span className="text-xs font-black font-mono text-amber-400">{itemsRemainingThisMonth} / 5 Left</span>
        </div>

        {/* 5 Coin Slots */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((slotIdx) => {
            const isAvailable = slotIdx <= itemsRemainingThisMonth;
            return (
              <div
                key={slotIdx}
                title={isAvailable ? `Item ${slotIdx}: Available @ ₹1` : `Item ${slotIdx}: Used`}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-mono transition-all duration-300 ${
                  isAvailable
                    ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-400/30 scale-105 border border-yellow-200'
                    : 'bg-slate-800 text-slate-600 border border-slate-700/60 opacity-40'
                }`}
              >
                {isAvailable ? '₹1' : '✓'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const HeroBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const { setActiveCategory, setActiveTab, setSubCategoryFilter } = useApp();

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goTo = (idx: number) => {
    setCurrent(idx);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = SLIDES[current];

  return (
    <div className="px-4 pt-3 pb-1">
      {/* ── 9 PM - 10 PM ₹1 FLASH SALE BANNER ── */}
      <FlashSaleBannerCard />

      {/* ── HERO CAROUSEL ── */}
      <div
        className="rounded-[20px] p-4 text-white relative overflow-hidden transition-all duration-500 shadow-md min-h-[140px] flex flex-col justify-between"
        style={{ background: slide.bgGradient }}
      >
        <div className="flex justify-between items-start z-10">
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md tracking-wider">
            {slide.badge}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/30 backdrop-blur-sm text-yellow-300">
            {slide.tag}
          </span>
        </div>

        <div className="z-10 mt-2 mb-2 max-w-[62%]">
          <h3 className="text-lg font-black leading-tight whitespace-pre-line drop-shadow-sm">
            {slide.title}
          </h3>
          <p className="text-[11px] text-white/80 mt-1 font-medium leading-snug">
            {slide.subtitle}
          </p>
        </div>

        <div className="z-10 mt-1">
          <button
            onClick={() => {
              setActiveCategory(slide.category);
              setSubCategoryFilter('All');
              setActiveTab('category_detail');
            }}
            className="self-start text-xs font-black py-1.5 px-3.5 rounded-lg transition-all active:scale-95 btn-ripple cursor-pointer"
            style={{ background: slide.accentColor, color: '#111' }}
          >
            {slide.buttonText} →
          </button>
        </div>

        <div className="absolute right-0 bottom-0 top-0 w-[46%] flex items-end justify-end overflow-hidden">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-80"
            style={{ maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.9) 40%, #000 100%)' }}
            loading="lazy"
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 60%)' }}
        />
      </div>

      <div className="flex justify-center gap-1.5 mt-2.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              current === idx ? 'w-6 bg-gray-800' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
