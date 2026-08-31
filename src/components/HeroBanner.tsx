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
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800 text-white rounded-3xl p-4 shadow-xl flex items-center justify-between gap-3 text-xs mb-3 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 text-purple-300 rounded-2xl flex items-center justify-center font-black text-lg border border-purple-500/40">
            🎉
          </div>
          <div>
            <h3 className="font-extrabold text-amber-300 text-xs">Monthly 5-Item Limit Reached</h3>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">
              You used your 5 items @ ₹1 offer for this month! Next 5-item offer resets on <strong className="text-white">{nextResetDateStr}</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-3xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs font-sans relative overflow-hidden transition-all mb-3 ${
      isActiveNow
        ? 'bg-gradient-to-r from-red-950 via-amber-950 to-red-900 border-red-500 text-white animate-pulse'
        : 'bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 border-amber-500/40 text-white'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-black shadow-md ${
          isActiveNow ? 'bg-amber-400 text-black animate-bounce' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}>
          🔥
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-black font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              {isActiveNow ? 'LIVE NOW • 9 PM - 10 PM' : 'DAILY 9 PM - 10 PM FLASH SALE'}
            </span>
            {isActiveNow && (
              <span className="bg-red-600 text-white text-[10px] font-mono px-2 py-0.5 rounded-full animate-pulse font-bold">
                ENDS IN {timeRemainingStr}
              </span>
            )}
          </div>

          <h3 className="text-sm font-black text-white mt-1">
            EVERYTHING @ ₹1 EACH! (LIMIT: 5 ITEMS/USER)
          </h3>

          <p className="text-[11px] text-slate-300 font-medium mt-0.5">
            {isActiveNow
              ? `⚡ Flash Sale is LIVE! You have ${itemsRemainingThisMonth} items left at ₹1 this month.`
              : `⏰ Set your alarm for 9:00 PM tonight! All products available for ₹1 (5 items max/user).`}
          </p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl text-right font-mono shrink-0">
        <span className="text-[10px] text-slate-300 block">Your ₹1 Quota</span>
        <span className="text-sm font-black text-amber-400">{itemsRemainingThisMonth} / 5 Items Left</span>
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
