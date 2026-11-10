import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Custom Styled Select Component (Highlander / Solar Depot Admin Design)
 *
 * - Height: 44px (h-11)
 * - Radius: 12px (rounded-xl)
 * - Border: border-slate-200 hover:border-slate-300
 * - Focus: focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
 * - Right: ChevronDown icon with pointer-events-none
 * - Supports options prop or direct option children
 */
const Select = forwardRef(function Select(
  {
    label,
    required = false,
    error,
    helperText,
    options = [],
    value,
    onChange,
    name,
    placeholder,
    disabled = false,
    className = '',
    containerClassName = '',
    children,
    ...props
  },
  ref
) {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 select-none">
          {label}
          {required && <span className="text-cantaloupe-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full h-11 px-3.5 pr-10
            rounded-xl bg-white text-navy text-[14px] font-medium
            border border-slate-200 hover:border-slate-300
            focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
            transition-all duration-150 appearance-none cursor-pointer
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.length > 0
            ? options.map((opt) => {
                const optVal = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={optVal} value={optVal} className="py-1 text-slate-800">
                    {optLabel}
                  </option>
                );
              })
            : children}
        </select>

        {/* Custom Chevron Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
          <ChevronDown className="w-4 h-4 transition-transform group-focus-within:rotate-180" />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-[12px] font-medium text-rose-600 animate-fade-in">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1 text-[12px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
});

export default Select;

