import React, { useState } from 'react';
import { X, Download, Share2, ZoomIn, ZoomOut, Check, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';

export default function PdfViewerModal() {
  const { pdfViewerDoc, closePdfViewer, showToast } = useApp();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  if (!pdfViewerDoc) return null;

  const pages = pdfViewerDoc.previewPages || [
    {
      page: 1,
      title: 'Technical Overview & Scope',
      content: pdfViewerDoc.description || 'Solar Depot product specifications and dimensional data.',
    },
  ];

  const totalPages = pages.length;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadComplete(true);
      showToast(`Downloaded: ${pdfViewerDoc.title}`, 'success');
      setTimeout(() => setDownloadComplete(false), 2500);
    }, 900);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pdfViewerDoc.title,
        text: `Technical document: ${pdfViewerDoc.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${window.location.origin}/downloads?doc=${pdfViewerDoc.id}`);
      showToast('Document link copied to clipboard', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-sm h-[88vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10">
        {/* PDF Top Bar */}
        <div className="h-14 px-3.5 bg-midnight flex items-center justify-between border-b border-white/10 text-white shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-lg bg-electric-500/20 text-electric-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold truncate leading-tight">{pdfViewerDoc.title}</h3>
              <p className="text-[10px] text-slate-400">
                {pdfViewerDoc.format} • {pdfViewerDoc.size} • {pdfViewerDoc.version || 'v1.0'}
              </p>
            </div>
          </div>

          <button
            onClick={closePdfViewer}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 shrink-0"
            aria-label="Close document preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="h-10 px-3 bg-midnight-100 flex items-center justify-between text-xs text-slate-300 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="p-1 rounded hover:bg-white/10"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
              className="p-1 rounded hover:bg-white/10"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Document Sheet Viewer Area */}
        <div className="flex-1 overflow-auto p-3 bg-slate-950 flex items-center justify-center custom-scrollbar">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full bg-white text-navy rounded-xl shadow-2xl p-5 min-h-[460px] flex flex-col justify-between transition-transform duration-200"
          >
            <div>
              {/* Document Header Logo */}
              <div className="flex items-center justify-between border-b-2 border-electric-500 pb-3 mb-4">
                <div>
                  <div className="font-display text-sm font-black tracking-tight text-navy">
                    SOLAR <span className="text-electric-500">DEPOT</span>
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">
                    Technical Engineering Library
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-electric-50 text-electric-700 text-[9px] font-bold">
                    OFFICIAL SPECIFICATION
                  </span>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                    Doc ID: {pdfViewerDoc.id.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Page Content */}
              <div className="mb-4">
                <span className="text-[10px] font-bold text-electric-600 uppercase tracking-wider block mb-1">
                  Section {currentPage + 1}: {pages[currentPage]?.title || 'Specifications'}
                </span>
                <h4 className="font-display text-sm font-bold text-navy mb-2">
                  {pdfViewerDoc.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {pages[currentPage]?.content}
                </p>
              </div>

              {/* Technical Blueprint Graphic Mock */}
              <div className="p-3 bg-iceblue/40 border border-electric-200/50 rounded-xl mb-4">
                <div className="text-[10px] font-semibold text-electric-700 mb-1 flex items-center justify-between">
                  <span>Electrical Interconnect Topology</span>
                  <span className="font-mono text-[9px]">IEEE 1547 / UL 1741</span>
                </div>
                <div className="h-20 bg-white rounded border border-dashed border-electric-300 flex items-center justify-center p-2 text-center">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span className="p-1 bg-slate-100 rounded border">PV String</span>
                    <span>➔</span>
                    <span className="p-1 bg-electric-100 text-electric-800 rounded font-semibold border border-electric-300">
                      Inverter MPPT
                    </span>
                    <span>➔</span>
                    <span className="p-1 bg-slate-100 rounded border">AC Panel</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span>Solar Depot USA • 121 A East 89 St, New York</span>
              <span>Page {currentPage + 1} of {totalPages}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 bg-midnight border-t border-white/10 flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            icon={downloadComplete ? Check : Download}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Saving PDF...' : downloadComplete ? 'Downloaded!' : `Download (${pdfViewerDoc.size})`}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            icon={Share2}
            onClick={handleShare}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}

