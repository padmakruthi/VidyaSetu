'use client';

import React from 'react';

interface IndianFlagProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function IndianFlag({ className = '', size = 'md' }: IndianFlagProps) {
  const dimensions = {
    sm: { width: 24, height: 16 },
    md: { width: 36, height: 24 },
    lg: { width: 48, height: 32 }
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xs overflow-hidden shadow-xs border border-slate-300/40 shrink-0 ${className}`}
      style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
      title="National Flag of India (Tiranga)"
    >
      <svg
        viewBox="0 0 900 600"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Saffron Band */}
        <rect width="900" height="200" fill="#FF9933" />
        {/* Middle White Band */}
        <rect y="200" width="900" height="200" fill="#FFFFFF" />
        {/* Bottom India Green Band */}
        <rect y="400" width="900" height="200" fill="#138808" />

        {/* Ashoka Chakra Wheel */}
        <g transform="translate(450, 300)">
          {/* Outer Ring */}
          <circle r="82" fill="none" stroke="#000080" strokeWidth="9" />
          {/* Center Hub */}
          <circle r="18" fill="#000080" />
          {/* 24 Spokes */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2="0"
              y2="-82"
              stroke="#000080"
              strokeWidth="4"
              transform={`rotate(${i * 15})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
