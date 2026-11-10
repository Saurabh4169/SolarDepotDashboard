import React from 'react';
import { useLiveProducts } from '../../data/productsData';
import ProductCategoryCard from '../../components/products/ProductCategoryCard';
import { Layers } from 'lucide-react';

export default function CategoriesPage() {
  const { categories } = useLiveProducts();

  return (
    <div className="p-4 pb-8 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 block">
            Solar Depot Catalog
          </span>
          <h2 className="font-display text-lg font-bold text-navy">
            Product Categories
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {categories.length} Categories
        </span>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <ProductCategoryCard key={cat.slug} category={cat} compact={false} />
        ))}
      </div>
    </div>
  );
}

