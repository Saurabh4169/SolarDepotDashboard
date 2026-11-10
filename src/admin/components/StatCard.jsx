import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  chipVariant = 'electric', // 'electric' | 'cantaloupe'
  badgeText,
  onClick,
}) {
  const chipStyles = {
    electric: 'bg-iceblue border-[#0297DE]/15 text-electric-600',
    cantaloupe: 'bg-[#FC734D]/10 border-[#FC734D]/25 text-cantaloupe-500',
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-2xl p-6 border border-[#0297DE]/12 shadow-soft
        hover:shadow-soft-lg hover:border-[#0297DE]/30 hover:-translate-y-0.5
        transition-all duration-200 flex flex-col justify-between
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Top Row: Icon Chip + Optional 'N New' Badge only */}
      <div className="flex items-center justify-between gap-3">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
            chipStyles[chipVariant] || chipStyles.electric
          }`}
        >
          {Icon && <Icon className="w-5 h-5" strokeWidth={2.2} />}
        </div>

        {badgeText && (
          <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-cantaloupe-50 text-cantaloupe-600 border border-cantaloupe-200">
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Stat Block */}
      <div className="mt-5">
        <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-500 block mb-1.5">
          {title}
        </span>
        <div className="font-display text-[32px] font-bold text-navy tracking-tight leading-none tabular-nums">
          {value}
        </div>
        {subtext && (
          <p className="text-[13px] text-slate-500 font-normal mt-2 leading-relaxed line-clamp-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
