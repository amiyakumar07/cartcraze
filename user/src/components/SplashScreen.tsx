import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Safety fallback: continue if video doesn't end within 8.5s
    const safetyTimer = setTimeout(() => {
      finish();
    }, 8500);

    // Unmute helper
    const enableAudio = () => {
      if (videoEl) {
        videoEl.muted = false;
        videoEl.volume = 1.0;
        setIsMuted(false);
      }
    };

    // Attempt unmuted play first
    videoEl.muted = false;
    videoEl.volume = 1.0;
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // Browser autoplay restriction: start muted, listen for first touch/click anywhere to unmute
          videoEl.muted = true;
          setIsMuted(true);
          videoEl.play().catch(() => finish());
        });
    }

    // Global listener: first user touch/tap/click instantly unmutes with full sound
    const handleFirstGesture = () => {
      enableAudio();
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });
    window.addEventListener('click', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const finish = () => {
    if (!completed) {
      setCompleted(true);
      onComplete();
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (videoEl) {
      const nextMuted = !videoEl.muted;
      videoEl.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        videoEl.volume = 1.0;
        videoEl.play().catch(() => {});
      }
    }
  };

  const handleContainerClick = () => {
    const videoEl = videoRef.current;
    if (videoEl && videoEl.muted) {
      videoEl.muted = false;
      videoEl.volume = 1.0;
      setIsMuted(false);
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      className="absolute inset-0 z-50 bg-[#ECE7DE] flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* Top Skip Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md z-30 transition-all cursor-pointer shadow-sm"
      >
        Skip
      </button>

      {/* Video Container - Seamlessly matches the video's #ECE7DE background with natural proportional scaling */}
      <div className="relative w-full h-full flex items-center justify-center p-3">
        <video
          ref={videoRef}
          src="/splash_video.mp4"
          autoPlay
          playsInline
          disablePictureInPicture
          controls={false}
          onEnded={finish}
          onError={finish}
          className="w-full h-full max-w-[390px] max-h-[760px] object-contain"
        />
      </div>

      {/* Floating Sound Toggle Badge - Centered bottom pill */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-30 pointer-events-none">
        <button
          type="button"
          onClick={toggleSound}
          className="pointer-events-auto bg-black/80 hover:bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-xl border border-white/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">Tap for sound 🔊</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white tracking-wide">Sound on</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
