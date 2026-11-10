import React from 'react';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  if (!status) return null;

  const normalized = String(status).trim();

  let colorClasses = 'bg-electric-50 text-electric-700 border-electric-200';
  let dotColor = 'bg-electric-500';

  if (['Quote Prepared', 'Paid', 'Active', 'Operational', 'Completed', 'Verified'].includes(normalized)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (['Pending', 'In Review', 'Engineering Review', 'Submitted (Demo)'].includes(normalized)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (['Rejected', 'Closed', 'Inactive', 'Critical'].includes(normalized)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (['Replied', 'Archived', 'Draft'].includes(normalized)) {
    colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    dotColor = 'bg-slate-400';
  } else if (['New', 'Standard'].includes(normalized)) {
    colorClasses = 'bg-electric-50 text-electric-700 border-electric-200';
    dotColor = 'bg-electric-500';
  }

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[12px] font-semibold gap-1.5',
    sm: 'px-2.5 py-0.5 text-[12px] font-semibold gap-1.5',
    md: 'px-3 py-1 text-[12px] font-semibold gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shrink-0 transition-all ${
        sizeClasses[size] || sizeClasses.sm
      } ${colorClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="leading-none">{normalized}</span>
    </span>
  );
}
