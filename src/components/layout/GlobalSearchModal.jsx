import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Zap, Layers, FolderGit2, FileText, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLiveProducts } from '../../data/productsData';
import { solutions } from '../../data/solutionsData';
import { projects } from '../../data/projectsData';
import { resources } from '../../data/resourcesData';

export default function GlobalSearchModal() {
  const { globalSearchOpen, setGlobalSearchOpen, openPdfViewer } = useApp();
  const { products } = useLiveProducts();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], solutions: [], projects: [], resources: [], total: 0 };

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
    );

    const matchedSolutions = solutions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );

    const matchedProjects = projects.filter(
      (pr) =>
        pr.title.toLowerCase().includes(q) ||
        pr.category.toLowerCase().includes(q) ||
        pr.location.toLowerCase().includes(q) ||
        pr.description.toLowerCase().includes(q)
    );

    const matchedResources = resources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.model && r.model.toLowerCase().includes(q))
    );

    const total =
      matchedProducts.length +
      matchedSolutions.length +
      matchedProjects.length +
      matchedResources.length;

    return {
      products: matchedProducts,
      solutions: matchedSolutions,
      projects: matchedProjects,
      resources: matchedResources,
      total,
    };
  }, [query, products]);

  if (!globalSearchOpen) return null;

  const handleClose = () => {
    setGlobalSearchOpen(false);
    setQuery('');
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  const handleOpenDoc = (doc) => {
    handleClose();
    openPdfViewer(doc);
  };

  const popularChips = [
    'Hybrid Inverter',
    '3kW String',
    'Microinverter',
    'Energy Storage',
    'Commercial',
    'Datasheet',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-12 animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-navy text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-electric-400" />
            <h3 className="font-display text-sm font-bold tracking-tight">Search Solar Depot</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input box */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, models, projects..."
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-electric-500 shadow-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          {!query && (
            <div className="mt-2.5">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-electric-600 hover:border-electric-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar divide-y divide-slate-100">
          {query && searchResults.total === 0 && (
            <div className="py-8 text-center">
              <p className="text-xs font-semibold text-navy mb-1">No results matching "{query}"</p>
              <p className="text-[11px] text-slate-400">
                Try searching for 'hybrid', 'microinverter', 'storage', or model numbers like 'SD-SP'.
              </p>
            </div>
          )}

          {/* Products Results */}
          {searchResults.products.length > 0 && (
            <div className="py-2.5 first:pt-0">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-electric-600 mb-2">
                <Zap className="w-3 h-3" /> Products ({searchResults.products.length})
              </span>
              <div className="space-y-1.5">
                {searchResults.products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleNavigate(`/products/${p.slug}`)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-navy truncate group-hover:text-electric-600">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Model: {p.model} • {p.category}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-electric-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Solutions Results */}
          {searchResults.solutions.length > 0 && (
            <div className="py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cantaloupe-600 mb-2">
                <Layers className="w-3 h-3" /> Solutions ({searchResults.solutions.length})
              </span>
              <div className="space-y-1.5">
                {searchResults.solutions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleNavigate(`/solutions/${s.slug}`)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-navy truncate group-hover:text-electric-600">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{s.tagline}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-electric-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Results */}
          {searchResults.projects.length > 0 && (
            <div className="py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                <FolderGit2 className="w-3 h-3" /> Case Studies ({searchResults.projects.length})
              </span>
              <div className="space-y-1.5">
                {searchResults.projects.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => handleNavigate(`/projects/${pr.slug}`)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={pr.image}
                        alt={pr.title}
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-navy truncate group-hover:text-electric-600">
                          {pr.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {pr.location} • {pr.capacity}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-electric-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resources Results */}
          {searchResults.resources.length > 0 && (
            <div className="py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-2">
                <FileText className="w-3 h-3" /> Technical Documents ({searchResults.resources.length})
              </span>
              <div className="space-y-1.5">
                {searchResults.resources.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleOpenDoc(r)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-navy truncate group-hover:text-electric-600">
                          {r.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {r.format} • {r.size} • {r.category}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-electric-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

