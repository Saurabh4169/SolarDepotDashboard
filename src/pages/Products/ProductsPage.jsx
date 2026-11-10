import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Filter,
  Grid as GridIcon,
  List as ListIcon,
  Scale,
  X,
  PackageOpen,
  ArrowRight,
} from 'lucide-react';
import { products, productCategories } from '../../data/productsData';
import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/common/SearchBar';
import ProductCard from '../../components/products/ProductCard';
import ProductFilters from '../../components/products/ProductFilters';
import ProductSort from '../../components/products/ProductSort';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { compareList, clearCompare } = useApp();

  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Filter states
  const categoryParam = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Sort and layout states
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Sync category param if url changes
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
  }, [searchParams]);

  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPhase('all');
    setSelectedCapacity('all');
    searchParams.delete('category');
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedPhase !== 'all') count++;
    if (selectedCapacity !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedPhase, selectedCapacity, searchQuery]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    // Phase
    if (selectedPhase !== 'all') {
      list = list.filter((p) => p.phase && p.phase.includes(selectedPhase));
    }

    // Capacity range
    if (selectedCapacity !== 'all') {
      if (selectedCapacity === 'under-5') {
        list = list.filter((p) => p.capacityKw < 5);
      } else if (selectedCapacity === '5-15') {
        list = list.filter((p) => p.capacityKw >= 5 && p.capacityKw <= 15);
      } else if (selectedCapacity === 'above-15') {
        list = list.filter((p) => p.capacityKw > 15);
      }
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'capacity-desc') return (b.capacityKw || 0) - (a.capacityKw || 0);
      if (sortBy === 'capacity-asc') return (a.capacityKw || 0) - (b.capacityKw || 0);
      if (sortBy === 'efficiency-desc') return (b.efficiency || 0) - (a.efficiency || 0);
      return 0; // featured default
    });

    return list;
  }, [searchQuery, selectedCategory, selectedPhase, selectedCapacity, sortBy]);

  return (
    <div className="p-4 pb-20 space-y-3.5 animate-fade-in relative">
      {/* Header & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-navy">
              Solar Inverters & Products
            </h1>
            <p className="text-[11px] text-slate-500">
              {filteredProducts.length} models matching criteria
            </p>
          </div>

          {/* Grid / List view toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Grid layout"
            >
              <GridIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="List layout"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search by model or capacity..."
          onFilterClick={() => setIsFilterModalOpen(true)}
          hasActiveFilters={activeFilterCount > 0}
        />
      </div>

      {/* Quick Category Chips Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => handleSelectCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-navy text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All ({products.length})
        </button>
        {productCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleSelectCategory(cat.slug)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === cat.slug
                ? 'bg-electric-500 text-white shadow-glow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.short} ({cat.count})
          </button>
        ))}
      </div>

      {/* Sort & Active Filter status bar */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <ProductSort sortBy={sortBy} onSortChange={setSortBy} />

        {activeFilterCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600"
          >
            <X className="w-3 h-3" />
            <span>Clear ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No inverters found"
          description="No products match your current filters. Try resetting the category or capacity filter."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 gap-3'
              : 'flex flex-col space-y-2.5'
          }
        >
          {filteredProducts.map((p, idx) => (
            <ScrollReveal key={p.id} delay={Math.min(idx * 50, 200)}>
              <ProductCard
                product={p}
                layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
              />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Filter Modal Sheet */}
      <ProductFilters
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        selectedPhase={selectedPhase}
        onSelectPhase={setSelectedPhase}
        selectedCapacity={selectedCapacity}
        onSelectCapacity={setSelectedCapacity}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Floating Compare Action Bar if products selected */}
      {compareList.length > 0 && (
        <div className="sticky bottom-2 z-30 w-full p-3 rounded-2xl bg-midnight/95 backdrop-blur-md border border-electric-500/40 text-white shadow-2xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-electric-500/20 text-electric-400 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">
                {compareList.length} Inverter{compareList.length > 1 ? 's' : ''} Selected
              </span>
              <span className="text-[10px] text-slate-400">
                Ready for side-by-side spec audit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={clearCompare}
              className="text-[10px] text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <Button
              variant="secondary"
              size="xs"
              iconRight={ArrowRight}
              onClick={() => navigate('/compare')}
            >
              Compare
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

