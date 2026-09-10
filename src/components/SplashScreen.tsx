import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar animation over 2 seconds (like Blinkit, Zepto, Uber)
    const startTime = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 300); // 300ms smooth fade transition
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  return (
    <div
      onClick={handleSkip}
      className={`absolute inset-0 z-50 bg-white flex flex-col justify-between items-center px-6 py-12 select-none cursor-pointer transition-opacity duration-300 ${
        fadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glow matching CartCraze brand palette */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#00676d]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#fb7800]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Skip */}
      <div className="w-full flex justify-end items-center z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100/80 hover:bg-slate-200/80 px-3 py-1 rounded-full backdrop-blur-sm transition-all cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Center Hero: Official CartCraze Logo with Smooth Spring Animation */}
      <div className="flex flex-col items-center text-center my-auto z-10">
        {/* Logo Card with ambient shadow */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#00676d]/20 to-[#fb7800]/20 rounded-3xl blur-xl opacity-75 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-3xl shadow-[0_16px_40px_rgba(0,103,109,0.15)] border border-slate-100 flex items-center justify-center p-3.5 transform transition-transform duration-700 hover:scale-105">
            <img
              src="/cartcraze_logo.jpg"
              alt="CartCraze"
              className="w-full h-full object-contain drop-shadow-sm"
              loading="eager"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-6">
          Cart<span className="text-[#fb7800]">Craze</span>
        </h1>

        {/* Tagline */}
        <p className="text-xs sm:text-sm font-bold text-slate-400 tracking-wider uppercase mt-1">
          India's Last Minute App
        </p>

        {/* 10-Min Delivery Pill Badge */}
        <div className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 border border-[#fb7800]/20 text-[#fb7800] text-xs font-black shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>10 MIN DELIVERY</span>
        </div>
      </div>

      {/* Bottom Footer: High-End Progress Indicator & Brand Subtitle */}
      <div className="w-full flex flex-col items-center space-y-3 z-10 pb-2">
        {/* Sleek Progress Bar */}
        <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#00676d] to-[#fb7800] rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[11px] font-semibold text-slate-400 tracking-wide">
          Instant Grocery & Essentials
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
