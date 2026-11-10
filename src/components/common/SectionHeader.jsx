import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function SectionHeader({
  eyebrow,
  title,
  actionText,
  actionLink,
  onActionClick,
  className = '',
}) {
  return (
    <div className={`flex items-end justify-between mb-3 px-1 ${className}`}>
      <div>
        {eyebrow && (
          <span className="block text-[10px] font-bold uppercase tracking-wider text-electric-600 mb-0.5">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-base font-bold text-navy tracking-tight">
          {title}
        </h2>
      </div>

      {(actionText && (actionLink || onActionClick)) && (
        actionLink ? (
          <Link
            to={actionLink}
            className="flex items-center gap-0.5 text-xs font-semibold text-electric-600 hover:text-electric-700 active:opacity-70 transition-opacity"
          >
            <span>{actionText}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onActionClick}
            className="flex items-center gap-0.5 text-xs font-semibold text-electric-600 hover:text-electric-700 active:opacity-70 transition-opacity"
          >
            <span>{actionText}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )
      )}
    </div>
  );
}

