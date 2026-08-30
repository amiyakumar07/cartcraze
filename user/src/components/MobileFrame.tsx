import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

/* ──────────────────────────────────────────────────────
   Clean Mobile Frame View (390 × 844 viewport)
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
        {/* Scrollable app content */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
          {children}
        </div>
      </div>
    </div>
  );
};
