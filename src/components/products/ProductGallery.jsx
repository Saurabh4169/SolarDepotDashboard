import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ProductGallery({ images = [], name = 'Product' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const galleryList = images.length > 0 ? images : ['https://images.pexels.com/photos/38171111/pexels-photo-38171111.jpeg?auto=compress&cs=tinysrgb&w=1920'];

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full">
      {/* Main Image Frame */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80">
        <img
          src={galleryList[activeIndex]}
          alt={`${name} view ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Navigation arrows if multiple */}
        {galleryList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-midnight/60 hover:bg-midnight/80 backdrop-blur-md text-white flex items-center justify-center transition-all active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-midnight/60 hover:bg-midnight/80 backdrop-blur-md text-white flex items-center justify-center transition-all active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-midnight/70 backdrop-blur-md text-[10px] font-mono text-white">
          {activeIndex + 1} / {galleryList.length}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {galleryList.length > 1 && (
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar py-1">
          {galleryList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                activeIndex === idx
                  ? 'border-electric-500 scale-105 shadow-glow'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

