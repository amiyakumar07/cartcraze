import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center sm:py-8 font-sans">
      <div
        className={[
          'relative w-full min-h-screen flex flex-col bg-white overflow-hidden',
          'sm:w-[390px] sm:min-h-0 sm:h-[844px] sm:rounded-[44px]',
          'sm:shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]',
          'sm:border sm:border-white/10 sm:overflow-hidden',
        ].join(' ')}
      >
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
          {children}
        </div>
      </div>
    </div>
  );
};
