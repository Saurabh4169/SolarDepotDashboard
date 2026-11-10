import React from 'react';

export default function Badge({
  children,
  variant = 'electric',
  size = 'sm',
  className = '',
  icon: Icon,
}) {
  const variants = {
    electric: 'bg-electric-50 text-electric-600 border border-electric-200',
    cantaloupe: 'bg-orange-50 text-cantaloupe-600 border border-orange-200',
    navy: 'bg-navy/10 text-navy border border-navy/20',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200',
    dark: 'bg-midnight text-white border border-slate-700',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md shrink-0 font-medium ${
        variants[variant] || variants.electric
      } ${sizes[size] || sizes.sm} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

