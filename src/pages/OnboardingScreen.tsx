import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="min-h-full bg-white text-gray-900 flex flex-col justify-between p-6 animate-fadeIn relative">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center pt-2">
        <span className="bg-[#D4F600] text-black font-black text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider">
          CartCraze
        </span>

        <button
          onClick={() => setActiveTab('home')}
          className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
        >
          Skip to Store →
        </button>
      </div>

      {/* Hero Illustration */}
      <div className="my-auto py-6 flex flex-col items-center text-center space-y-8">
        <div className="w-full max-w-[300px] h-[280px] flex items-center justify-center relative">
          {/* Subtle background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-lime-100 to-yellow-100 rounded-full blur-2xl opacity-60 transform scale-90" />
          
          <img
            src="/onboarding_scooter.png"
            alt="Delivery Executive on Scooter"
            className="w-full h-full object-contain relative z-10 drop-shadow-md hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Text Copy matching exact Stitch design */}
        <div className="space-y-3 px-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">
            Groceries in <br />
            <span className="text-black bg-[#D4F600] px-3 py-0.5 rounded-2xl inline-block mt-1">
              10 Minutes
            </span>
          </h1>

          <p className="text-sm font-medium text-gray-500 max-w-[260px] mx-auto leading-relaxed">
            Freshness delivered at the speed of light.
          </p>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full pb-4 space-y-3">
        <button
          onClick={() => setActiveTab('login')}
          className="w-full bg-[#D4F600] hover:bg-[#c3e300] text-black font-black text-lg py-4 rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 text-black" />
        </button>

        <p className="text-[11px] text-center text-gray-400">
          Already have an account? <button onClick={() => setActiveTab('login')} className="font-bold text-gray-700 underline">Login</button>
        </p>
      </div>
    </div>
  );
};
