import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200/70 rounded-lg before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmerSweep_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#0297DE]/12 shadow-soft flex flex-col justify-between h-40">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <div className="space-y-2 mt-4">
        <Skeleton className="w-16 h-3 rounded" />
        <Skeleton className="w-24 h-8 rounded-md" />
        <Skeleton className="w-32 h-3.5 rounded" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-slate-100 h-16">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="py-3.5 px-4">
          <Skeleton className="h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  );
}
