import React, { useRef, useState, useCallback } from 'react';

interface SwipeToConfirmProps {
  label: string;
  confirmLabel: string;
  onConfirm: () => Promise<void> | void;
  disabled?: boolean;
}

export const SwipeToConfirm: React.FC<SwipeToConfirmProps> = ({
  label,
  confirmLabel,
  onConfirm,
  disabled = false,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startRef = useRef({ startX: 0, thumbStartX: 0, maxX: 0 });

  const bounds = useCallback(() => {
    const trackW = trackRef.current?.clientWidth ?? 0;
    const thumbW = thumbRef.current?.offsetWidth ?? 0;
    return Math.max(0, trackW - thumbW - 8);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (confirmed || disabled || isSubmitting) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { startX: e.clientX, thumbStartX: x, maxX: bounds() };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || confirmed || disabled || isSubmitting) return;
    const { startX, thumbStartX, maxX } = startRef.current;
    const next = Math.max(0, Math.min(maxX, thumbStartX + (e.clientX - startX)));
    setX(next);
  };

  const onPointerUp = async () => {
    if (!dragging || confirmed || disabled || isSubmitting) return;
    setDragging(false);
    const maxX = bounds();
    if (x >= maxX * 0.82) {
      setX(maxX);
      setConfirmed(true);
      setIsSubmitting(true);
      try {
        await onConfirm();
      } catch (err) {
        console.error('Swipe action failed:', err);
        // Roll back if API call fails
        setConfirmed(false);
        setX(0);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setX(0);
    }
  };

  const progress = (() => {
    const maxX = bounds() || 1;
    return x / maxX;
  })();

  return (
    <div
      ref={trackRef}
      className={`relative h-[56px] rounded-full border border-emerald-500/20 overflow-hidden select-none transition-colors ${
        confirmed ? 'bg-[#00C985]' : 'bg-[#1D2F26]'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Background Animated Chevron Glow */}
      {!confirmed && (
        <div className="absolute inset-0 flex items-center justify-end pr-6 opacity-40 pointer-events-none">
          <div className="flex gap-1 text-[#00C985] animate-pulse">
            <span className="text-sm font-black">›</span>
            <span className="text-sm font-black">›</span>
            <span className="text-sm font-black">›</span>
          </div>
        </div>
      )}

      {/* Progress Fill Bar */}
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00C98559] to-[#00C985] transition-[width] duration-300"
        style={{ width: x + 28 }}
      />

      {/* Label Text */}
      <div
        className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-extrabold pointer-events-none transition-opacity font-sans"
        style={{
          opacity: confirmed ? 1 : 1 - progress * 1.15,
          color: confirmed ? '#08201A' : '#F3F7F4',
        }}
      >
        {isSubmitting ? 'Processing…' : confirmed ? confirmLabel : label}
      </div>

      {/* Drag Thumb Button */}
      <div
        ref={thumbRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          transform: `translateX(${x}px)`,
          transition: dragging ? 'none' : 'transform .28s cubic-bezier(.16,1,.3,1)',
        }}
        className="absolute top-1 left-1 w-[48px] h-[48px] rounded-full bg-[#00C985] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_6px_16px_-4px_rgba(0,201,133,0.5)] touch-pan-y"
      >
        {confirmed ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#08201A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#08201A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h13M12 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </div>
  );
};
