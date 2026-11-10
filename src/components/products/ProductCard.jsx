import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Scale, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../common/Badge';
import { formatCapacity } from '../../utils/formatters';

export default function ProductCard({ product, layout = 'vertical' }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToCompare, removeFromCompare, isInCompare } = useApp();

  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product.id);
    }
  };

  if (layout === 'horizontal') {
    return (
      <div
        onClick={() => navigate(`/products/${product.slug}`)}
        className="w-full bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex gap-3 cursor-pointer group"
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              favorite ? 'bg-cantaloupe-500 text-white' : 'bg-white/80 text-slate-500 hover:text-cantaloupe-500'
            }`}
            aria-label="Toggle favorite"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-bold text-electric-600 uppercase tracking-wider truncate">
                {product.model}
              </span>
              <Badge variant="electric" size="xs">
                {formatCapacity(product.capacityKw)}
              </Badge>
            </div>
            <h3 className="font-display text-xs font-bold text-navy truncate group-hover:text-electric-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {product.shortDesc}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-[10px] font-mono text-slate-400">
              {product.phase}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCompareClick}
                className={`p-1 rounded text-xs transition-colors ${
                  inCompare ? 'text-electric-600 font-bold' : 'text-slate-400 hover:text-navy'
                }`}
                title="Compare"
              >
                <Scale className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-electric-600 flex items-center gap-0.5">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/products/${product.slug}`)}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.99] flex flex-col cursor-pointer group"
    >
      {/* Product Image Banner - Only icons visible on the photo */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Favorite & Compare Action Icons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button
            onClick={handleCompareClick}
            className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all active:scale-95 ${
              inCompare
                ? 'bg-electric-500 text-white shadow-glow'
                : 'bg-white/85 text-slate-600 hover:bg-white hover:text-electric-600'
            }`}
            aria-label="Add to comparison"
            title={inCompare ? 'In Comparison' : 'Add to Compare'}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleFavoriteClick}
            className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all active:scale-95 ${
              favorite
                ? 'bg-cantaloupe-500 text-white shadow-orange'
                : 'bg-white/85 text-slate-600 hover:bg-white hover:text-cantaloupe-500'
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Content - Streamlined & Lightweight */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="font-mono font-bold text-electric-600 uppercase tracking-wider truncate mr-1">
              {product.model}
            </span>
            <span className="font-mono font-bold text-navy shrink-0">
              {formatCapacity(product.capacityKw)}
            </span>
          </div>

          <h3 className="font-display text-xs font-bold text-navy leading-snug group-hover:text-electric-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Action Footer */}
        <div className="pt-2 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-medium truncate mr-1">
            {product.phase}
          </span>

          <div className="flex items-center gap-0.5 font-bold text-electric-600 group-hover:translate-x-0.5 transition-transform shrink-0">
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

