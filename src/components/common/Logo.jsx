import React from 'react';
import { Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', light = false, linkTo = '/', iconOnly = false }) {
  const iconSizes = {
    sm: 'h-6 w-6 rounded-lg',
    md: 'h-8 w-8 rounded-xl',
    lg: 'h-10 w-10 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const content = (
    <div className="flex items-center gap-2 group select-none">
      <span
        className={`relative flex ${iconSizes[size]} items-center justify-center bg-gradient-to-br from-electric-400 to-electric-600 shadow-glow transition-transform duration-300 group-active:scale-95 shrink-0`}
      >
        <Sun className="h-4 w-4 text-white animate-spin-slow" strokeWidth={2.5} />
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/30" />
      </span>
      {!iconOnly && (
        <span className={`font-display ${textSizes[size]} font-bold tracking-tight shrink-0 ${light ? 'text-white' : 'text-navy'}`}>
          Solar<span className="text-electric-500">Depot</span>
        </span>
      )}
    </div>
  );

  if (!linkTo) return content;

  return (
    <Link to={linkTo} aria-label="Solar Depot Home">
      {content}
    </Link>
  );
}

