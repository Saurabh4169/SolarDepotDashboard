import React from 'react';

/**
 * Custom Toggle Switch Component
 */
export default function Toggle({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  name,
  className = '',
}) {
  return (
    <label
      className={`
        flex items-center justify-between gap-4 p-3.5 rounded-xl border border-[#0297DE]/18 bg-white/90
        transition-all duration-150 cursor-pointer select-none
        hover:border-[#0297DE]/32
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className="min-w-0 flex-1">
        {label && (
          <div className="text-[13px] font-semibold text-slate-700 leading-tight">
            {label}
          </div>
        )}
        {description && (
          <div className="text-[12px] text-slate-400 mt-0.5 leading-snug">
            {description}
          </div>
        )}
      </div>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-all duration-200 ease-in-out
            bg-slate-200 peer-focus:ring-2 peer-focus:ring-electric-500/20
            peer-checked:bg-gradient-to-r peer-checked:from-electric-400 peer-checked:to-electric-600
            peer-checked:shadow-glow
          `}
        />
        <div
          className={`
            absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-sm
            transition-transform duration-200 ease-in-out transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </div>
    </label>
  );
}

