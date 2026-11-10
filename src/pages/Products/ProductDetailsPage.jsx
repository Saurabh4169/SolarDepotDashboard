import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Scale,
  FileDown,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Cpu,
  PackageOpen,
} from 'lucide-react';
import { getProductBySlug, getRelatedProducts, products } from '../../data/productsData';
import { resources } from '../../data/resourcesData';
import { useApp } from '../../context/AppContext';
import ProductGallery from '../../components/products/ProductGallery';
import ProductSpecifications from '../../components/products/ProductSpecifications';
import ProductCard from '../../components/products/ProductCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatCapacity } from '../../utils/formatters';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    toggleFavorite,
    isFavorite,
    addToCompare,
    removeFromCompare,
    isInCompare,
    openPdfViewer,
    showToast,
  } = useApp();

  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="p-4">
        <EmptyState
          icon={PackageOpen}
          title="Product not found"
          description="The inverter you are looking for may have been updated or moved."
          actionText="Browse Inverters"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);
  const related = getRelatedProducts(product, 2);

  // Matching datasheet in resources
  const datasheet = resources.find(
    (r) => r.productId === product.id || r.title.toLowerCase().includes(product.model.toLowerCase())
  ) || resources[0];

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product.id);
    }
  };

  const handleDatasheetPreview = () => {
    if (datasheet) {
      openPdfViewer(datasheet);
    } else {
      showToast('Datasheet currently updating', 'info');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-full animate-fade-in relative">
      <div className="p-4 space-y-5 flex-1 pb-6">
        {/* Top Gallery */}
      <ProductGallery images={product.gallery} name={product.name} />

      {/* Product Title & Basic Info */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="electric" size="sm">
            {product.category}
          </Badge>
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
            <span className="font-bold text-navy">{product.model}</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">{product.warranty}</span>
          </div>
        </div>

        <h1 className="font-display text-lg font-bold text-navy leading-snug">
          {product.name}
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed">
          {product.description}
        </p>

        {/* Quick Spec Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
              Rated Power
            </span>
            <span className="font-display text-xs font-bold text-navy">
              {formatCapacity(product.capacityKw)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
              Efficiency
            </span>
            <span className="font-display text-xs font-bold text-electric-600">
              {product.efficiency}%
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
              Phase Type
            </span>
            <span className="font-display text-xs font-bold text-navy truncate block">
              {product.phase}
            </span>
          </div>
        </div>
      </div>

      {/* Datasheet & Documentation Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-iceblue to-paleblue/60 border border-electric-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="w-9 h-9 rounded-xl bg-electric-500 text-white flex items-center justify-center shrink-0 shadow-glow">
            <FileDown className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-navy truncate">
              Technical Datasheet (PDF)
            </h4>
            <p className="text-[10px] text-slate-500 font-mono">
              {product.model} • {product.datasheetSize}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="xs"
          onClick={handleDatasheetPreview}
        >
          View PDF
        </Button>
      </div>

      {/* Grouped Specifications & Highlights */}
      <div>
        <h3 className="font-display text-sm font-bold text-navy mb-3">
          Engineering Specifications
        </h3>
        <ProductSpecifications
          specGroups={product.specGroups}
          highlights={product.highlights}
        />
      </div>

      {/* Related Inverters */}
      {related.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-bold text-navy">
              Related {product.category}
            </h3>
            <Link
              to={`/products?category=${product.categorySlug}`}
              className="text-xs font-bold text-electric-600 hover:text-electric-700"
            >
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center gap-2 z-30 shrink-0">
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all active:scale-95 ${
            favorite
              ? 'bg-cantaloupe-500 border-cantaloupe-500 text-white shadow-orange'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Add to favorites"
          title="Save Product"
        >
          <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleCompareToggle}
          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all active:scale-95 ${
            inCompare
              ? 'bg-electric-500 border-electric-500 text-white shadow-glow'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Add to compare"
          title={inCompare ? 'Remove from compare' : 'Add to compare'}
        >
          <Scale className="w-5 h-5" />
        </button>

        <Button
          variant="primary"
          size="md"
          className="flex-1"
          icon={MessageSquare}
          onClick={() =>
            navigate(
              `/request-quote?product=${encodeURIComponent(
                `${product.model} (${product.name})`
              )}`
            )
          }
        >
          Request Quote
        </Button>
      </div>
    </div>
  );
}

