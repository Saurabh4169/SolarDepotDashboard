import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from '../../components/common/Button';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'Try adjusting your search filters or add a new record to get started.',
  actionText,
  actionIcon,
  onAction,
}) {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-center text-electric-600 mb-3.5 shadow-sm">
        <Icon className="w-7 h-7 stroke-[1.8]" />
      </div>
      <h4 className="font-display text-[18px] font-semibold text-navy mb-1.5">{title}</h4>
      <p className="text-[14px] text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" icon={actionIcon} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
