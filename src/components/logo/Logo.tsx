/**
 * MIJHAR - Original Vector Logo Component
 * Magnifying lens integrated with a contemporary 8-point Islamic geometric star.
 * Supports standalone icon, horizontal lockup, Arabic lockup, English lockup, and monochrome.
 */

import React from 'react';

export type LogoVariant = 'icon' | 'horizontal' | 'arabic-only' | 'english-only' | 'stacked';

interface LogoProps {
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  monochrome?: boolean;
  className?: string;
}

export const MijharIconSvg: React.FC<{ size?: number; monochrome?: boolean; className?: string }> = ({
  size = 40,
  monochrome = false,
  className = '',
}) => {
  const primaryColor = monochrome ? 'currentColor' : '#147D64';
  const darkColor = monochrome ? 'currentColor' : '#0B3D2E';
  const goldColor = monochrome ? 'currentColor' : '#C7A45B';
  const lightColor = monochrome ? 'transparent' : '#F7F4EC';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="MIJHAR Logo Icon"
    >
      <defs>
        <linearGradient id="mijharGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor={primaryColor} />
          <stop offset="1" stopColor={darkColor} />
        </linearGradient>
      </defs>

      {/* Outer rounded geometric container */}
      <rect x="6" y="6" width="88" height="88" rx="20" fill="url(#mijharGrad)" />

      {/* Subtle inner geometric boundary */}
      <rect x="10" y="10" width="80" height="80" rx="16" stroke={goldColor} strokeWidth="1" strokeOpacity="0.4" fill="none" />

      {/* Magnifying Lens Rim */}
      <circle cx="45" cy="45" r="25" fill={darkColor} stroke={goldColor} strokeWidth="3.5" />
      <circle cx="45" cy="45" r="20" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="3 2" fill="none" />

      {/* Diagonal Magnifying Lens Handle with Islamic faceted end */}
      <path
        d="M63 63 L82 82 M82 82 L86 78 M82 82 L78 86"
        stroke={goldColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Precise 8-Point Islamic Star Motif Centered Inside the Lens */}
      <g transform="translate(45, 45)">
        {/* Square 1 */}
        <polygon
          points="0,-13 9,-9 13,0 9,9 0,13 -9,9 -13,0 -9,-9"
          fill={goldColor}
          opacity="0.9"
        />
        {/* Overlaid Rotated Square 2 (45 degrees) */}
        <polygon
          points="-9,-9 0,-13 9,-9 13,0 9,9 0,13 -9,9 -13,0"
          fill={goldColor}
          transform="rotate(45)"
          opacity="0.9"
        />
        {/* Micro focal point */}
        <circle cx="0" cy="0" r="3.2" fill={darkColor} stroke={goldColor} strokeWidth="1" />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  monochrome = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 30, textTitle: 'text-lg', textSub: 'text-[9px]' },
    md: { icon: 38, textTitle: 'text-2xl', textSub: 'text-[11px]' },
    lg: { icon: 48, textTitle: 'text-3xl', textSub: 'text-xs' },
    xl: { icon: 64, textTitle: 'text-4xl', textSub: 'text-sm' },
  };

  const { icon, textTitle, textSub } = sizeMap[size];

  if (variant === 'icon') {
    return <MijharIconSvg size={icon} monochrome={monochrome} className={className} />;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <MijharIconSvg size={icon} monochrome={monochrome} />

      <div className="flex flex-col justify-center leading-tight">
        {variant !== 'english-only' && (
          <div className="flex items-baseline gap-2">
            <span
              className={`font-arabic font-bold tracking-tight ${textTitle} ${
                monochrome ? 'text-current' : 'text-[#082B23]'
              }`}
            >
              مِجهر
            </span>
            {variant === 'horizontal' && (
              <span
                className={`font-english font-semibold tracking-wider uppercase text-xs opacity-75 ${
                  monochrome ? 'text-current' : 'text-[#147D64]'
                }`}
              >
                MIJHAR
              </span>
            )}
          </div>
        )}

        {variant === 'english-only' && (
          <span
            className={`font-english font-bold tracking-wider uppercase ${textTitle} ${
              monochrome ? 'text-current' : 'text-[#082B23]'
            }`}
          >
            MIJHAR
          </span>
        )}

        <span
          className={`font-arabic font-medium opacity-80 ${textSub} ${
            monochrome ? 'text-current' : 'text-[#66736C]'
          }`}
        >
          التحقق من المحتوى الإسلامي
        </span>
      </div>
    </div>
  );
};
