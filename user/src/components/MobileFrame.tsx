import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#0d1117] flex items-center justify-center sm:py-6 font-sans select-none overflow-x-hidden">
      {/* Device Phone Frame Mockup on Desktop / Tablet */}
      <div
        className={[
          'relative w-full h-[100dvh] sm:h-[880px] sm:w-[412px] sm:max-w-[412px]',
          'bg-white sm:rounded-[44px] flex flex-col overflow-hidden',
          'sm:shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_10px_#1f2937,0_0_0_12px_#374151]',
          'sm:border sm:border-white/10',
        ].join(' ')}
        style={{
          transform: 'translateZ(0)',
          contain: 'paint'
        }}
      >
        {/* Dynamic Island Notch (visible on sm+ desktop frames) */}
        <div className="hidden sm:flex absolute top-2 inset-x-0 justify-center z-50 pointer-events-none">
          <div className="w-24 h-4 bg-black rounded-full" />
        </div>

        {/* Content Viewport */}
        <div className="flex-1 w-full h-full flex flex-col overflow-y-auto no-scrollbar relative bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
