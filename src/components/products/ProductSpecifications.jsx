import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Wrench, Shield, CheckCircle2 } from 'lucide-react';

export default function ProductSpecifications({ specGroups = [], highlights = [] }) {
  // Open the first group by default
  const [openGroups, setOpenGroups] = useState({ 0: true, 1: true });

  const toggleGroup = (index) => {
    setOpenGroups((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getGroupIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes('elect')) return Cpu;
    if (l.includes('mech')) return Wrench;
    return Shield;
  };

  return (
    <div className="space-y-4">
      {/* Key Highlights */}
      {highlights.length > 0 && (
        <div className="bg-electric-50/60 rounded-2xl p-3.5 border border-electric-100">
          <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-electric-600" />
            Key Engineering Highlights
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-500 mt-1.5 shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grouped Spec Tables */}
      <div className="space-y-2.5">
        {specGroups.map((group, idx) => {
          const isOpen = openGroups[idx];
          const IconComponent = getGroupIcon(group.label);

          return (
            <div
              key={group.label}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleGroup(idx)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-display text-xs font-bold text-navy uppercase tracking-wider">
                    {group.label} Specifications
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-3 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                  {group.specs.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      className="py-2 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-500 font-medium">
                        {spec.label}
                      </span>
                      <span className="font-semibold text-navy text-right font-mono">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

