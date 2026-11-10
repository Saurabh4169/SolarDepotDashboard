import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search inverters, models, solutions...',
  onFilterClick,
  hasActiveFilters = false,
  className = '',
}) {
  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-9 rounded-xl bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-electric-400 text-xs sm:text-sm text-navy placeholder:text-slate-400 transition-all outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 active:scale-95"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className={`relative h-10 w-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
            hasActiveFilters
              ? 'bg-electric-500 border-electric-600 text-white shadow-glow'
              : 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200'
          }`}
          aria-label="Filter options"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cantaloupe-500 ring-2 ring-white" />
          )}
        </button>
      )}
    </div>
  );
}

