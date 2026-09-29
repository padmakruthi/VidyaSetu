'use client';

import React from 'react';

interface VidyasetuLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'splash';
  variant?: 'horizontal' | 'vertical' | 'icon-only' | 'splash';
  showSlogan?: boolean;
  theme?: 'light' | 'dark' | 'color';
  lang?: 'en' | 'hi';
  className?: string;
}

export function VidyasetuLogo({
  size = 'md',
  variant = 'horizontal',
  showSlogan = true,
  theme = 'color',
  lang = 'en',
  className = ''
}: VidyasetuLogoProps) {
  // Size metrics for the actual image
  const imgSizeMap = {
    sm: 'h-9 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-20 w-auto',
    xl: 'h-32 w-auto',
    splash: 'h-48 sm:h-64 w-auto'
  };

  const sloganText = lang === 'hi' 
    ? 'हर विद्यार्थी का, सफलता का मार्ग'
    : 'HAR VIDYARTHI KA, SAFALTA KA MARG';

  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-block overflow-hidden rounded-xl ${className}`}>
        <img
          src="/vidyasetu_logo.png"
          alt="VidyaSetu Logo"
          className={`${imgSizeMap[size]} object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105`}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className} group`}>
      {/* Exact uploaded logo image */}
      <div className="relative p-1 rounded-2xl bg-white/90 shadow-xs border border-slate-100/80 transition-transform duration-300 group-hover:scale-102">
        <img
          src="/vidyasetu_logo.png"
          alt="VidyaSetu Logo - Har Vidyarthi Ka, Safalta Ka Marg"
          className={`${imgSizeMap[size]} object-contain`}
        />
      </div>
    </div>
  );
}
