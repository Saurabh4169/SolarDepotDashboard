import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function AdminToast() {
  const { adminToast, hideAdminToast } = useAdmin();

  if (!adminToast || !adminToast.visible) return null;

  const getIcon = () => {
    switch (adminToast.type) {
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
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-midnight/95 backdrop-blur-md border border-electric-500/30 text-white shadow-soft-lg animate-fade-in text-xs font-medium max-w-md">
      <div className="flex items-center gap-2.5">
        {getIcon()}
        <span>{adminToast.message}</span>
      </div>
      <button
        onClick={hideAdminToast}
        className="p-1 text-slate-400 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

