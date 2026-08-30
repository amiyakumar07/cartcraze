import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

/* ──────────────────────────────────────────────────────
   Proper iPhone-style mobile frame (390 × 844 viewport)
   Centred on a dark slate background on desktop.
   On actual mobile devices (<640px) it fills full screen.
────────────────────────────────────────────────────── */
export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center sm:py-8 font-sans">
      {/* Phone shell */}
      <div
        className={[
          // Full-screen on real phones
          'relative w-full min-h-screen flex flex-col bg-white overflow-hidden',
          // iPhone 14-like frame on desktop
          'sm:w-[390px] sm:min-h-0 sm:h-[844px] sm:rounded-[44px]',
          'sm:shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]',
          'sm:border sm:border-white/10 sm:overflow-hidden',
        ].join(' ')}
      >
        {/* Status-bar notch — visible on desktop frame only */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 bg-white shrink-0 z-50">
          <span className="text-[11px] font-bold text-gray-900 tracking-tight">9:41</span>
          <div className="w-24 h-5 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1.5" />
          <div className="flex items-center gap-1.5">
            {/* Signal bars */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="6" width="3" height="6" rx="1" fill="#111827" />
              <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111827" />
              <rect x="9" y="2" width="3" height="10" rx="1" fill="#111827" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111827" />
            </svg>
            {/* WiFi */}
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <path d="M7.5 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="#111827" />
              <path d="M4.5 7a4.5 4.5 0 0 1 6 0" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M2 4.5a7.5 7.5 0 0 1 11 0" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {/* Battery */}
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 border border-gray-800 rounded-[3px] p-0.5 flex">
                <div className="bg-gray-900 rounded-sm flex-1" />
              </div>
              <div className="w-0.5 h-1.5 bg-gray-800 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Scrollable app content */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
          {children}
        </div>

        {/* Home indicator bar — visible on desktop frame only */}
        <div className="hidden sm:flex justify-center pb-2 pt-1 bg-white shrink-0">
          <div className="w-32 h-1 bg-gray-900 rounded-full opacity-20" />
        </div>
      </div>
    </div>
  );
};
