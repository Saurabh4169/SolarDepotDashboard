import React, { useState, useMemo } from 'react';
import { resources, resourceCategories } from '../../data/resourcesData';
import ResourceCard from '../../components/resources/ResourceCard';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import ScrollReveal from '../../components/common/ScrollReveal';
import { FileText, Download, ShieldCheck } from 'lucide-react';

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Documents');

  const filteredResources = useMemo(() => {
    let list = [...resources];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.model && r.model.toLowerCase().includes(q)) ||
          r.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All Documents') {
      list = list.filter((r) => r.category === selectedCategory);
    }

    return list;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="p-4 pb-12 space-y-4 animate-fade-in">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 block">
          Technical Library
        </span>
        <h1 className="font-display text-lg font-bold text-navy">
          Downloads & Resources
        </h1>
        <p className="text-[11px] text-slate-500">
          Official engineering datasheets, manuals, and compliance certificates.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Search datasheets, models like SD-SP..."
      />

      {/* Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {resourceCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-electric-500 text-white shadow-glow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Document Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>{filteredResources.length} documents available</span>
        <span className="font-mono text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified PDFs
        </span>
      </div>

      {/* Document Cards */}
      {filteredResources.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description="Try adjusting your document category or search keyword."
          actionText="Show All Documents"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All Documents');
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredResources.map((res, idx) => (
            <ScrollReveal key={res.id} delay={Math.min(idx * 60, 240)}>
              <ResourceCard resource={res} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

