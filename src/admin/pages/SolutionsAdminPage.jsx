import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Cpu, Eye, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import Drawer, { DrawerSection } from '../components/Drawer';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../components/Select';
import { useAdmin } from '../context/AdminContext';
import { solutionsService } from '../services/solutionsService';

export default function SolutionsAdminPage() {
  const { showAdminToast } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [solutions, setSolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'edit' | 'add'
  const [activeSolution, setActiveSolution] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    tagline: '',
    description: '',
    image: '/images/solutions/hero-battery.jpg',
    theme: 'light',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadSolutions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await solutionsService.getAll();
      setSolutions(data);
      return data;
    } catch (err) {
      showAdminToast('Failed to load solutions', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [showAdminToast]);

  useEffect(() => {
    loadSolutions();
  }, [loadSolutions]);

  // Synchronize drawer with search params (?drawer=view&id=... or ?drawer=edit&id=... or ?drawer=add)
  useEffect(() => {
    const drawerParam = searchParams.get('drawer');
    const idParam = searchParams.get('id');

    if (solutions.length === 0) return;

    if (drawerParam === 'add') {
      setDrawerMode('add');
      setActiveSolution(null);
      setFormData({
        name: '',
        shortName: '',
        tagline: '',
        description: '',
        image: '/images/solutions/hero-battery.jpg',
        theme: 'light',
      });
      setIsDirty(false);
      setIsDrawerOpen(true);
    } else if ((drawerParam === 'view' || drawerParam === 'edit') && idParam) {
      const found = solutions.find((s) => String(s.id) === String(idParam));
      if (found) {
        setActiveSolution(found);
        setFormData({
          name: found.name || '',
          shortName: found.shortName || '',
          tagline: found.tagline || '',
          description: found.description || '',
          image: found.image || '/images/solutions/hero-battery.jpg',
          theme: found.theme || 'light',
        });
        setDrawerMode(drawerParam);
        setIsDirty(false);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, solutions]);

  const updateDrawerUrl = (mode, id = null) => {
    const params = new URLSearchParams(searchParams);
    if (!mode) {
      params.delete('drawer');
      params.delete('id');
    } else {
      params.set('drawer', mode);
      if (id) params.set('id', id);
      else params.delete('id');
    }
    setSearchParams(params, { replace: true });
  };

  const handleOpenAdd = () => {
    setDrawerMode('add');
    setActiveSolution(null);
    setFormData({
      name: '',
      shortName: '',
      tagline: '',
      description: '',
      image: '/images/solutions/hero-battery.jpg',
      theme: 'light',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
  };

  const handleOpenView = (sol) => {
    setActiveSolution(sol);
    setDrawerMode('view');
    setFormData({
      name: sol.name || '',
      shortName: sol.shortName || '',
      tagline: sol.tagline || '',
      description: sol.description || '',
      image: sol.image || '/images/solutions/hero-battery.jpg',
      theme: sol.theme || 'light',
    });
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', sol.id);
  };

  const handleOpenEdit = (sol) => {
    setActiveSolution(sol);
    setDrawerMode('edit');
    setFormData({
      name: sol.name || '',
      shortName: sol.shortName || '',
      tagline: sol.tagline || '',
      description: sol.description || '',
      image: sol.image || '/images/solutions/hero-battery.jpg',
      theme: sol.theme || 'light',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('edit', sol.id);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsDirty(false);
    updateDrawerUrl(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) errors.name = 'Solution name is required';
    if (!formData.tagline.trim()) errors.tagline = 'Tagline is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAdminToast('Please correct highlighted errors', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (drawerMode === 'edit' && activeSolution) {
        await solutionsService.update(activeSolution.id, formData);
        showAdminToast(`Updated solution "${formData.name}"`, 'success');
      } else {
        await solutionsService.create(formData);
        showAdminToast(`Created solution "${formData.name}"`, 'success');
      }
      setIsDirty(false);
      handleCloseDrawer();
      loadSolutions();
    } catch (err) {
      showAdminToast(err.message || 'Error saving solution', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await solutionsService.remove(deleteTarget.id);
      showAdminToast(`Solution "${deleteTarget.name}" deleted`, 'success');
      setDeleteTarget(null);
      if (activeSolution?.id === deleteTarget.id) {
        handleCloseDrawer();
      }
      loadSolutions();
    } catch (err) {
      showAdminToast(err.message || 'Error deleting solution', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSolutions = useMemo(() => {
    return solutions.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.tagline?.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [solutions, search]);

  const columns = [
    {
      header: 'Solution Architecture',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-iceblue border border-[#0297DE]/20 overflow-hidden shrink-0 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-electric-600" />
          </div>
          <div>
            <div className="font-semibold text-navy text-[14px]">{row.name}</div>
            <div className="text-[12px] text-slate-400 italic line-clamp-1">{row.tagline}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Theme Mode',
      accessor: 'theme',
      cell: (row) => (
        <Badge variant={row.theme === 'dark' ? 'dark' : 'electric'} size="sm">
          {row.theme} mode
        </Badge>
      ),
    },
    {
      header: 'Slug Route',
      accessor: 'slug',
      cell: (row) => (
        <span className="text-[13px] text-slate-500 tabular-nums">/{row.slug}</span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (row) => (
        <span className="text-[14px] text-slate-500 line-clamp-1 max-w-[320px]">
          {row.description}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      className: 'text-center w-24',
      cellClassName: 'text-center',
      cell: (row) => (
        <div className="flex items-center justify-center">
          <ActionMenu
            items={[
              {
                label: 'View Solution',
                icon: Eye,
                onClick: () => handleOpenView(row),
              },
              {
                label: 'Edit Solution',
                icon: Edit2,
                onClick: () => handleOpenEdit(row),
              },
              {
                divider: true,
              },
              {
                label: 'Delete Solution',
                icon: Trash2,
                danger: true,
                onClick: () => setDeleteTarget(row),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Top Header Pattern: Title block left, primary CTA right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[28px] font-semibold text-navy leading-tight">
            Solutions
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            System architectures for energy storage, utility solar farms, and commercial buildings
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Solution
        </Button>
      </div>

      {/* Main Content starts 32px below header */}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={filteredSolutions}
          isLoading={isLoading}
          searchPlaceholder="Search solutions..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleOpenView}
        />
      </div>

      {/* Full-height Highlander Slide-Over Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isDirty={isDirty}
        size="lg"
        chip={
          drawerMode === 'view'
            ? `SOLUTION • ${activeSolution?.slug?.toUpperCase() || 'DETAILS'}`
            : drawerMode === 'edit'
            ? 'EDIT SOLUTION'
            : 'NEW SOLUTION'
        }
        title={
          drawerMode === 'view'
            ? activeSolution?.name || 'Solution Details'
            : drawerMode === 'edit'
            ? `Edit: ${activeSolution?.name || ''}`
            : 'Add New Solution'
        }
        subtitle={
          drawerMode === 'view'
            ? activeSolution?.tagline || 'Engineering solar deployment architecture'
            : 'Configure solar deployment architecture and technical specifications'
        }
        footer={
          drawerMode === 'view' ? (
            <div className="flex items-center justify-between gap-3 w-full">
              <Button variant="outline" size="sm" onClick={handleCloseDrawer}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Edit2}
                onClick={() => {
                  setDrawerMode('edit');
                  updateDrawerUrl('edit', activeSolution?.id);
                }}
              >
                Edit Solution
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseDrawer}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : drawerMode === 'edit'
                  ? 'Save Changes'
                  : 'Add Solution'}
              </Button>
            </div>
          )
        }
      >
        {drawerMode === 'view' && activeSolution && (
          <div className="space-y-5 animate-fade-in">
            {/* Gallery / Image Header */}
            <DrawerSection title="DEPLOYMENT ARCHITECTURE">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={activeSolution.image || '/images/solutions/hero-battery.jpg'}
                  alt={activeSolution.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-navy/70 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
                  1 of 1 Blueprint
                </div>
              </div>
            </DrawerSection>

            {/* Key Figures Highlight Card (Iceblue background) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Target Theme
                </div>
                <div className="text-[18px] font-bold text-navy capitalize mt-0.5">
                  {activeSolution.theme || 'Light'} Mode
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Route Identifier
                </div>
                <div className="text-[15px] font-bold text-electric-600 tabular-nums mt-0.5">
                  /{activeSolution.slug || 'solution'}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Grid Type
                </div>
                <div className="text-[16px] font-bold text-navy mt-0.5">
                  Hybrid / BESS
                </div>
              </div>
            </div>

            {/* Specifications Table */}
            <DrawerSection title="SPECIFICATIONS & PARAMETERS">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Architecture Name</span>
                  <span className="text-navy font-semibold text-right">{activeSolution.name}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Short Alias</span>
                  <span className="text-navy font-semibold text-right">{activeSolution.shortName || '—'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Tagline / Mission</span>
                  <span className="text-navy font-semibold text-right italic max-w-xs">{activeSolution.tagline}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Enclosure Compliance</span>
                  <span className="text-navy font-semibold text-right">NEMA 4X / IP65 Utility Ready</span>
                </div>
              </div>
            </DrawerSection>

            {/* Description Section */}
            <DrawerSection title="SYSTEM OVERVIEW & SCOPE">
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {activeSolution.description || 'No extended description available for this architecture.'}
              </p>
            </DrawerSection>
          </div>
        )}

        {/* EDIT / ADD MODE */}
        {drawerMode !== 'view' && (
          <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
            {/* Section 1: Basic Info */}
            <DrawerSection title="BASIC INFORMATION">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Solution Name <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Energy Storage Systems"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px]
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all
                      ${formErrors.name ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Short Name
                    </label>
                    <input
                      type="text"
                      value={formData.shortName}
                      onChange={(e) => handleInputChange('shortName', e.target.value)}
                      placeholder="e.g. ESS / Storage"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>

                  <Select
                    label="Theme Mode"
                    value={formData.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    options={[
                      { value: 'light', label: 'Light Theme' },
                      { value: 'dark', label: 'Dark Blueprint Theme' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Tagline <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="e.g. Scalable battery storage for peak-shaving"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px]
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all
                      ${formErrors.tagline ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.tagline && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.tagline}</p>
                  )}
                </div>
              </div>
            </DrawerSection>

            {/* Section 2: Media */}
            <DrawerSection title="MEDIA ASSETS">
              <div className="space-y-3">
                <label className="block text-[13px] font-semibold text-slate-700">
                  Hero Image URL
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="/images/solutions/hero-battery.jpg or https://..."
                    className="flex-1 h-11 px-3.5 rounded-xl bg-white text-navy text-[13px] tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>
              </div>
            </DrawerSection>

            {/* Section 3: Detailed Description */}
            <DrawerSection title="DETAILED SPECIFICATION">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Architecture Overview & Scope
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Comprehensive technical breakdown of this solar engineering solution..."
                  className="w-full p-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all resize-y min-h-[110px] max-h-[220px]"
                />
              </div>
            </DrawerSection>
          </form>
        )}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Solution Architecture?"
        message={`Are you sure you want to remove "${deleteTarget?.name}"? This deployment blueprint will be unlisted.`}
        confirmText="Delete Architecture"
      />
    </div>
  );
}
