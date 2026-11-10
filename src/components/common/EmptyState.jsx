import React from 'react';
import Button from './Button';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText,
  onAction,
  actionLink,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 my-4 rounded-2xl bg-white border border-slate-100 shadow-sm ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-electric-50 flex items-center justify-center text-electric-500 mb-3.5 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display text-base font-bold text-navy mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">{description}</p>
      {actionText && (
        actionLink ? (
          <Button size="sm" variant="secondary" onClick={() => window.location.href = actionLink}>
            {actionText}
          </Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={onAction}>
            {actionText}
          </Button>
        )
      )}
    </div>
  );
}

