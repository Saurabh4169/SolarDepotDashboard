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
      'bg-gradient-to-r from-cantaloupe-400 via-cantaloupe-500 to-cantaloupe-600 hover:from-cantaloupe-400 hover:via-cantaloupe-400 hover:to-cantaloupe-500 hover:-translate-y-[1px] active:translate-y-0 text-white shadow-[0_4px_16px_rgba(252,115,77,0.45)] hover:shadow-[0_6px_24px_rgba(252,115,77,0.6)]',
    secondary:
      'bg-gradient-to-r from-electric-400 via-electric-500 to-electric-600 hover:from-electric-400 hover:to-electric-500 hover:-translate-y-[1px] active:translate-y-0 text-white shadow-[0_4px_16px_rgba(2,151,222,0.4)] hover:shadow-[0_6px_22px_rgba(2,151,222,0.55)]',
    navy:
      'bg-[linear-gradient(135deg,#02070A_0%,#071B2A_55%,#0b2436_100%)] border border-white/14 hover:border-white/30 hover:-translate-y-[1px] active:translate-y-0 text-white shadow-sm',
    outline:
      'glass-light border border-[#0297DE]/30 hover:border-[#0297DE]/50 text-navy hover:bg-[#EAF6FC] hover:-translate-y-[1px]',
    ghost:
      'bg-transparent hover:bg-[#EAF6FC] text-slate-700 active:bg-[#DDF1FA]',
    subtle:
      'bg-[#EAF6FC] text-electric-600 hover:bg-[#DDF1FA] active:bg-electric-100',
    danger:
      'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-sm hover:shadow-[0_4px_16px_rgba(244,63,94,0.35)]',
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

