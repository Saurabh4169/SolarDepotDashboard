import React, { useState } from 'react';
import { FileText, Download, Eye, Share2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../common/Badge';

export default function ResourceCard({ resource }) {
  const { openPdfViewer, showToast } = useApp();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (e) => {
    e.stopPropagation();
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      showToast(`Downloaded: ${resource.title}`, 'success');
      setTimeout(() => setDownloaded(false), 2500);
    }, 800);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Document link copied', 'info');
    }
  };

  return (
    <div
      onClick={() => openPdfViewer(resource)}
      className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md hover:border-electric-200 transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-electric-50 text-electric-600 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-electric-500 group-hover:text-white transition-all">
            <FileText className="w-5 h-5" />
          </div>
          <Badge variant="electric" size="xs">
            {resource.format}
          </Badge>
        </div>

        <h4 className="font-display text-xs font-bold text-navy group-hover:text-electric-600 transition-colors line-clamp-2 leading-snug mb-1">
          {resource.title}
        </h4>

        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {resource.description}
        </p>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
          <span>{resource.size}</span>
          <span>•</span>
          <span>{resource.version}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors"
            title="Share document"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className={`p-1.5 rounded-lg transition-all ${
              downloaded
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-electric-600 hover:bg-electric-50'
            }`}
            title="Download document"
          >
            {downloaded ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openPdfViewer(resource)}
            className="px-2.5 py-1 rounded-lg bg-electric-500 text-white font-semibold text-[11px] hover:bg-electric-600 active:scale-95 transition-all flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}

