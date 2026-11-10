import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showClose = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in select-none">
      {/* Soft Dark Backdrop */}
      <div
        className="fixed inset-0 bg-[#071B2A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-[-20px_20px_50px_rgba(0,0,0,0.35)] border border-[#0297DE]/15 overflow-hidden z-10 my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-[#F7FAFC]">
            <div>
              <h3 className="font-display text-[18px] font-semibold text-navy leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[13px] text-slate-500 mt-1">{subtitle}</p>
              )}
            </div>

            {showClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-navy hover:bg-slate-200/60 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[calc(85vh-8rem)] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
