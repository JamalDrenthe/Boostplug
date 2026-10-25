import React from 'react';

export interface BoostPlugLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  subtitle?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function BoostPlugEmblem({
  size = 'md',
  className = '',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeMap = {
    xs: { badge: 'w-7 h-7', dot: 'w-1.5 h-1.5', gap: 'gap-1' },
    sm: { badge: 'w-8 h-8', dot: 'w-2 h-2', gap: 'gap-1' },
    md: { badge: 'w-10 h-10', dot: 'w-2.5 h-2.5', gap: 'gap-1.5' },
    lg: { badge: 'w-12 h-12', dot: 'w-3 h-3', gap: 'gap-2' },
    xl: { badge: 'w-16 h-16', dot: 'w-4 h-4', gap: 'gap-2.5' },
  };

  const { badge, dot, gap } = sizeMap[size];

  return (
    <div className={`relative ${badge} flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer Obsidian / Atelier Gold Rim */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1C2331] to-[#090B0F] border border-[#E5C583]/30 group-hover:border-[#E5C583]/80 group-hover:shadow-[0_0_15px_rgba(229,197,131,0.3)] transition-all duration-300" />
      
      {/* Interconnected Dual Pulse Nodes: Emerald (Streams) & Champagne Gold (Reviews) */}
      <div className={`relative flex ${gap} items-center z-10`}>
        <div
          className={`${dot} rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse`}
          title="Streaming & Nodes Engine"
        />
        <div
          className={`${dot} rounded-full bg-[#E5C583] shadow-[0_0_8px_#E5C583] animate-pulse`}
          style={{ animationDelay: '0.5s' }}
          title="Reviews & Atelier Studio"
        />
      </div>
    </div>
  );
}

export function BoostPlugLogo({
  size = 'md',
  showWordmark = true,
  subtitle,
  className = '',
  onClick,
}: BoostPlugLogoProps) {
  const textSizes = {
    xs: { boost: 'text-sm font-bold', plug: 'text-base', sub: 'text-[8px]' },
    sm: { boost: 'text-base font-bold', plug: 'text-lg', sub: 'text-[9px]' },
    md: { boost: 'text-xl font-bold', plug: 'text-2xl', sub: 'text-[10px]' },
    lg: { boost: 'text-2xl font-bold', plug: 'text-3xl', sub: 'text-[11px]' },
    xl: { boost: 'text-3xl font-extrabold', plug: 'text-4xl', sub: 'text-xs' },
  };

  const { boost, plug, sub } = textSizes[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 group select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <BoostPlugEmblem size={size} />

      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline tracking-tight leading-none">
            <span className={`${boost} tracking-tight text-white font-sans`}>
              BOOST
            </span>
            <span className={`font-serif italic ${plug} text-[#E5C583] font-normal ml-0.5`}>
              Plug
            </span>
          </div>
          {subtitle && (
            <span className={`${sub} text-white/40 tracking-[0.2em] uppercase font-mono mt-0.5`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
