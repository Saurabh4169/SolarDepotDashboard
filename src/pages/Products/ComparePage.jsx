import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Scale,
  X,
  Plus,
  Trash2,
  ArrowRight,
  Check,
  Zap,
  RotateCcw,
  PackageOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { products, getProductById } from '../../data/productsData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatCapacity } from '../../utils/formatters';

export default function ComparePage() {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  const selectedProducts = compareList
    .map((id) => getProductById(id))
    .filter(Boolean);

  const availableToAdd = products.filter((p) => !compareList.includes(p.id));

  // Specifications list to compare side-by-side
  const comparisonRows = [
    {
      label: 'Rated Power',
      getValue: (p) => formatCapacity(p.capacityKw),
    },
    {
      label: 'Max Efficiency',
      getValue: (p) => `${p.efficiency}%`,
    },
    {
      label: 'Phase Type',
      getValue: (p) => p.phase || 'N/A',
    },
    {
      label: 'Category',
      getValue: (p) => p.category,
    },
    {
      label: 'Warranty',
      getValue: (p) => p.warranty,
    },
    {
      label: 'Protection Rating',
      getValue: (p) => {
        const mech = p.specGroups?.find((g) => g.label.toLowerCase().includes('mech'));
        const rating = mech?.specs?.find((s) => s.label.includes('Protection'))?.value;
        return rating || 'IP65';
      },
    },
    {
      label: 'Dimensions',
      getValue: (p) => {
        const mech = p.specGroups?.find((g) => g.label.toLowerCase().includes('mech'));
        const dim = mech?.specs?.find((s) => s.label.includes('Dimensions'))?.value;
        return dim || 'N/A';
      },
    },
    {
      label: 'Weight',
      getValue: (p) => {
        const mech = p.specGroups?.find((g) => g.label.toLowerCase().includes('mech'));
        const weight = mech?.specs?.find((s) => s.label.includes('Weight'))?.value;
        return weight || 'N/A';
      },
    },
    {
      label: 'Operating Temp',
      getValue: (p) => {
        const mech = p.specGroups?.find((g) => g.label.toLowerCase().includes('mech'));
        const temp = mech?.specs?.find((s) => s.label.includes('Temp'))?.value;
        return temp || '-25°C to 60°C';
      },
    },
  ];

  if (selectedProducts.length === 0) {
    return (
      <div className="p-4 pb-12 animate-fade-in">
        <EmptyState
          icon={Scale}
          title="No inverters in comparison"
          description="Browse products and tap the compare icon on any inverter to see side-by-side specifications."
          actionText="Browse Inverters"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-4 animate-fade-in">
      {/* Compare Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 block">
            Technical Audit
          </span>
          <h2 className="font-display text-base font-bold text-navy">
            Comparing {selectedProducts.length} Inverter{selectedProducts.length > 1 ? 's' : ''}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {compareList.length < 4 && (
            <Button
              variant="subtle"
              size="xs"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add
            </Button>
          )}

          <button
            onClick={clearCompare}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            title="Clear comparison"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Difference toggle */}
      <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl text-xs">
        <span className="text-slate-600 font-medium">Highlight differences</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={highlightDifferences}
            onChange={(e) => setHighlightDifferences(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-electric-500" />
        </label>
      </div>

      {/* Comparison Matrix Table (Horizontally Scrollable) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left border-collapse min-w-[340px]">
            {/* Table Header: Product Cards */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-3 w-28 min-w-[110px] text-[10px] font-bold text-slate-400 uppercase tracking-wider align-top">
                  Parameter
                </th>
                {selectedProducts.map((p) => (
                  <th key={p.id} className="p-3 w-40 min-w-[140px] align-top">
                    <div className="relative flex flex-col justify-between h-full space-y-2">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-200 hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-20 rounded-xl object-cover border border-slate-200"
                      />

                      <div>
                        <span className="font-mono text-[10px] font-bold text-electric-600 block">
                          {p.model}
                        </span>
                        <h4 className="font-display text-xs font-bold text-navy line-clamp-1 leading-tight">
                          {p.name}
                        </h4>
                      </div>

                      <Button
                        variant="secondary"
                        size="xs"
                        fullWidth
                        onClick={() => navigate(`/products/${p.slug}`)}
                      >
                        View
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body: Grouped rows */}
            <tbody className="divide-y divide-slate-100">
              {comparisonRows.map((row, idx) => {
                const values = selectedProducts.map((p) => row.getValue(p));
                const allSame = values.every((v) => v === values[0]);
                const isDifferent = !allSame && selectedProducts.length > 1;

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      highlightDifferences && isDifferent
                        ? 'bg-amber-50/50 font-medium'
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="p-3 font-semibold text-slate-500 text-[11px] align-middle">
                      {row.label}
                      {highlightDifferences && isDifferent && (
                        <span className="block text-[9px] text-amber-600 font-normal">
                          Differs
                        </span>
                      )}
                    </td>
                    {selectedProducts.map((p) => (
                      <td
                        key={p.id}
                        className="p-3 text-navy font-semibold align-middle font-mono text-xs"
                      >
                        {row.getValue(p)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-2 sm:p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 bg-navy text-white flex items-center justify-between shrink-0">
              <h3 className="font-display text-sm font-bold">
                Add Inverter to Compare
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {availableToAdd.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  All available inverters are already selected.
                </p>
              ) : (
                availableToAdd.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      addToCompare(p.id);
                      setIsAddModalOpen(false);
                    }}
                    className="p-2.5 rounded-2xl border border-slate-100 hover:border-electric-300 hover:bg-electric-50/30 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-electric-600 font-mono">
                          {p.model}
                        </span>
                        <h4 className="text-xs font-bold text-navy truncate">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {p.phase} • {formatCapacity(p.capacityKw)}
                        </span>
                      </div>
                    </div>
                    <Button variant="subtle" size="xs">
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

