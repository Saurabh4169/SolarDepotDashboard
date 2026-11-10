import React from 'react';
import { Sun } from 'lucide-react';

export default function PageLoader({ fullScreen = false, message = 'Loading dashboard...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[linear-gradient(135deg,#02070A_0%,#071B2A_55%,#0b2436_100%)] text-white select-none">
        {/* Ambient glow backgrounds */}
        <div className="absolute w-80 h-80 rounded-full bg-electric-500/20 blur-3xl pointer-events-none -translate-y-8" />
        <div className="absolute w-72 h-72 rounded-full bg-cantaloupe-500/15 blur-2xl pointer-events-none translate-y-12" />

        {/* Centered Glass-Dark Card */}
        <div className="relative glass-dark px-10 py-8 rounded-3xl border border-white/14 flex flex-col items-center gap-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
          {/* Logo with spinning electric ring and cantaloupe accent */}
          <div className="relative flex items-center justify-center">
            {/* Spinning electric ring with cantaloupe accent */}
            <div className="absolute w-20 h-20 rounded-full border-2 border-electric-500/20 border-t-electric-400 border-r-cantaloupe-500 animate-spin" />
            
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
            <p className="text-xs text-slate-300 font-sans">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 min-h-[calc(100dvh-180px)] flex flex-col items-center justify-center gap-3 text-slate-500 my-auto">
      <div className="relative flex items-center justify-center">
        <div className="w-11 h-11 rounded-full border-2 border-electric-500/20 border-t-electric-500 animate-spin" />
        <Sun className="w-5 h-5 text-electric-500 absolute" />
      </div>
      <p className="text-[13px] font-medium text-slate-400">{message}</p>
    </div>
  );
}

