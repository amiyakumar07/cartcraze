import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getFlashSaleStatus } from '../utils/flashSale';
import { Zap, Sparkles, Flame, Clock, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  buttonText: string;
  category: string;
  bgGradient: string;
  accentColor: string;
  badgeColor: string;
  image: string;
  tag: string;
}

const SLIDES: Slide[] = [
  {
    id: 0,
    badge: '🥦 FARM FRESH VEGETABLES',
    title: 'SAVE ON FARM-FRESH',
    highlightText: '20% OFF ORGANIC PRODUCE',
    subtitle: 'Plucked fresh from local farms • Valid on all organic produce',
    buttonText: 'Shop Fresh Veggies',
    category: 'vegetables',
    bgGradient: 'linear-gradient(135deg, #003B25 0%, #006C49 50%, #059669 100%)',
    accentColor: '#10B981',
    badgeColor: '#34D399',
    image: '/fresh_deals_banner.jpg',
    tag: 'FRESH DEALS 20% OFF'
  },
  {
    id: 1,
    badge: '🥛 PURE DAIRY & EGGS',
    title: 'FRESH A2 COW MILK',
    highlightText: 'Delivered Every Morning',
    subtitle: 'Pasteurized Gir Cow milk • Organic certified farms',
    buttonText: 'Explore Dairy',
    category: 'dairy',
    bgGradient: 'linear-gradient(135deg, #451A03 0%, #78350F 50%, #92400E 100%)',
    accentColor: '#FBBF24',
    badgeColor: '#FCD34D',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=85',
    tag: 'FARM DIRECT'
  },
  {
    id: 2,
    badge: '🥐 ARTISANAL BAKERY',
    title: 'ZERO MAIDA BREAD',
    highlightText: 'Baked Fresh Daily',
    subtitle: 'Sourdough loaves & buttery croissants • Oven-warm delivery',
    buttonText: 'Browse Bakery',
    category: 'bakery',
    bgGradient: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #7C3AED 100%)',
    accentColor: '#C084FC',
    badgeColor: '#E9D5FF',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=85',
    tag: 'HOT FROM OVEN'
  }
];

export const FlashSaleBannerCard: React.FC = () => {
  const [flashStatus, setFlashStatus] = useState(getFlashSaleStatus());
  const { setActiveCategory, setActiveTab } = useApp();

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashStatus(getFlashSaleStatus());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { isActiveNow, itemsRemainingThisMonth, isQuotaExhausted, timeRemainingStr, nextResetDateStr } = flashStatus;

  if (isQuotaExhausted) {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-[#1E1B4B] to-purple-950 border border-purple-500/30 text-white rounded-3xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs mb-3 font-[Inter,sans-serif] relative overflow-hidden">
        <div className="flex items-center gap-3 z-10">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
            🎉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                MONTHLY ₹1 OFFER CLAIMED
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-amber-300 mt-0.5">5 / 5 ₹1 Deals Purchased This Month!</h3>
            <p className="text-[10px] text-slate-300 font-medium">
              Quota resets on <strong className="text-emerald-400">{nextResetDateStr}</strong>. Enjoy our regular 50% discounts!
            </p>
          </div>
        </div>

        <div className="z-10 bg-purple-950/60 backdrop-blur-md border border-purple-500/30 px-3 py-1.5 rounded-2xl font-mono text-[10px] text-purple-200 shrink-0">
          Quota: <strong className="text-amber-400">0 / 5 Left</strong>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        setActiveCategory('fruits');
        setActiveTab('category_detail');
      }}
      className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 mb-3 cursor-pointer group border relative bg-[#003B25] ${
        isActiveNow
          ? 'border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.4)]'
          : 'border-amber-400/40 shadow-xl'
      }`}
    >
      {/* Visual Image Banner Background */}
      <div className="relative w-full h-[140px] sm:h-[160px] overflow-hidden">
        <img
          src="/one_rs_deal_banner.jpg"
          alt="MEGA DEAL ₹1 ONLY - Grocery Mart"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Live Status Overlay Ribbon */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
          <span
            className={`text-[9.5px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
              isActiveNow
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 animate-pulse font-black'
                : 'bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/40 font-extrabold'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isActiveNow ? 'bg-slate-950 animate-ping' : 'bg-amber-400'}`} />
            <span>{isActiveNow ? '⚡ LIVE NOW • 9 PM - 10 PM' : 'DAILY 9 PM - 10 PM FLASH SALE'}</span>
          </span>

          {isActiveNow && (
            <span className="bg-rose-950/90 text-rose-200 border border-rose-400/50 text-[9.5px] font-mono px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 shadow-md">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>ENDS IN {timeRemainingStr}</span>
            </span>
          )}
        </div>

        {/* Floating Quota Counter Badge */}
        <div className="absolute bottom-3 right-3 z-10 bg-slate-950/85 backdrop-blur-md border border-amber-400/50 p-2 px-3 rounded-2xl flex items-center gap-2 shadow-xl">
          <span className="text-[10px] text-amber-200 font-extrabold uppercase tracking-wider">₹1 Quota:</span>
          <span className="text-xs font-black font-mono text-amber-300">{itemsRemainingThisMonth} / 5 Left</span>
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
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = SLIDES[current];

  return (
    <div className="px-4 pt-3 pb-1 font-[Inter,sans-serif]">
      {/* ── 1st OFFER BANNER: 9 PM - 10 PM FLASH SALE BANNER ── */}
      <FlashSaleBannerCard />

      {/* ── HERO PROMO CAROUSEL BANNER ── */}
      <div
        className="rounded-3xl p-5 text-white relative overflow-hidden transition-all duration-700 shadow-xl min-h-[160px] flex flex-col justify-between group border border-white/10"
        style={{ background: slide.bgGradient }}
      >
        {/* Background Image Container with Gradient Mask */}
        <div className="absolute right-0 bottom-0 top-0 w-[50%] flex items-end justify-end overflow-hidden pointer-events-none">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
            style={{ maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 35%, #000 100%)' }}
            loading="lazy"
          />
        </div>

        {/* Top Badges Bar */}
        <div className="flex justify-between items-start z-10 gap-2">
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 tracking-wider shadow-sm uppercase">
            {slide.badge}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-amber-300 border border-amber-400/30">
            {slide.tag}
          </span>
        </div>

        {/* Center Content */}
        <div className="z-10 my-2.5 max-w-[62%] space-y-1">
          <h3 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md text-white tracking-tight">
            {slide.title}
          </h3>
          <p
            className="text-xs font-black drop-shadow-sm tracking-wide"
            style={{ color: slide.badgeColor }}
          >
            {slide.highlightText}
          </p>
          <p className="text-[11px] text-white/85 font-medium leading-snug max-w-xs">
            {slide.subtitle}
          </p>
        </div>

        {/* Bottom CTA Button */}
        <div className="z-10">
          <button
            onClick={() => {
              setActiveCategory(slide.category);
              setSubCategoryFilter('All');
              setActiveTab('category_detail');
            }}
            className="self-start text-xs font-black py-2.5 px-5 rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5 text-slate-950 hover:brightness-110"
            style={{ background: slide.accentColor }}
          >
            <span>{slide.buttonText}</span>
            <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3]" />
          </button>
        </div>

        {/* Ambient Overlay Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 65%)' }}
        />
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              current === idx ? 'w-7 bg-[#006C49]' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
