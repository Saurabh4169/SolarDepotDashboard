import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

/**
 * ActionMenu
 * Reusable dropdown menu triggered by a 3-dot button.
 * Uses ReactDOM.createPortal and fixed positioning to guarantee
 * it is never clipped by table overflow-x-auto, cards, or page boundaries.
 *
 * @param {Array} items - Array of menu items:
 *   - { label, icon: LucideIcon, onClick, danger?: boolean, disabled?: boolean, title?: string }
 *   - or { divider: true }
 * @param {string} align - 'right' (default) or 'left'
 * @param {string} buttonClassName - Custom classes for the trigger button
 */
export default function ActionMenu({
  items = [],
  align = 'right',
  buttonClassName = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0, left: 0, openUpward: false });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < 200 && rect.top > 200;

    setCoords({
      top: openUpward ? rect.top - 6 : rect.bottom + 6,
      bottom: window.innerHeight - rect.top + 6,
      right: window.innerWidth - rect.right,
      left: rect.left,
      openUpward,
    });
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  const visibleItems = items.filter(Boolean);

  return (
    <div className="relative inline-flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      {/* Trigger Button (3 Dots) */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="More actions"
        className={`p-1.5 sm:p-2 rounded-xl transition-all duration-150 focus:outline-none ${
          isOpen
            ? 'bg-slate-100 text-navy ring-1 ring-slate-200'
            : 'text-slate-400 hover:text-navy hover:bg-slate-100'
        } ${buttonClassName}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Floating Dropdown Menu (Portaled) */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: coords.openUpward ? undefined : `${coords.top}px`,
              bottom: coords.openUpward ? `${coords.bottom}px` : undefined,
              ...(align === 'right'
                ? { right: `${Math.max(12, coords.right)}px` }
                : { left: `${Math.max(12, coords.left)}px` }),
              zIndex: 9999,
            }}
            className="w-44 py-1.5 bg-white rounded-xl shadow-soft-lg border border-[#0297DE]/15 focus:outline-none animate-in fade-in zoom-in-95 duration-100 origin-top-right select-none"
          >
            {visibleItems.map((item, idx) => {
              if (item.divider) {
                return <div key={`div-${idx}`} className="my-1 border-t border-slate-100" />;
              }

              const Icon = item.icon;
              const isDanger = Boolean(item.danger);
              const isDisabled = Boolean(item.disabled);

              return (
                <button
                  key={item.label || idx}
                  type="button"
                  role="menuitem"
                  disabled={isDisabled}
                  title={item.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled) {
                      setIsOpen(false);
                      item.onClick && item.onClick(e);
                    }
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium transition-colors text-left group ${
                    isDisabled
                      ? 'opacity-40 cursor-not-allowed text-slate-400'
                      : isDanger
                      ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                      : 'text-slate-700 hover:text-electric-600 hover:bg-iceblue'
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isDisabled
                          ? 'text-slate-300'
                          : isDanger
                          ? 'text-rose-500'
                          : 'text-slate-400 group-hover:text-electric-600'
                      }`}
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}

