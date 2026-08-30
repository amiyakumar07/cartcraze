import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveCategory, setActiveTab, setSubCategoryFilter } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: '50% OFF on Fresh Fruits!',
      subtitle: 'Handpicked organic fruits direct from farm',
      badge: 'LIMITED TIME OFFER',
      buttonText: 'Shop Fruits',
      bgColor: 'bg-[#d7f5d4]',
      textColor: 'text-emerald-950',
      badgeColor: 'bg-emerald-800 text-white',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
      category: 'fruits'
    },
    {
      title: 'Fresh Farm A2 Milk & Dairy',
      subtitle: 'Pure, unadulterated morning daily delivery',
      badge: 'SUPER SAVINGS',
      buttonText: 'Explore Dairy',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-950',
      badgeColor: 'bg-amber-800 text-white',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80',
      category: 'dairy'
    },
    {
      title: 'Zero Maida Fresh Bakery',
      subtitle: 'Oven fresh sourdough bread & cookies',
      badge: 'BACK IN STOCK',
      buttonText: 'Order Bakery',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-950',
      badgeColor: 'bg-orange-800 text-white',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
      category: 'bakery'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative">
      <div 
        className={`relative ${slide.bgColor} rounded-2xl p-4 overflow-hidden flex items-center min-h-[140px] transition-colors duration-500 shadow-xs`}
      >
        <div className="z-10 w-3/5 pr-2">
          <span className={`inline-block ${slide.badgeColor} text-[9px] font-black px-2 py-0.5 rounded-full mb-1.5 uppercase tracking-wider`}>
            {slide.badge}
          </span>
          <h2 className={`text-base font-extrabold leading-tight ${slide.textColor} mb-1`}>
            {slide.title}
          </h2>
          <p className="text-[11px] text-gray-700 font-medium leading-tight">
            {slide.subtitle}
          </p>
          <button
            onClick={() => {
              setActiveCategory(slide.category);
              setSubCategoryFilter('All');
              setActiveTab('category_detail');
            }}
            className="mt-3 bg-[#fdee24] hover:bg-yellow-400 text-black font-extrabold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-xs transition-transform active:scale-95"
          >
            <span>{slide.buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero image preview */}
        <div className="absolute right-[-10px] bottom-[-10px] w-2/5 h-full flex items-end justify-end">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-28 h-28 object-cover rounded-full shadow-md transform border-2 border-white/80 transition-all duration-500 hover:scale-105"
          />
        </div>
      </div>

      {/* Slide Indicator Dots */}
      <div className="flex justify-center gap-1.5 mt-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'w-5 bg-gray-900' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
