import React from 'react';
import { Sun } from 'lucide-react';

export default function PageLoader({ fullScreen = false, message = 'Loading dashboard...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy text-white selection:bg-electric-500/20">
        {/* Ambient glow backgrounds */}
        <div className="absolute w-72 h-72 rounded-full bg-electric-500/15 blur-3xl pointer-events-none -translate-y-8" />
        <div className="absolute w-56 h-56 rounded-full bg-cantaloupe-500/10 blur-2xl pointer-events-none translate-y-12" />

        <div className="relative flex flex-col items-center gap-5">
          {/* Logo with spinning electric ring and cantaloupe glow */}
          <div className="relative flex items-center justify-center">
            {/* Spinning electric ring */}
            <div className="absolute w-20 h-20 rounded-full border-2 border-electric-500/20 border-t-electric-400 border-r-electric-500 animate-spin" />
            
            {/* Cantaloupe soft pulsing halo */}
            <div className="absolute w-14 h-14 rounded-full bg-cantaloupe-500/20 animate-pulse-glow" />

            {/* Logo Center Tile */}
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-electric-400 to-electric-600 shadow-glow flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Branding & text */}
          <div className="text-center space-y-1.5">
            <h2 className="font-display text-lg font-bold tracking-tight text-white">
              Solar<span className="text-electric-400">Depot</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-md bg-electric-500/20 text-electric-300 border border-electric-400/30 uppercase tracking-wider">
                Admin
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-electric-500/20 border-t-electric-500 animate-spin" />
        <Sun className="w-4 h-4 text-electric-500 absolute" />
      </div>
      <p className="text-xs font-medium text-slate-400">{message}</p>
    </div>
  );
}

