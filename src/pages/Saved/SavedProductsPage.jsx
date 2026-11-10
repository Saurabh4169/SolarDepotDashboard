import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Scale, ArrowRight, PackageOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { products, getProductById } from '../../data/productsData';
import ProductCard from '../../components/products/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

export default function SavedProductsPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, compareList, addToCompare } = useApp();

  const savedProducts = favorites
    .map((id) => getProductById(id))
    .filter(Boolean);

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cantaloupe-600 block">
            Favorites
          </span>
          <h1 className="font-display text-lg font-bold text-navy">
            Saved Inverters
          </h1>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {savedProducts.length} Saved
        </span>
      </div>

      {savedProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved inverters yet"
          description="Tap the heart icon on any product or inverter card to save it for quick reference and comparison."
          actionText="Browse Inverter Catalog"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="space-y-3">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} layout="horizontal" />
          ))}
        </div>
      )}
    </div>
  );
}

