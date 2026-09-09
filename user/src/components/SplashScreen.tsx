import React, { useRef, useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Safety fallback: if video doesn't end within 8 seconds, continue cleanly
    const safetyTimer = setTimeout(() => {
      finish();
    }, 8000);

    const videoEl = videoRef.current;
    if (videoEl) {
      // Auto-play immediately with fallback
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          videoEl.muted = true;
          videoEl.play().catch(() => {
            // If autoplay is completely blocked by policy, continue safely
            finish();
          });
        });
      }
    }

    return () => clearTimeout(safetyTimer);
  }, []);

  const finish = () => {
    if (!completed) {
      setCompleted(true);
      onComplete();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    >
      <video
        ref={videoRef}
        src="/splash_video.mp4"
        autoPlay
        playsInline
        muted
        disablePictureInPicture
        controls={false}
        onEnded={finish}
        onError={finish}
        className="w-full h-full object-cover"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default SplashScreen;
