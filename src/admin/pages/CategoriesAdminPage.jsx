import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Layers, Eye, Zap, Tag, ImageIcon } from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import Drawer, { DrawerSection } from '../components/Drawer';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../components/Select';
import { useAdmin } from '../context/AdminContext';
import { categoriesService } from '../services/categoriesService';

export default function CategoriesAdminPage() {
  const { showAdminToast } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'edit' | 'add'
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    short: '',
    description: '',
    icon: 'Zap',
    count: 0,
    image: '/images/products/inverter-5kw.jpg',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
      return data;
    } catch (err) {
      showAdminToast('Failed to load categories', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [showAdminToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // URL Sync
  useEffect(() => {
    const drawerParam = searchParams.get('drawer');
    const idParam = searchParams.get('id');

    if (categories.length === 0) return;

    if (drawerParam === 'add') {
      setDrawerMode('add');
      setActiveCategory(null);
      setFormData({
        name: '',
        short: '',
        description: '',
        icon: 'Zap',
        count: 0,
        image: '/images/products/inverter-5kw.jpg',
      });
      setIsDirty(false);
      setIsDrawerOpen(true);
    } else if ((drawerParam === 'view' || drawerParam === 'edit') && idParam) {
      const found = categories.find(
        (c) => String(c.id) === String(idParam) || String(c.slug) === String(idParam)
      );
      if (found) {
        setActiveCategory(found);
        setFormData({
          name: found.name || '',
          short: found.short || '',
          description: found.description || '',
          icon: found.icon || 'Zap',
          count: found.count || 0,
          image: found.image || '/images/products/inverter-5kw.jpg',
        });
        setDrawerMode(drawerParam);
        setIsDirty(false);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, categories]);

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
    setActiveCategory(null);
    setFormData({
      name: '',
      short: '',
      description: '',
      icon: 'Zap',
      count: 0,
      image: '/images/products/inverter-5kw.jpg',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
  };

  const handleOpenView = (cat) => {
    setActiveCategory(cat);
    setDrawerMode('view');
    setFormData({
      name: cat.name || '',
      short: cat.short || '',
      description: cat.description || '',
      icon: cat.icon || 'Zap',
      count: cat.count || 0,
      image: cat.image || '/images/products/inverter-5kw.jpg',
    });
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', cat.id || cat.slug);
  };

  const handleOpenEdit = (cat) => {
    setActiveCategory(cat);
    setDrawerMode('edit');
    setFormData({
      name: cat.name || '',
      short: cat.short || '',
      description: cat.description || '',
      icon: cat.icon || 'Zap',
      count: cat.count || 0,
      image: cat.image || '/images/products/inverter-5kw.jpg',
    });
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('edit', cat.id || cat.slug);
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
    if (!formData.name.trim()) errors.name = 'Category name is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAdminToast('Please correct highlighted fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (drawerMode === 'edit' && activeCategory) {
        await categoriesService.update(activeCategory.id || activeCategory.slug, formData);
        showAdminToast(`Updated category "${formData.name}"`, 'success');
      } else {
        await categoriesService.create(formData);
        showAdminToast(`Created category "${formData.name}"`, 'success');
      }
      setIsDirty(false);
      handleCloseDrawer();
      loadCategories();
    } catch (err) {
      showAdminToast(err.message || 'Error saving category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await categoriesService.remove(deleteTarget.id || deleteTarget.slug);
      showAdminToast(`Category "${deleteTarget.name}" deleted`, 'success');
      setDeleteTarget(null);
      if (activeCategory?.id === deleteTarget.id || activeCategory?.slug === deleteTarget.slug) {
        handleCloseDrawer();
      }
      loadCategories();
    } catch (err) {
      showAdminToast(err.message || 'Error deleting category', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.short?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const columns = [
    {
      header: 'Category Taxonomy',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-iceblue border border-[#0297DE]/20 overflow-hidden shrink-0 flex items-center justify-center">
            <Layers className="w-5 h-5 text-electric-600" />
          </div>
          <div>
            <div className="font-semibold text-navy text-[14px]">{row.name}</div>
            <div className="text-[12px] text-slate-400">{row.short || 'Catalog taxonomy'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Short Label',
      accessor: 'short',
      cell: (row) => (
        <Badge variant="outline" size="sm">
          {row.short || '—'}
        </Badge>
      ),
    },
    {
      header: 'Catalog Products',
      accessor: 'count',
      cell: (row) => (
        <span className="text-[14px] font-semibold text-navy tabular-nums">
          {row.count || 0} models
        </span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (row) => (
        <span className="text-[14px] text-slate-500 line-clamp-1 max-w-[280px]">
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
                label: 'View Category',
                icon: Eye,
                onClick: () => handleOpenView(row),
              },
              {
                label: 'Edit Category',
                icon: Edit2,
                onClick: () => handleOpenEdit(row),
              },
              {
                divider: true,
              },
              {
                label: 'Delete Category',
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
      {/* Top Header Pattern */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[28px] font-semibold text-navy leading-tight">
            Categories
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Organize inverters and equipment into single-phase, three-phase, storage, and accessories
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Category
        </Button>
      </div>

      {/* Main Content starts 32px below header */}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={filteredCategories}
          isLoading={isLoading}
          searchPlaceholder="Search categories..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleOpenView}
        />
      </div>

      {/* Full-Height Highlander Slide-Over Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isDirty={isDirty}
        size="md"
        chip={
          drawerMode === 'view'
            ? `CATEGORY • ${activeCategory?.short?.toUpperCase() || 'TAXONOMY'}`
            : drawerMode === 'edit'
            ? 'EDIT CATEGORY'
            : 'NEW CATEGORY'
        }
        title={
          drawerMode === 'view'
            ? activeCategory?.name || 'Category Details'
            : drawerMode === 'edit'
            ? `Edit: ${activeCategory?.name || ''}`
            : 'Add Equipment Category'
        }
        subtitle={
          drawerMode === 'view'
            ? `${activeCategory?.count || 0} catalog models mapped to this classification`
            : 'Configure equipment classification taxonomy and catalog metadata'
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
                  updateDrawerUrl('edit', activeCategory?.id || activeCategory?.slug);
                }}
              >
                Edit Category
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
                  : 'Add Category'}
              </Button>
            </div>
          )
        }
      >
        {/* VIEW MODE */}
        {drawerMode === 'view' && activeCategory && (
          <div className="space-y-5 animate-fade-in">
            {/* Key Figures Highlight Card (Iceblue) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Catalog Models
                </div>
                <div className="text-[20px] font-bold text-navy tabular-nums mt-0.5">
                  {activeCategory.count || 0}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Short Alias
                </div>
                <div className="text-[16px] font-bold text-electric-600 mt-0.5">
                  {activeCategory.short || '—'}
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Icon
                </div>
                <div className="text-[14px] font-bold text-navy mt-0.5">
                  {activeCategory.icon || 'Zap'}
                </div>
              </div>
            </div>

            {/* Category Details Table */}
            <DrawerSection title="TAXONOMY INFORMATION">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Category Name</span>
                  <span className="text-navy font-semibold text-right">{activeCategory.name}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Short Alias</span>
                  <span className="text-navy font-semibold">{activeCategory.short || '—'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Mapped Products</span>
                  <span className="text-navy font-semibold tabular-nums">{activeCategory.count || 0} active models</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">System Slug</span>
                  <span className="text-navy font-semibold tabular-nums">{activeCategory.slug || activeCategory.id}</span>
                </div>
              </div>
            </DrawerSection>

            {/* Description Card */}
            <DrawerSection title="CLASSIFICATION SCOPE">
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {activeCategory.description || 'No extended description for this category.'}
              </p>
            </DrawerSection>
          </div>
        )}

        {/* EDIT / ADD MODE */}
        {drawerMode !== 'view' && (
          <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
            <DrawerSection title="BASIC INFORMATION">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Category Name <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Microinverters & Optimizers"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium
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
                      Short Label
                    </label>
                    <input
                      type="text"
                      value={formData.short}
                      onChange={(e) => handleInputChange('short', e.target.value)}
                      placeholder="e.g. Microinverters"
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Model Count (Display)
                    </label>
                    <input
                      type="number"
                      value={formData.count}
                      onChange={(e) => handleInputChange('count', Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </DrawerSection>

            <DrawerSection title="SCOPE & DESCRIPTION">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Category Scope
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describes which types of solar equipment fit under this category..."
                  className="w-full p-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all resize-y min-h-[100px] max-h-[200px]"
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
        title="Delete Equipment Category?"
        message={`Are you sure you want to remove "${deleteTarget?.name}"? Any linked inverters will need a new category.`}
        confirmText="Delete Category"
      />
    </div>
  );
}
