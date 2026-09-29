'use client';

import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onClose?: () => void;
  forceShow?: boolean;
}

export function SplashScreen({ onClose, forceShow = false }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('vidyasetu_splash_seen');
    if (forceShow || !hasSeenSplash) {
      setIsVisible(true);
      
      // Auto-trigger clean fly-into-header animation after 1.5 seconds
      const timer = setTimeout(() => {
        handleFlyToHeader();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const handleFlyToHeader = () => {
    sessionStorage.setItem('vidyasetu_splash_seen', 'true');
    setIsMorphing(true);

    // After 850ms smooth transition, hide splash overlay
    setTimeout(() => {
      setIsVisible(false);
      setIsMorphing(false);
      if (onClose) onClose();
    }, 850);
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleFlyToHeader}
      className={`fixed inset-0 z-50 overflow-hidden cursor-pointer transition-all duration-850 ${
        isMorphing ? 'bg-white/0 pointer-events-none' : 'bg-white pointer-events-auto'
      }`}
    >
      {/* 100% PURE CLEAN WHITE BACKGROUND */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-850 ease-in-out ${
          isMorphing ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* ONLY THE CENTERED REFERENCE LOGO IMAGE */}
      <div
        className={`fixed transition-all duration-850 cubic-bezier(0.16, 1, 0.3, 1) transform flex items-center justify-center ${
          isMorphing
            ? 'top-4 left-4 sm:left-8 translate-x-0 translate-y-0 scale-30 opacity-0'
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 sm:scale-125 opacity-100'
        }`}
      >
        <img
          src="/vidyasetu_logo.png"
          alt="VidyaSetu Logo"
          className="h-44 sm:h-56 w-auto object-contain"
        />
      </div>
    </div>
  );
}
