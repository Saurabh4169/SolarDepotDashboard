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

/**
 * Realistic full-content layout skeleton for instantaneous page transitions.
 * Matches real module layout: Title + CTA button, Search toolbar, and structured Table.
 */
export function AdminPageSkeleton() {
  return (
    <div className="w-full flex-1 flex flex-col space-y-8 animate-fade-in">
      {/* Header Pattern Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-48 h-8 rounded-xl" />
          <Skeleton className="w-72 h-4 rounded-lg" />
        </div>
        <Skeleton className="w-36 h-11 rounded-xl" />
      </div>

      {/* Toolbar & Filter Skeleton */}
      <div className="bg-white rounded-2xl border border-[#0297DE]/12 shadow-soft overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-64 h-11 rounded-xl" />
            <Skeleton className="w-36 h-11 rounded-xl" />
          </div>
          <Skeleton className="w-28 h-11 rounded-xl" />
        </div>

        {/* Table Skeleton */}
        <div className="w-full overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F7FAFC] h-12">
                <th className="py-3 px-4 text-left"><Skeleton className="w-24 h-3.5 rounded" /></th>
                <th className="py-3 px-4 text-left"><Skeleton className="w-20 h-3.5 rounded" /></th>
                <th className="py-3 px-4 text-left"><Skeleton className="w-16 h-3.5 rounded" /></th>
                <th className="py-3 px-4 text-left"><Skeleton className="w-16 h-3.5 rounded" /></th>
                <th className="py-3 px-4 text-center"><Skeleton className="w-14 h-3.5 rounded mx-auto" /></th>
                <th className="py-3 px-4 text-center"><Skeleton className="w-12 h-3.5 rounded mx-auto" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, idx) => (
                <TableRowSkeleton key={idx} columns={6} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
