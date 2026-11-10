import React from 'react';
import { useSearchParams } from 'react-router-dom';
import EnquiryForm from '../../components/forms/EnquiryForm';

export default function RequestQuotePage() {
  const [searchParams] = useSearchParams();
  const initialProduct = searchParams.get('product') || '';
  const initialSolution = searchParams.get('solution') || '';
  const initialType = searchParams.get('type') || (initialSolution ? 'System Design Consultation' : 'Product Quote');

  const initialSelection = initialProduct || initialSolution || '';

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-cantaloupe-600 block">
          Consultation & Sizing
        </span>
        <h1 className="font-display text-lg font-bold text-navy">
          Request an Engineering Quote
        </h1>
        <p className="text-[11px] text-slate-500">
          Direct inquiry to Solar Depot technical sales desk for project sizing and equipment proposals.
        </p>
      </div>

      <EnquiryForm
        initialSelection={initialSelection}
        initialType={initialType}
      />
    </div>
  );
}

