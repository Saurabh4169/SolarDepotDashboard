import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const variants = {
    primary:
      'bg-cantaloupe-500 hover:bg-cantaloupe-600 hover:-translate-y-[1px] active:bg-cantaloupe-700 active:translate-y-0 text-white shadow-orange shadow-sm hover:shadow-orange',
    secondary:
      'bg-electric-500 hover:bg-electric-600 hover:-translate-y-[1px] active:bg-electric-700 active:translate-y-0 text-white shadow-glow shadow-sm hover:shadow-glow-lg',
    navy:
      'bg-navy hover:bg-navy-700 hover:-translate-y-[1px] active:bg-midnight active:translate-y-0 text-white shadow-sm',
    outline:
      'border border-electric-500/30 hover:border-electric-500 bg-white/50 text-navy hover:bg-iceblue/80',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 active:bg-slate-200',
    subtle:
      'bg-iceblue text-electric-700 hover:bg-paleblue active:bg-electric-100',
    danger:
      'bg-rose-500 hover:bg-rose-600 hover:-translate-y-[1px] active:bg-rose-700 text-white shadow-sm',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1.5 h-7',
    sm: 'px-3 py-1.5 text-xs gap-1.5 h-8',
    md: 'px-4 py-2.5 text-sm gap-2 h-10',
    lg: 'px-5 py-3 text-base gap-2.5 h-12',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}

