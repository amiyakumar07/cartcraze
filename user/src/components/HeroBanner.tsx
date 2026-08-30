import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

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
  },
  {
    id: 3,
    badge: '🥑 EXOTIC PICKS',
    title: 'Avocados &\nGourmet Imports',
    subtitle: 'Handpicked exotic produce • Premium quality',
    buttonText: 'Explore Now',
    category: 'fruits',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
    accentColor: '#818cf8',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=85',
    tag: 'TRENDING'
  }
];

export const HeroBanner: React.FC = () => {
  const { setActiveCategory, setActiveTab, setSubCategoryFilter } = useApp();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 420);
  }, [animating]);

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, [current, goTo]);

  const slide = SLIDES[current];

  return (
    <div className="px-0 relative">
      {/* Banner card */}
      <div
        key={slide.id}
        className="relative rounded-2xl overflow-hidden h-[148px] animate-bannerIn"
        style={{ background: slide.bgGradient }}
      >
        {/* Tag pill */}
        <span
          className="absolute top-3 left-3 text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider z-10"
          style={{ background: 'rgba(255,255,255,0.15)', color: slide.accentColor, border: `1px solid ${slide.accentColor}40` }}
        >
          {slide.tag}
        </span>

        {/* Text content */}
        <div className="absolute left-0 top-0 bottom-0 w-[58%] flex flex-col justify-center pl-4 pt-5 z-10">
          <p className="text-[10px] font-bold mb-1 opacity-70" style={{ color: slide.accentColor }}>
            {slide.badge}
          </p>
          <h2
            className="text-[19px] font-black leading-[1.15] text-white mb-1.5 whitespace-pre-line"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            {slide.title}
          </h2>
          <p className="text-[10px] text-white/70 font-medium mb-3 leading-snug">
            {slide.subtitle}
          </p>
          <button
            onClick={() => {
              setActiveCategory(slide.category);
              setSubCategoryFilter('All');
              setActiveTab('category_detail');
            }}
            className="self-start text-xs font-black py-1.5 px-3.5 rounded-lg transition-all active:scale-95 btn-ripple"
            style={{ background: slide.accentColor, color: '#111' }}
          >
            {slide.buttonText} →
          </button>
        </div>

        {/* Product image */}
        <div className="absolute right-0 bottom-0 top-0 w-[46%] flex items-end justify-end overflow-hidden">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-80"
            style={{ maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.9) 40%, #000 100%)' }}
            loading="lazy"
          />
        </div>

        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 60%)' }}
        />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-2.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === idx ? 'w-6 bg-gray-800' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
