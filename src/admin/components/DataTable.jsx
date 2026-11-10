import React from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { TableRowSkeleton } from './Skeleton';
import EmptyState from './EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filterNode,
  actionNode,
  sortColumn,
  sortDirection = 'asc',
  onSort,
  pagination,
  onPageChange,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search criteria or add new data.',
  onRowClick,
}) {
  return (
    <div className="glass-light rounded-[20px] overflow-hidden flex flex-col">
      {/* Top Filter and Search Toolbar */}
      {(onSearchChange || filterNode || actionNode) && (
        <div className="p-4 sm:p-5 border-b border-[#071B2A]/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70">
          <div className="flex flex-1 items-center gap-3 flex-wrap">
            {onSearchChange && (
              <div className="relative min-w-[240px] max-w-sm flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-[14px] bg-white/90 border border-[#0297DE]/18 focus:outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 text-navy placeholder:text-slate-400 transition-all shadow-sm"
                />
              </div>
            )}

            {filterNode && (
              <div className="flex items-center gap-2 flex-wrap">
                {filterNode}
              </div>
            )}
          </div>

          {actionNode && (
            <div className="flex items-center gap-2 shrink-0">
              {actionNode}
            </div>
          )}
        </div>
      )}

      {/* Table responsive container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#071B2A]/[0.06] bg-[#EAF6FC]/70 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-500 select-none">
              {columns.map((col) => {
                const isSortable = Boolean(col.sortable && onSort);
                const isCurrent = sortColumn === col.accessor;

                return (
                  <th
                    key={col.accessor || col.header}
                    onClick={() => isSortable && onSort(col.accessor)}
                    className={`py-3.5 px-4 font-semibold ${col.className || ''} ${
                      isSortable ? 'cursor-pointer hover:text-electric-600 transition-colors' : ''
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 ${
                        col.className?.includes('text-center') || col.cellClassName?.includes('text-center')
                          ? 'justify-center'
                          : col.className?.includes('text-right') || col.cellClassName?.includes('text-right')
                          ? 'justify-end'
                          : ''
                      }`}
                    >
                      <span>{col.header}</span>
                      {isSortable && (
                        <span className="shrink-0 text-slate-400">
                          {isCurrent ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-electric-600" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-electric-600" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#071B2A]/[0.06] text-[14px] text-slate-700">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRowSkeleton key={idx} columns={columns.length} />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`
                    h-16 transition-colors duration-150
                    hover:bg-electric-500/[0.06]
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((col) => (
                    <td
                      key={col.accessor || col.header}
                      className={`py-3.5 px-4 align-middle ${col.cellClassName || ''}`}
                    >
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="px-5 py-3.5 border-t border-[#071B2A]/[0.06] flex items-center justify-between text-[13px] text-slate-500 bg-white/70">
          <div>
            Showing <span className="font-semibold text-navy">{Math.min(pagination.total, (pagination.page - 1) * pagination.limit + 1)}</span> to{' '}
            <span className="font-semibold text-navy">
              {Math.min(pagination.total, pagination.page * pagination.limit)}
            </span>{' '}
            of <span className="font-semibold text-navy">{pagination.total}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-xl border border-[#0297DE]/18 bg-white text-slate-600 hover:bg-[#EAF6FC] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3.5 py-1.5 font-semibold text-navy bg-[#EAF6FC] border border-[#0297DE]/20 rounded-xl tabular-nums">
              {pagination.page} / {pagination.totalPages || 1}
            </span>

            <button
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-xl border border-[#0297DE]/18 bg-white text-slate-600 hover:bg-[#EAF6FC] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
