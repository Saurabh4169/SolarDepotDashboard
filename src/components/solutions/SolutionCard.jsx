import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BatteryCharging, Zap, Grid, Home, Building2 } from 'lucide-react';
import Badge from '../common/Badge';

const iconMap = {
  BatteryCharging,
  Zap,
  Grid,
  Home,
  Building2,
};

export default function SolutionCard({ solution, layout = 'standard' }) {
  const navigate = useNavigate();
  const IconComponent = iconMap[solution.icon] || Zap;

  const handleClick = () => {
    navigate(`/solutions/${solution.slug}`);
  };

  if (layout === 'compact') {
    return (
      <div
        onClick={handleClick}
        className="w-full bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex gap-3 group"
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={solution.image}
            alt={solution.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="font-display text-xs font-bold text-navy truncate group-hover:text-electric-600 transition-colors">
            {solution.name}
          </h4>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            {solution.tagline}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-electric-600 mt-2">
            <span>View Solution</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer group flex flex-col"
    >
      {/* Solution Image Header */}
      <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
        <img
          src={solution.image}
          alt={solution.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/25 to-transparent" />

        {/* Icon & Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-midnight/70 backdrop-blur-md text-white flex items-center justify-center">
            <IconComponent className="w-3.5 h-3.5 text-cantaloupe-400" />
          </div>
          <Badge variant="dark" size="xs">
            {solution.shortName}
          </Badge>
        </div>

        {/* Title over image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-display text-base font-bold tracking-tight text-white leading-snug drop-shadow-sm">
            {solution.name}
          </h3>
        </div>
      </div>

      {/* Lighter, Readable Content Body */}
      <div className="p-3.5 flex flex-col justify-between">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {solution.tagline}
        </p>

        {/* Card Footer */}
        <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Tailored Engineering
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-electric-600 group-hover:translate-x-1 transition-transform">
            <span>Explore Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

