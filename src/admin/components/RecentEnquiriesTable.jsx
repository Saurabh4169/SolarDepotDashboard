import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import ActionMenu from './ActionMenu';

export default function RecentEnquiriesTable({ enquiries = [], onViewEnquiry }) {
  const displayItems = enquiries.slice(0, 5);

  return (
    <div className="glass-light glass-hover rounded-[20px] p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#071B2A]/[0.06]">
        <div>
          <h3 className="font-display text-[18px] font-semibold text-navy leading-tight">
            Recent Enquiries & Quotes
          </h3>
          <p className="text-[14px] text-slate-500 mt-1">
            Latest partner inquiries and technical sizing reviews
          </p>
        </div>

        <Link
          to="/admin/enquiries"
          className="text-[13px] font-semibold text-electric hover:text-electric-600 flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto custom-scrollbar my-2">
        <table className="w-full text-left border-collapse min-w-[580px]">
          <thead>
            <tr className="border-b border-[#071B2A]/[0.06] bg-[#EAF6FC]/70 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-500 select-none">
              <th className="py-3.5 px-4">Ref #</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Product / Solution</th>
              <th className="py-3.5 px-4">Capacity</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#071B2A]/[0.06] text-[14px] text-slate-700">
            {displayItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[13px] text-slate-400">
                  No records to display
                </td>
              </tr>
            ) : (
              displayItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onViewEnquiry && onViewEnquiry(item)}
                  className="h-16 hover:bg-electric-500/[0.06] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-electric-600 tabular-nums">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-navy group-hover:text-electric-600 transition-colors">
                      {item.contact?.name || 'Customer'}
                    </div>
                    <div className="text-[12px] text-slate-400 truncate max-w-[140px] tabular-nums">
                      {item.contact?.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-[180px] truncate font-normal text-slate-700">
                    {item.productOrSolution}
                  </td>
                  <td className="py-3.5 px-4 font-normal text-slate-600 tabular-nums">
                    {item.capacity || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[13px] whitespace-nowrap tabular-nums">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <ActionMenu
                        items={[
                          {
                            label: 'View Details',
                            icon: Eye,
                            onClick: () => onViewEnquiry && onViewEnquiry(item),
                          },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
