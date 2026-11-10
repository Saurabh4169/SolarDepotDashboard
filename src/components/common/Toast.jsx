import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, hideToast } = useApp();

  if (!toast.visible) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-electric-400 shrink-0" />;
    }
  };

  return (
    <div className="absolute top-16 left-4 right-4 z-50 flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-midnight/95 backdrop-blur-md border border-electric-500/30 text-white shadow-lg animate-fade-in text-xs font-medium">
      <div className="flex items-center gap-2.5">
        {getIcon()}
        <span>{toast.message}</span>
      </div>
      <button
        onClick={hideToast}
        className="p-1 text-slate-400 hover:text-white transition-colors"
        aria-label="Close toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

