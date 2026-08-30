import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isDarkMode }) => {
  const statusBg = isDarkMode ? '#0f172a' : '#f8fafc';
  const statusText = isDarkMode ? '#f1f5f9' : '#0f172a';

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center sm:py-8 font-sans">
      <div
        className={[
          'relative w-full min-h-screen flex flex-col overflow-hidden',
          isDarkMode ? 'bg-slate-900' : 'bg-slate-50',
          'sm:w-[390px] sm:min-h-0 sm:h-[844px] sm:rounded-[44px]',
          'sm:shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]',
          'sm:border sm:border-white/10 sm:overflow-hidden',
        ].join(' ')}
      >
        {/* Status bar */}
        <div
          className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 shrink-0 z-50 relative"
          style={{ background: statusBg }}
        >
          <span className="text-[11px] font-bold tracking-tight" style={{ color: statusText }}>9:41</span>
          <div className="w-24 h-5 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1.5" />
          <div className="flex items-center gap-1.5">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="6" width="3" height="6" rx="1" fill={statusText} />
              <rect x="4.5" y="4" width="3" height="8" rx="1" fill={statusText} />
              <rect x="9" y="2" width="3" height="10" rx="1" fill={statusText} />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill={statusText} />
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <path d="M7.5 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill={statusText} />
              <path d="M4.5 7a4.5 4.5 0 0 1 6 0" stroke={statusText} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M2 4.5a7.5 7.5 0 0 1 11 0" stroke={statusText} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="flex items-center gap-0.5">
              <div
                className="w-6 h-3 rounded-[3px] p-0.5 flex border"
                style={{ borderColor: statusText }}
              >
                <div className="rounded-sm flex-1" style={{ background: statusText }} />
              </div>
              <div className="w-0.5 h-1.5 rounded-r-sm" style={{ background: statusText }} />
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
          {children}
        </div>

        {/* Home indicator */}
        <div
          className="hidden sm:flex justify-center pb-2 pt-1 shrink-0"
          style={{ background: statusBg }}
        >
          <div
            className="w-32 h-1 rounded-full opacity-30"
            style={{ background: statusText }}
          />
        </div>
      </div>
    </div>
  );
};
