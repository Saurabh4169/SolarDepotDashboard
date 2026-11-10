import React from 'react';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  if (!status) return null;

  const normalized = String(status).trim();

  let colorClasses = 'bg-[#E6F3FB] text-[#0297DE] border-[#0297DE]/20';
  let dotColor = 'bg-[#0297DE]';

  if (['Active', 'Operational', 'Completed', 'Verified', 'Paid'].includes(normalized)) {
    // Emerald
    colorClasses = 'bg-[#E5F7EE] text-[#059669] border-[#10B981]/25';
    dotColor = 'bg-[#10B981]';
  } else if (['In Review', 'Engineering Review', 'Processing'].includes(normalized)) {
    // Amber
    colorClasses = 'bg-[#FFFBEB] text-[#D97706] border-[#F59E0B]/25';
    dotColor = 'bg-[#F59E0B]';
  } else if (['Pending', 'Quote Prepared', 'Quote', 'Submitted', 'Submitted (Demo)'].includes(normalized)) {
    // Cantaloupe
    colorClasses = 'bg-[#FFEDE6] text-[#FC734D] border-[#FC734D]/25';
    dotColor = 'bg-[#FC734D]';
  } else if (['Rejected', 'Critical', 'Failed'].includes(normalized)) {
    // Rose
    colorClasses = 'bg-[#FFF1F2] text-[#E11D48] border-[#F43F5E]/25';
    dotColor = 'bg-[#F43F5E]';
  } else if (['Closed', 'Inactive', 'Replied', 'Archived', 'Draft'].includes(normalized)) {
    // Slate
    colorClasses = 'bg-[#F1F5F9] text-[#64748B] border-[#94A3B8]/25';
    dotColor = 'bg-[#94A3B8]';
  } else if (['New', 'Standard', 'Open'].includes(normalized)) {
    // Electric
    colorClasses = 'bg-[#E6F3FB] text-[#0297DE] border-[#0297DE]/20';
    dotColor = 'bg-[#0297DE]';
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
