import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { AppLogo } from '../components/AppLogo';

export const OnboardingScreen: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="min-h-full bg-white text-gray-900 flex flex-col justify-between p-6 animate-fadeIn relative">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center pt-2">
        <AppLogo className="h-8 w-auto object-contain" />

        <button
          onClick={() => setActiveTab('home')}
          className="text-xs font-bold text-[#00676d] hover:text-[#fb7800] transition-colors"
        >
          Skip to Store →
        </button>
      </div>

      {/* Hero Illustration */}
      <div className="my-auto py-6 flex flex-col items-center text-center space-y-8">
        <div className="w-full max-w-[300px] h-[280px] flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00676d]/15 via-[#fb7800]/10 to-transparent rounded-full blur-2xl opacity-70 transform scale-95" />
          
          <img
            src="/onboarding_scooter.png"
            alt="Delivery Executive on Scooter"
            className="w-full h-full object-contain relative z-10 drop-shadow-md hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Text Copy styled with CartCraze brand colors */}
        <div className="space-y-3 px-2">
          <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
            Groceries in <br />
            <span className="text-white bg-[#fb7800] px-3.5 py-1 rounded-2xl inline-block mt-1 shadow-md shadow-[#fb7800]/25 font-black">
              10 Minutes
            </span>
          </h1>

          <p className="text-sm font-medium text-slate-500 max-w-[260px] mx-auto leading-relaxed">
            Freshness delivered at the speed of light.
          </p>
        </div>
      </div>

      {/* Bottom CTA Button matching CartCraze brand colors */}
      <div className="w-full pb-4 space-y-3">
        <button
          onClick={() => setActiveTab('login')}
          className="w-full bg-[#fb7800] hover:bg-[#e06b00] text-white font-black text-base py-4 rounded-2xl transition-all shadow-lg shadow-[#fb7800]/25 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>

        <p className="text-[11px] text-center text-slate-400">
          Already have an account?{' '}
          <button 
            onClick={() => setActiveTab('login')} 
            className="font-bold text-[#00676d] hover:text-[#fb7800] underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default OnboardingScreen;
