import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  CheckCircle,
  XCircle,
  Zap,
  Tag,
  PlusCircle,
  MinusCircle,
  ImageIcon,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import Drawer, { DrawerSection } from '../components/Drawer';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../components/Select';
import Toggle from '../components/Toggle';
import { useAdmin } from '../context/AdminContext';
import { useAdminData } from '../context/AdminDataContext';
import { productsService } from '../services/productsService';
import { categoriesService } from '../services/categoriesService';
import { images } from '../../data/images';

const PRESET_IMAGES = [
  { label: '3kW String', src: images.productInverter3kW },
  { label: '5kW String', src: images.productInverter5kW },
  { label: '10kW String', src: images.productInverter10kW },
  { label: '20kW String', src: images.productInverter20kW },
  { label: '15kW LV', src: images.productInverterLV15kW },
  { label: '5kW Hybrid', src: images.productHybrid5kW },
  { label: '10kW Hybrid', src: images.productHybrid10kW },
  { label: 'Micro 350W', src: images.productMicroinverter350W },
  { label: 'Solar AC', src: images.productSolarAC12K },
  { label: 'Energy Meter', src: images.productEnergyMeter },
];

export default function ProductsAdminPage() {
  const { showAdminToast } = useAdmin();
  const { getCachedData, setCachedData, getPageState, setPageState } = useAdminData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Restore preserved page filter/sort/pagination state
  const savedState = getPageState('products', {
    search: '',
    selectedCategory: 'All',
    selectedPhase: 'All',
    selectedStatus: 'All',
    sortColumn: 'name',
    sortDirection: 'asc',
    page: 1,
  });

  const cachedProds = getCachedData('products');
  const [products, setProducts] = useState(cachedProds?.items || []);
  const [categories, setCategories] = useState(getCachedData('categories') || []);
  const [isLoading, setIsLoading] = useState(!cachedProds);

  // Filters & Pagination initialized from preserved state
  const [search, setSearch] = useState(savedState.search);
  const [selectedCategory, setSelectedCategory] = useState(savedState.selectedCategory);
  const [selectedPhase, setSelectedPhase] = useState(savedState.selectedPhase);
  const [selectedStatus, setSelectedStatus] = useState(savedState.selectedStatus);
  const [sortColumn, setSortColumn] = useState(savedState.sortColumn);
  const [sortDirection, setSortDirection] = useState(savedState.sortDirection);
  const [page, setPage] = useState(savedState.page);
  const [pagination, setPagination] = useState({
    total: cachedProds?.total || 0,
    page: savedState.page,
    limit: 8,
    totalPages: cachedProds?.totalPages || 1,
  });

  // Preserve filter/search state in memory across navigation
  useEffect(() => {
    setPageState('products', {
      search,
      selectedCategory,
      selectedPhase,
      selectedStatus,
      sortColumn,
      sortDirection,
      page,
    });
  }, [search, selectedCategory, selectedPhase, selectedStatus, sortColumn, sortDirection, page, setPageState]);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'edit' | 'add'
  const [activeProduct, setActiveProduct] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    category: '',
    phase: 'Single-Phase',
    capacityKw: 5,
    efficiency: 98.2,
    enclosure: 'IP65',
    warranty: '10 Years',
    shortDesc: '',
    description: '',
    image: '/images/products/inverter-5kw.jpg',
    active: true,
  });
  const [specRows, setSpecRows] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load products list with stale-while-revalidate background caching
  const loadProducts = useCallback(async () => {
    try {
      if (!getCachedData('products')) {
        setIsLoading(true);
      }
      const res = await productsService.getAll({
        search,
        category: selectedCategory,
        phase: selectedPhase,
        status: selectedStatus,
        sortBy: sortColumn,
        sortOrder: sortDirection,
        page,
        limit: 8,
      });

      setProducts(res.items);
      setPagination({
        total: res.total,
        page: res.page,
        limit: res.limit,
        totalPages: res.totalPages,
      });
      setCachedData('products', res);
      return res.items;
    } catch (err) {
      console.error(err);
      showAdminToast('Failed to load products', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, selectedPhase, selectedStatus, sortColumn, sortDirection, page, showAdminToast, getCachedData, setCachedData]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Load categories
  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await categoriesService.getAll();
        setCategories(cats);
        if (cats.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: cats[0].name }));
        }
      } catch (err) {
        console.warn(err);
      }
    }
    loadCats();
  }, []);

  // URL Sync: Handle ?drawer=view&id=... or ?drawer=edit&id=... or ?drawer=add
  useEffect(() => {
    const drawerParam = searchParams.get('drawer');
    const idParam = searchParams.get('id');

    if (products.length === 0) return;

    if (drawerParam === 'add') {
      setDrawerMode('add');
      setActiveProduct(null);
      setFormData({
        name: '',
        model: `SD-${Math.floor(1000 + Math.random() * 9000)}`,
        category: categories[0]?.name || 'Single-Phase String Inverters',
        phase: 'Single-Phase',
        capacityKw: 5,
        efficiency: 98.2,
        enclosure: 'IP65',
        warranty: '10 Years',
        shortDesc: '',
        description: '',
        image: '/images/products/inverter-5kw.jpg',
        active: true,
      });
      setSpecRows([
        { label: 'Rated AC Output', value: '5000 W' },
        { label: 'Max DC Voltage', value: '600 V' },
        { label: 'MPPT Range', value: '120 - 550 V' },
        { label: 'Operating Temp', value: '-25°C to +60°C' },
      ]);
      setIsDirty(false);
      setIsDrawerOpen(true);
    } else if ((drawerParam === 'view' || drawerParam === 'edit') && idParam) {
      const found = products.find((p) => String(p.id) === String(idParam));
      if (found) {
        setActiveProduct(found);
        setFormData({
          name: found.name || '',
          model: found.model || '',
          category: found.category || categories[0]?.name || '',
          phase: found.phase || 'Single-Phase',
          capacityKw: found.capacityKw || 5,
          efficiency: found.efficiency || 98.0,
          enclosure: found.enclosure || 'IP65',
          warranty: found.warranty || '10 Years',
          shortDesc: found.shortDesc || '',
          description: found.description || '',
          image: found.image || '/images/products/inverter-5kw.jpg',
          active: found.active !== undefined ? found.active : true,
        });
        const existingSpecs =
          found.specGroups?.[0]?.specs || [
            { label: 'Rated Power', value: `${found.capacityKw || 5} kW` },
            { label: 'Max Efficiency', value: `${found.efficiency || 98}%` },
            { label: 'Enclosure Rating', value: found.enclosure || 'IP65' },
          ];
        setSpecRows(existingSpecs);
        setDrawerMode(drawerParam);
        setIsDirty(false);
        setIsDrawerOpen(true);
      }
    }
  }, [searchParams, products, categories]);

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

  // Open Handlers
  const handleOpenAdd = () => {
    setDrawerMode('add');
    setActiveProduct(null);
    setFormData({
      name: '',
      model: `SD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: categories[0]?.name || 'Single-Phase String Inverters',
      phase: 'Single-Phase',
      capacityKw: 5,
      efficiency: 98.2,
      enclosure: 'IP65',
      warranty: '10 Years',
      shortDesc: '',
      description: '',
      image: '/images/products/inverter-5kw.jpg',
      active: true,
    });
    setSpecRows([
      { label: 'Rated AC Output', value: '5000 W' },
      { label: 'Max DC Voltage', value: '600 V' },
      { label: 'MPPT Range', value: '120 - 550 V' },
      { label: 'Operating Temp', value: '-25°C to +60°C' },
    ]);
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
  };

  const handleOpenView = (product) => {
    setActiveProduct(product);
    setDrawerMode('view');
    setFormData({
      name: product.name || '',
      model: product.model || '',
      category: product.category || categories[0]?.name || '',
      phase: product.phase || 'Single-Phase',
      capacityKw: product.capacityKw || 5,
      efficiency: product.efficiency || 98.0,
      enclosure: product.enclosure || 'IP65',
      warranty: product.warranty || '10 Years',
      shortDesc: product.shortDesc || '',
      description: product.description || '',
      image: product.image || '/images/products/inverter-5kw.jpg',
      active: product.active !== undefined ? product.active : true,
    });
    const existingSpecs =
      product.specGroups?.[0]?.specs || [
        { label: 'Rated Power', value: `${product.capacityKw || 5} kW` },
        { label: 'Max Efficiency', value: `${product.efficiency || 98}%` },
        { label: 'Enclosure Rating', value: product.enclosure || 'IP65' },
      ];
    setSpecRows(existingSpecs);
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', product.id);
  };

  const handleOpenEdit = (product) => {
    setActiveProduct(product);
    setDrawerMode('edit');
    setFormData({
      name: product.name || '',
      model: product.model || '',
      category: product.category || categories[0]?.name || '',
      phase: product.phase || 'Single-Phase',
      capacityKw: product.capacityKw || 5,
      efficiency: product.efficiency || 98.0,
      enclosure: product.enclosure || 'IP65',
      warranty: product.warranty || '10 Years',
      shortDesc: product.shortDesc || '',
      description: product.description || '',
      image: product.image || '/images/products/inverter-5kw.jpg',
      active: product.active !== undefined ? product.active : true,
    });
    const existingSpecs =
      product.specGroups?.[0]?.specs || [
        { label: 'Rated Power', value: `${product.capacityKw || 5} kW` },
        { label: 'Max Efficiency', value: `${product.efficiency || 98}%` },
        { label: 'Enclosure Rating', value: product.enclosure || 'IP65' },
      ];
    setSpecRows(existingSpecs);
    setFormErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('edit', product.id);
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

  // Spec Rows Handlers
  const handleAddSpecRow = () => {
    setSpecRows((prev) => [...prev, { label: '', value: '' }]);
    setIsDirty(true);
  };

  const handleUpdateSpecRow = (index, field, val) => {
    setSpecRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
    setIsDirty(true);
  };

  const handleRemoveSpecRow = (index) => {
    setSpecRows((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Toggle active/inactive
  const handleToggleStatus = async (product, e) => {
    e.stopPropagation();
    try {
      const updated = await productsService.toggleStatus(product.id);
      showAdminToast(
        `"${product.name}" set to ${updated.active ? 'Active' : 'Inactive'}`,
        'success'
      );
      loadProducts();
    } catch (err) {
      showAdminToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Form Validation & Save
  const handleSaveProduct = async (e) => {
    if (e) e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.model.trim()) errors.model = 'Model number is required';
    if (!formData.capacityKw || Number(formData.capacityKw) <= 0)
      errors.capacityKw = 'Valid kW capacity is required';
    if (
      !formData.efficiency ||
      Number(formData.efficiency) <= 0 ||
      Number(formData.efficiency) > 100
    ) {
      errors.efficiency = 'Valid efficiency between 1-100% required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAdminToast('Please correct highlighted fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        capacityKw: Number(formData.capacityKw),
        efficiency: Number(formData.efficiency),
        specGroups: [
          {
            title: 'Technical Parameters',
            specs: specRows.filter((s) => s.label.trim() && s.value.trim()),
          },
        ],
      };

      if (drawerMode === 'edit' && activeProduct) {
        await productsService.update(activeProduct.id, payload);
        showAdminToast(`Product "${formData.name}" updated`, 'success');
      } else {
        await productsService.create(payload);
        showAdminToast(`Product "${formData.name}" created`, 'success');
      }

      setIsDirty(false);
      handleCloseDrawer();
      loadProducts();
    } catch (err) {
      showAdminToast(err.message || 'Error saving product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await productsService.remove(deleteTarget.id);
      showAdminToast(`Product "${deleteTarget.name}" deleted`, 'success');
      setDeleteTarget(null);
      if (activeProduct?.id === deleteTarget.id) {
        handleCloseDrawer();
      }
      loadProducts();
    } catch (err) {
      showAdminToast(err.message || 'Error deleting product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Table Columns
  const columns = [
    {
      header: 'Product / Model',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={row.image || '/images/products/inverter-5kw.jpg'}
              alt={row.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=120&q=80';
              }}
            />
          </div>
          <div>
            <div className="font-semibold text-navy text-[14px] leading-snug line-clamp-1">
              {row.name}
            </div>
            <div className="text-[12px] text-slate-500 tabular-nums font-medium mt-0.5">
              {row.model} • {row.phase}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      cell: (row) => (
        <span className="text-[13px] text-slate-600 font-medium line-clamp-1 max-w-[180px]">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Capacity',
      accessor: 'capacityKw',
      sortable: true,
      cell: (row) => (
        <span className="text-[14px] font-semibold text-navy tabular-nums">
          {row.capacityKw} kW
        </span>
      ),
    },
    {
      header: 'Efficiency',
      accessor: 'efficiency',
      sortable: true,
      cell: (row) => (
        <span className="text-[13px] text-slate-600 tabular-nums">
          {row.efficiency}%
        </span>
      ),
    },
    {
      header: 'Enclosure',
      accessor: 'enclosure',
      cell: (row) => (
        <Badge variant="outline" size="sm">
          {row.enclosure || 'IP65'}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'active',
      cell: (row) => (
        <button
          type="button"
          onClick={(e) => handleToggleStatus(row, e)}
          className="hover:opacity-85 transition-opacity"
          title="Click to toggle status"
        >
          <StatusBadge status={row.active ? 'Active' : 'Inactive'} size="sm" />
        </button>
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
                label: 'View Details',
                icon: Eye,
                onClick: () => handleOpenView(row),
              },
              {
                label: 'Edit Product',
                icon: Edit2,
                onClick: () => handleOpenEdit(row),
              },
              {
                divider: true,
              },
              {
                label: 'Delete Product',
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
            Products
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Manage solar inverter models, technical specifications, and catalog visibility
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Product
        </Button>
      </div>

      {/* Main Content: Starts 32px below header */}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={products}
          isLoading={isLoading}
          searchPlaceholder="Search inverters by model, name, or capacity..."
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          sortBy={sortColumn}
          sortDirection={sortDirection}
          onSort={(col, dir) => {
            setSortColumn(col);
            setSortDirection(dir);
            setPage(1);
          }}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleOpenView}
          filterControls={
            <>
              {/* Category Filter */}
              <div className="w-48">
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  options={[
                    { value: 'All', label: 'All Categories' },
                    ...categories.map((c) => ({
                      value: c.name,
                      label: c.short || c.name,
                    })),
                  ]}
                />
              </div>

              {/* Phase Filter */}
              <div className="w-44">
                <Select
                  value={selectedPhase}
                  onChange={(e) => {
                    setSelectedPhase(e.target.value);
                    setPage(1);
                  }}
                  options={[
                    { value: 'All', label: 'All Phases' },
                    { value: 'Single-Phase', label: 'Single-Phase' },
                    { value: 'Three-Phase', label: 'Three-Phase' },
                    { value: 'Three-Phase (LV)', label: 'Three-Phase (LV)' },
                  ]}
                />
              </div>

              {/* Status Filter */}
              <div className="w-36">
                <Select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setPage(1);
                  }}
                  options={[
                    { value: 'All', label: 'All Statuses' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </>
          }
        />
      </div>

      {/* Full-Height Highlander Slide-Over Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isDirty={isDirty}
        size="lg"
        chip={
          drawerMode === 'view'
            ? `PRODUCT • ${activeProduct?.model || 'CATALOG'}`
            : drawerMode === 'edit'
            ? `EDIT • ${activeProduct?.model || 'PRODUCT'}`
            : 'NEW INVERTER MODEL'
        }
        title={
          drawerMode === 'view'
            ? activeProduct?.name || 'Inverter Details'
            : drawerMode === 'edit'
            ? `Edit: ${activeProduct?.name || ''}`
            : 'Add Inverter Model'
        }
        subtitle={
          drawerMode === 'view'
            ? `${activeProduct?.category || 'Solar Inverter'} • ${activeProduct?.capacityKw || 5} kW`
            : 'Configure inverter electrical specifications, warranty, and catalog visibility'
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
                  updateDrawerUrl('edit', activeProduct?.id);
                }}
              >
                Edit Product
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
                onClick={handleSaveProduct}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : drawerMode === 'edit'
                  ? 'Save Changes'
                  : 'Add Product'}
              </Button>
            </div>
          )
        }
      >
        {/* VIEW MODE */}
        {drawerMode === 'view' && activeProduct && (
          <div className="space-y-5 animate-fade-in">
            {/* Gallery View: Hero Product Image + Thumbnails */}
            <DrawerSection
              title="PRODUCT MEDIA & CATALOG PREVIEW"
              action={
                <StatusBadge
                  status={activeProduct.active ? 'Active' : 'Inactive'}
                  size="sm"
                />
              }
            >
              <div className="relative aspect-[16/10] w-full rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={activeProduct.image || '/images/products/inverter-5kw.jpg'}
                  alt={activeProduct.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-navy/70 backdrop-blur-md text-white text-[11px] font-semibold tabular-nums tracking-wide">
                  1 of 1 Photo
                </div>
              </div>
            </DrawerSection>

            {/* Key Figures Highlight Card (Iceblue background) */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 flex items-center justify-around text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Rated Power
                </div>
                <div className="text-[20px] font-bold text-navy tabular-nums mt-0.5">
                  {activeProduct.capacityKw} kW
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Max Efficiency
                </div>
                <div className="text-[20px] font-bold text-emerald-600 tabular-nums mt-0.5">
                  {activeProduct.efficiency}%
                </div>
              </div>
              <div className="w-px h-8 bg-[#0297DE]/20" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Enclosure
                </div>
                <div className="text-[18px] font-bold text-navy mt-0.5">
                  {activeProduct.enclosure || 'IP65'}
                </div>
              </div>
            </div>

            {/* Technical Specifications Table */}
            <DrawerSection title="ELECTRICAL & PHYSICAL SPECIFICATIONS">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Model Number</span>
                  <span className="text-navy font-semibold tabular-nums">{activeProduct.model}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">AC Phase</span>
                  <span className="text-navy font-semibold">{activeProduct.phase}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Category</span>
                  <span className="text-navy font-semibold">{activeProduct.category}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Manufacturer Warranty</span>
                  <span className="text-navy font-semibold">{activeProduct.warranty || '10 Years'}</span>
                </div>

                {/* Dynamic Spec Rows */}
                {specRows.map((spec, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">{spec.label}</span>
                    <span className="text-navy font-semibold tabular-nums">{spec.value}</span>
                  </div>
                ))}
              </div>
            </DrawerSection>

            {/* Descriptions Section */}
            {(activeProduct.shortDesc || activeProduct.description) && (
              <DrawerSection title="CATALOG DESCRIPTION">
                {activeProduct.shortDesc && (
                  <p className="text-[14px] font-medium text-navy mb-2">
                    {activeProduct.shortDesc}
                  </p>
                )}
                {activeProduct.description && (
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    {activeProduct.description}
                  </p>
                )}
              </DrawerSection>
            )}
          </div>
        )}

        {/* EDIT / ADD MODE */}
        {drawerMode !== 'view' && (
          <form onSubmit={handleSaveProduct} className="space-y-5 animate-fade-in">
            {/* Section 1: Basic Information */}
            <DrawerSection title="BASIC INFORMATION">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Product Name <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Single-Phase String Inverter 8kW"
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
                      Model Number <span className="text-cantaloupe-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="e.g. SD-SP-8K"
                      className={`
                        w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums
                        border border-slate-200 hover:border-slate-300
                        focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                        transition-all
                        ${formErrors.model ? 'border-rose-400 focus:border-rose-500' : ''}
                      `}
                    />
                    {formErrors.model && (
                      <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.model}</p>
                    )}
                  </div>

                  <Select
                    label="AC Phase"
                    required
                    value={formData.phase}
                    onChange={(e) => handleInputChange('phase', e.target.value)}
                    options={[
                      { value: 'Single-Phase', label: 'Single-Phase' },
                      { value: 'Three-Phase', label: 'Three-Phase' },
                      { value: 'Three-Phase (LV)', label: 'Three-Phase (LV)' },
                    ]}
                  />
                </div>

                <Select
                  label="Product Category"
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  options={categories.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                />
              </div>
            </DrawerSection>

            {/* Section 2: Electrical & Physical Specs */}
            <DrawerSection title="ELECTRICAL SPECIFICATIONS">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Capacity (kW) <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.capacityKw}
                    onChange={(e) => handleInputChange('capacityKw', e.target.value)}
                    placeholder="8.0"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all
                      ${formErrors.capacityKw ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.capacityKw && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.capacityKw}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Efficiency (%) <span className="text-cantaloupe-500 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.efficiency}
                    onChange={(e) => handleInputChange('efficiency', e.target.value)}
                    placeholder="98.5"
                    className={`
                      w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums
                      border border-slate-200 hover:border-slate-300
                      focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                      transition-all
                      ${formErrors.efficiency ? 'border-rose-400 focus:border-rose-500' : ''}
                    `}
                  />
                  {formErrors.efficiency && (
                    <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.efficiency}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Enclosure
                  </label>
                  <input
                    type="text"
                    value={formData.enclosure}
                    onChange={(e) => handleInputChange('enclosure', e.target.value)}
                    placeholder="IP65"
                    className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Warranty Period
                  </label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => handleInputChange('warranty', e.target.value)}
                    placeholder="10 Years"
                    className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>

                <div>
                  <Toggle
                    label="Catalog Visibility"
                    description={formData.active ? 'Published to active catalog' : 'Hidden / Inactive draft'}
                    checked={formData.active}
                    onChange={(val) => handleInputChange('active', val)}
                  />
                </div>
              </div>
            </DrawerSection>

            {/* Section 3: Media & Image Presets */}
            <DrawerSection title="MEDIA & CATALOG ASSETS">
              <div className="space-y-3">
                <label className="block text-[13px] font-semibold text-slate-700">
                  Product Image URL
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-contain"
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
                    placeholder="/images/products/inverter-5kw.jpg or https://..."
                    className="flex-1 h-11 px-3.5 rounded-xl bg-white text-navy text-[13px] tabular-nums border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>

                {/* Catalog Presets Picker */}
                <div className="pt-2">
                  <span className="text-[12px] font-medium text-slate-400 mb-1.5 block">
                    Choose from standard inverter presets:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInputChange('image', preset.src)}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-medium shrink-0 transition-all
                          ${
                            formData.image === preset.src
                              ? 'border-electric-500 bg-electric-50 text-electric-700 shadow-sm ring-1 ring-electric-500/20'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }
                        `}
                      >
                        <img src={preset.src} alt={preset.label} className="w-4 h-4 object-contain" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </DrawerSection>

            {/* Section 4: Dynamic Technical Spec Rows */}
            <DrawerSection
              title="TECHNICAL SPECIFICATIONS TABLE"
              action={
                <button
                  type="button"
                  onClick={handleAddSpecRow}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-electric-600 hover:text-electric-700"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Parameter</span>
                </button>
              }
            >
              <div className="space-y-2.5">
                {specRows.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Parameter (e.g. Rated AC Output)"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpecRow(index, 'label', e.target.value)}
                      className="flex-1 h-10 px-3 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 5000 W)"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpecRow(index, 'value', e.target.value)}
                      className="flex-1 h-10 px-3 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecRow(index)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove parameter"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </DrawerSection>

            {/* Section 5: Descriptions */}
            <DrawerSection title="DESCRIPTIONS & CATALOG NOTES">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Short Summary
                  </label>
                  <input
                    type="text"
                    value={formData.shortDesc}
                    onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                    placeholder="High-efficiency residential string inverter with integrated AFCI..."
                    className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Full Technical Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Complete engineering overview, MPPT voltage thresholds, compliance certifications..."
                    className="w-full p-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all resize-y min-h-[110px] max-h-[220px]"
                  />
                </div>
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
        title={`Delete "${deleteTarget?.name}"?`}
        message="This will permanently remove this inverter model from the catalog and any associated quote references."
        confirmText="Delete Product"
        isLoading={isDeleting}
      />
    </div>
  );
}
