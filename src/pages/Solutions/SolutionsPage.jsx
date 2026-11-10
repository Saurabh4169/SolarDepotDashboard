import React from 'react';
import { solutions } from '../../data/solutionsData';
import SolutionCard from '../../components/solutions/SolutionCard';
import ScrollReveal from '../../components/common/ScrollReveal';
import { Layers } from 'lucide-react';

export default function SolutionsPage() {
  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 block">
            System Architecture
          </span>
          <h1 className="font-display text-lg font-bold text-navy">
            Intelligent Solar Solutions
          </h1>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {solutions.length} Solutions
        </span>
      </div>

      <div className="space-y-4">
        {solutions.map((sol, idx) => (
          <ScrollReveal key={sol.id} delay={idx * 80}>
            <SolutionCard solution={sol} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

