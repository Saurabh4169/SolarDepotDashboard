import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';

// Global configuration: supports 'right' or 'left'
export const DRAWER_SIDE = 'right';

/**
 * Full-height Slide-Over Drawer Portal (Highlander Admin Style)
 *
 * - Rendered via ReactDOM.createPortal into document.body
 * - Full-screen overlay with backdrop-blur
 * - 100dvh height, 560px standard / 720px large width, inner edge rounded (24px)
 * - Three fixed zones: Header (fixed), Body (scrollable), Footer (fixed, never overlaps)
 * - Smooth cubic-bezier(0.16, 1, 0.3, 1) enter/exit transitions
 * - Body scroll lock, ESC handler, focus management, accessibility attributes
 * - Unsaved changes confirmation dialog if isDirty is true
 */
export default function Drawer({
  isOpen,
  onClose,
  isDirty = false,
  chip,
  title,
  subtitle,
  children,
  footer,
  size = 'md', // 'md' = 560px, 'lg' = 720px, 'xl' = 840px
  side = DRAWER_SIDE,
  ariaLabel,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const panelRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Determine width class
  const widthClasses = {
    md: 'w-full sm:w-[560px] max-w-[100vw]',
    lg: 'w-full sm:w-[720px] max-w-[100vw]',
    xl: 'w-full sm:w-[840px] max-w-[100vw]',
    '2xl': 'w-full sm:w-[1180px] max-w-[100vw]',
  }[size] || 'w-full sm:w-[560px] max-w-[100vw]';

  // Mount/Unmount with smooth exit animation
  useEffect(() => {
    let timeoutId;
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      setIsMounted(true);
      // Double requestAnimationFrame to ensure initial CSS class is applied before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      timeoutId = setTimeout(() => {
        setIsMounted(false);
        document.body.style.overflow = '';
        if (previousActiveElement.current && previousActiveElement.current.focus) {
          previousActiveElement.current.focus();
        }
      }, 300); // matches animation duration
    }

    return () => {
      clearTimeout(timeoutId);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Request Close handler with unsaved changes check
  const handleRequestClose = useCallback(() => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  // Keyboard navigation: ESC key handling & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (showDiscardConfirm) {
          setShowDiscardConfirm(false);
        } else {
          handleRequestClose();
        }
      }

      // Simple focus trap inside panel
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showDiscardConfirm, handleRequestClose]);

  if (!isMounted && !isOpen) return null;

  const isRight = side === 'right';

  // Translate transform classes
  const panelTransform = isRight
    ? isVisible
      ? 'translate-x-0'
      : 'translate-x-full'
    : isVisible
    ? 'translate-x-0'
    : '-translate-x-full';

  // Rounded inner edge
  const roundedClass = isRight ? 'sm:rounded-l-[24px]' : 'sm:rounded-r-[24px]';

  return createPortal(
    <div
      className="drawer-portal-root fixed inset-0 z-[100] overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title || 'Details Drawer'}
    >
      {/* 1. Backdrop Overlay (Covers entire screen, header & sidebar included) */}
      <div
        className={`
          fixed inset-0 bg-[#02070A]/55 backdrop-blur-[4px] transition-opacity duration-300 ease-out
          ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleRequestClose}
        aria-hidden="true"
      />

      {/* 2. Slide-over Panel */}
      <div
        ref={panelRef}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`
          fixed top-0 bottom-0 ${isRight ? 'right-0' : 'left-0'}
          h-[100dvh] max-h-[100dvh]
          ${widthClasses}
          ${roundedClass}
          bg-white shadow-[-25px_0_60px_-15px_rgba(0,0,0,0.45)]
          flex flex-col z-[101] overflow-hidden
          transition-transform duration-300 transform ${panelTransform}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* FIXED ZONE 1: HEADER (Dark Gradient with Orange Line)    */}
        {/* ======================================================== */}
        <div
          style={{
            background: 'linear-gradient(135deg, #02070A 0%, #071B2A 55%, #0b2436 100%)',
          }}
          className="relative px-6 py-5 shrink-0 select-none overflow-hidden border-b border-white/[0.08]"
        >
          {/* Subtle Glossy Highlight */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at top left, rgba(255,255,255,0.12) 0%, transparent 70%)',
            }}
          />

          {/* Thin Glowing Cantaloupe Line at Header Bottom Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-cantaloupe-500/80 via-cantaloupe-400/40 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {chip && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-dark border border-white/20 text-electric-300 text-[11px] font-semibold tracking-wider uppercase mb-1.5 tabular-nums">
                  {chip}
                </div>
              )}
              <h2 className="font-display text-[22px] font-semibold text-white leading-tight truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[13px] text-white/70 mt-1 line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleRequestClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 text-white/80 hover:text-white flex items-center justify-center transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FIXED ZONE 2: BODY (Scrollable, never overlaps footer)  */}
        {/* ======================================================== */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 bg-[#F7FAFC]">
          {children}
        </div>

        {/* ======================================================== */}
        {/* FIXED ZONE 3: FOOTER (Sticky at bottom, glass-light)    */}
        {/* ======================================================== */}
        {footer && (
          <div className="px-6 py-4 glass-light border-t border-[#0297DE]/14 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] shrink-0 z-20">
            {footer}
          </div>
        )}
      </div>

      {/* Unsaved Changes Confirmation Dialog (Z-index above drawer) */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-soft-lg border border-rose-200 animate-scale-up space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-display text-[18px] font-semibold text-navy leading-tight">
                Discard unsaved changes?
              </h3>
              <p className="text-[14px] text-slate-500 mt-1 leading-normal">
                You have modified form fields that have not been saved. If you leave now, these edits will be lost.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDiscardConfirm(false)}
              >
                Keep Editing
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose();
                }}
              >
                Discard Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

/**
 * Reusable Drawer Card Section
 */
export function DrawerSection({ title, action, children, className = '' }) {
  return (
    <div
      className={`glass-light rounded-[20px] border border-[#0297DE]/14 p-5 shadow-soft space-y-3.5 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between pb-1 border-b border-[#071B2A]/[0.06]">
          <h4 className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </h4>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
