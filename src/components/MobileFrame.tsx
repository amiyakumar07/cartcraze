import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center font-sans sm:py-6">
      {/* Native Clean Mobile App Viewport Container */}
      <div className="w-full max-w-[430px] bg-white min-h-screen sm:min-h-[884px] sm:max-h-[92vh] sm:rounded-[36px] overflow-y-auto no-scrollbar shadow-2xl relative flex flex-col border border-gray-200">
        <div className="flex-1 flex flex-col relative">
          {children}
        </div>
      </div>
    </div>
  );
};
