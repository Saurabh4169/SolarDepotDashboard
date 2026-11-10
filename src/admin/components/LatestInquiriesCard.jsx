import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function LatestInquiriesCard({ enquiries = [], onViewEnquiry }) {
  const displayItems = enquiries.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#0297DE]/12 shadow-soft flex flex-col justify-between h-full">
      {/* Header with Title and "View all" Link */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-display text-[18px] font-semibold text-navy leading-tight">
            Latest Inquiries
          </h3>
          <p className="text-[14px] text-slate-500 mt-1">
            Recent customer quote requests
          </p>
        </div>

        <Link
          to="/admin/enquiries"
          className="text-[13px] font-semibold text-electric-600 hover:text-electric-700 flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 flex-1 my-2">
        {displayItems.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-slate-400">
            No inquiries logged yet
          </div>
        ) : (
          displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onViewEnquiry && onViewEnquiry(item)}
              className="py-3.5 px-2 flex items-center justify-between gap-4 group hover:bg-iceblue/50 rounded-xl transition-colors cursor-pointer"
            >
              {/* Left Details: Line 1 (Name + Pill), Line 2 (Product) */}
              <div className="min-w-0 flex-1 space-y-1">
                {/* Line 1: Name + Status Pill */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[14px] font-semibold text-navy group-hover:text-electric-600 transition-colors truncate">
                    {item.contact?.name || 'Customer'}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                {/* Line 2: Product */}
                <p className="text-[13px] text-slate-600 truncate">
                  {item.productOrSolution || 'Solar Inverter System'}
                </p>
              </div>

              {/* Right: Date */}
              <span className="text-[12px] text-slate-400 tabular-nums shrink-0">
                {item.date}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
