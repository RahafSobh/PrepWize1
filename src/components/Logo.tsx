/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const dims = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-11 h-11';
  
  return (
    <div id="creative-logo-shell" className={`relative flex items-center justify-center select-none group cursor-pointer ${dims} ${className}`}>
      {/* Outer ambient blur circle */}
      <span className="absolute inset-0 rounded-2xl bg-radial from-emerald-400/30 to-amber-400/0 opacity-60 group-hover:opacity-100 group-hover:scale-115 blur-md transition-all duration-300 pointer-events-none" />
      
      {/* Multi-layered dynamic orbit frame */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(16,185,129,0.2)]"
      >
        <defs>
          <linearGradient id="orbit-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" /> {/* Emerald */}
            <stop offset="50%" stopColor="#f59e0b" /> {/* Amber */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
          </linearGradient>
          <linearGradient id="orbit-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" /> {/* Pink */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* Purple */}
          </linearGradient>
        </defs>

        {/* Outer Orbit loop (anti-clockwise rotation on hover) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#orbit-grad-1)"
          strokeWidth="3.5"
          strokeDasharray="60 40"
          className="origin-center animate-[spin_10s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite_reverse]"
        />

        {/* Inner Orbit Loop (clockwise slow rotation) */}
        <circle
          cx="50"
          cy="50"
          r="26"
          stroke="url(#orbit-grad-2)"
          strokeWidth="3.2"
          strokeDasharray="30 20 10 20"
          className="origin-center animate-[spin_7s_linear_infinite_reverse] group-hover:animate-[spin_2.5s_linear_infinite]"
        />

        {/* Central Core glowing light */}
        <circle
          cx="50"
          cy="50"
          r="11"
          fill="#09090b"
          stroke="#ffffff"
          strokeWidth="1.5"
          className="transition-all duration-300 group-hover:scale-110"
        />
        
        {/* Inside dot flash */}
        <circle
          cx="50"
          cy="50"
          r="5"
          fill="#10b981"
          className="animate-ping opacity-75 origin-center"
        />
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="#10b981"
        />
      </svg>
    </div>
  );
}
