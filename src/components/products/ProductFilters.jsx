import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { productCategories } from '../../data/productsData';
import Button from '../common/Button';

export default function ProductFilters({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedPhase,
  onSelectPhase,
  selectedCapacity,
  onSelectCapacity,
  onResetFilters,
  activeFilterCount,
}) {
  if (!isOpen) return null;

  const phases = ['All', 'Single-Phase', 'Three-Phase'];
  const capacityRanges = [
    { id: 'all', label: 'All Capacities' },
    { id: 'under-5', label: 'Under 5 kW (Residential)' },
    { id: '5-15', label: '5 kW – 15 kW (Mid-size)' },
    { id: 'above-15', label: '15 kW+ (Commercial)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-navy text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-sm font-bold tracking-tight">Filter Products</h3>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-cantaloupe-500 text-[10px] font-bold text-white">
                {activeFilterCount} Active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Product Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-electric-500 border-electric-500 text-white shadow-glow'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Categories
              </button>
              {productCategories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-electric-500 border-electric-500 text-white shadow-glow'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.short}
                </button>
              ))}
            </div>
          </div>

          {/* Phase Configuration */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Phase Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {phases.map((ph) => {
                const isSelected =
                  ph === 'All' ? selectedPhase === 'all' : selectedPhase === ph;
                return (
                  <button
                    key={ph}
                    type="button"
                    onClick={() => onSelectPhase(ph === 'All' ? 'all' : ph)}
                    className={`py-2 px-1 rounded-xl border text-center text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-electric-500 border-electric-500 text-white shadow-glow'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {ph}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capacity Range */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Capacity Range
            </label>
            <div className="space-y-1.5">
              {capacityRanges.map((range) => {
                const isSelected = selectedCapacity === range.id;
                return (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => onSelectCapacity(range.id)}
                    className={`w-full py-2 px-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-electric-50 border-electric-400 text-electric-700 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{range.label}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-electric-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={onResetFilters}
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

