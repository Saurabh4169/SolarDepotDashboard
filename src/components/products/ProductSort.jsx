import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function ProductSort({ sortBy, onSortChange, className = '' }) {
  const options = [
    { value: 'featured', label: 'Featured' },
    { value: 'name-asc', label: 'Name (A–Z)' },
    { value: 'name-desc', label: 'Name (Z–A)' },
    { value: 'capacity-desc', label: 'Capacity (High–Low)' },
    { value: 'capacity-asc', label: 'Capacity (Low–High)' },
    { value: 'efficiency-desc', label: 'Highest Efficiency' },
  ];

  return (
    <div className={`flex items-center gap-1.5 text-xs ${className}`}>
      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className="text-[11px] font-medium text-slate-500 shrink-0">Sort:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-transparent font-semibold text-navy text-xs focus:outline-none cursor-pointer border-none py-0.5 pr-2"
        aria-label="Sort products"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-navy">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

