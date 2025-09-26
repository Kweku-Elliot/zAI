import React, { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

export default function SplashScreen() {
  const [, setLocation] = useLocation();
  const fadeRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade and scale animation
    if (fadeRef.current && scaleRef.current) {
      fadeRef.current.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], {
        duration: 1000,
        fill: 'forwards',
        easing: 'ease-out'
      });
      scaleRef.current.animate([
        { transform: 'scale(0.8)' },
        { transform: 'scale(1)' }
      ], {
        duration: 1000,
        fill: 'forwards',
        easing: 'ease-out'
      });
    }
    // Auto navigate to main app after 3 seconds
    const timer = setTimeout(() => {
      setLocation('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center mobile-safe-container">
      <div
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80"
        style={{ minHeight: '100vh' }}
      >
        <div ref={fadeRef} className="flex flex-col items-center justify-center" style={{ transition: 'opacity 1s' }}>
          <div ref={scaleRef} className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg" style={{ transition: 'transform 1s' }}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4A90E2] to-[#6A5ACD] flex items-center justify-center">
              <span className="text-2xl font-bold text-white font-aboutyou">Z</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mt-6 tracking-wide font-aboutyou">
            <span className="text-white">ZeN</span>
            <span className="text-blue-200">ux</span>
          </div>
        </div>
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
