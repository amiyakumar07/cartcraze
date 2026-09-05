import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center sm:py-6 font-sans antialiased text-slate-100">
      <div
        className={[
          'relative w-full min-h-screen flex flex-col bg-[#0B1121] overflow-hidden',
          'sm:w-[412px] sm:min-h-0 sm:h-[870px] sm:rounded-[40px]',
          'sm:shadow-[0_32px_80px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.1)]',
          'sm:border sm:border-slate-800 sm:overflow-hidden',
        ].join(' ')}
      >
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
          {children}
        </div>
      </div>
    </div>
  );
};
