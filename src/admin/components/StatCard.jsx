import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  chipVariant = 'blue', // 'blue' | 'green' | 'purple' | 'orange' | 'electric' | 'cantaloupe'
  badgeText,
  onClick,
}) {
  const chipStyles = {
    blue: 'bg-[#E6F3FB] border-[#0297DE]/20 text-[#0297DE]',
    green: 'bg-[#E5F7EE] border-[#10B981]/20 text-[#10B981]',
    purple: 'bg-[#F1E8FD] border-[#8B5CF6]/20 text-[#8B5CF6]',
    orange: 'bg-[#FFEDE6] border-[#FC734D]/20 text-[#FC734D]',
    electric: 'bg-[#E6F3FB] border-[#0297DE]/20 text-[#0297DE]',
    cantaloupe: 'bg-[#FFEDE6] border-[#FC734D]/20 text-[#FC734D]',
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative glass-light glass-hover rounded-2xl p-4 flex flex-col justify-between
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Top Row: Icon Chip + Optional 'N New' Badge only */}
      <div className="flex items-center justify-between gap-2.5">
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
            chipStyles[chipVariant] || chipStyles.blue
          }`}
        >
          {Icon && <Icon className="w-4.5 h-4.5" strokeWidth={2.2} />}
        </div>

        {badgeText && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-cantaloupe-400 to-cantaloupe-600 text-white shadow-orange tracking-wide">
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Stat Block */}
      <div className="mt-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-500 block mb-1">
          {title}
        </span>
        <div className="font-display text-[26px] font-bold text-navy tracking-tight leading-none tabular-nums">
          {value}
        </div>
        {subtext && (
          <p className="text-[12px] text-slate-500 font-normal mt-1 leading-snug line-clamp-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
