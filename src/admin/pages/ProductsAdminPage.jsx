import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Copy,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Wrench,
  Cpu,
  FileDown,
  ExternalLink,
  PlusCircle,
  MinusCircle,
  ImageIcon,
  ArrowUpRight,
  Check,
  RotateCcw,
  Info,
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
import ProductCard from '../../components/products/ProductCard';
import ProductGallery from '../../components/products/ProductGallery';
import ProductSpecifications from '../../components/products/ProductSpecifications';
import { useAdmin } from '../context/AdminContext';
import { useAdminData } from '../context/AdminDataContext';
import { productsService } from '../services/productsService';
import { categoriesService } from '../services/categoriesService';
import { images } from '../../data/images';
import { productCategories } from '../../data/productsData';

// Standard quick-add inverter preset images
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

const ELECTRICAL_SUGGESTIONS = [
  'Rated Power',
  'Max AC Output',
  'MPPT Range',
  'Max Efficiency',
  'Grid Voltage',
  'Nominal AC Voltage',
  'Max DC Input Current',
  'No. of MPPTs',
  'Operating Frequency',
  'Power Factor',
  'THDi',
];

const MECHANICAL_SUGGESTIONS = [
  'Dimensions',
  'Weight',
  'Protection Rating',
  'Operating Temp.',
  'Cooling',
  'Relative Humidity',
  'Max Operating Altitude',
  'Mounting Style',
  'Display / Interface',
  'DC Connector',
];

const WARRANTY_OPTIONS = [
  { value: '5 Years', label: '5 Years Standard' },
  { value: '10 Years', label: '10 Years Extended' },
  { value: '15 Years', label: '15 Years Premium' },
  { value: '25 Years', label: '25 Years Performance' },
];

const DEFAULT_EMPTY_ELECTRICAL = [
  { label: 'Rated Power', value: '' },
  { label: 'Max AC Output', value: '' },
  { label: 'MPPT Range', value: '120–560 V' },
  { label: 'Max Efficiency', value: '' },
  { label: 'Grid Voltage', value: '220 / 230 / 240 V' },
];

const DEFAULT_EMPTY_MECHANICAL = [
  { label: 'Dimensions', value: '360 × 290 × 130 mm' },
  { label: 'Weight', value: '8.5 kg' },
  { label: 'Protection Rating', value: 'IP65' },
  { label: 'Operating Temp.', value: '-25°C to 60°C' },
  { label: 'Cooling', value: 'Natural Convection' },
];

const NAV_SECTIONS = [
  { id: 'basic', label: 'Basic' },
  { id: 'figures', label: 'Figures' },
  { id: 'media', label: 'Media' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'mechanical', label: 'Mechanical' },
  { id: 'datasheet', label: 'Datasheet' },
  { id: 'description', label: 'Description' },
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
  const [allProductsCatalog, setAllProductsCatalog] = useState([]);
  const [categories, setCategories] = useState(getCachedData('categories') || productCategories);
  const [isLoading, setIsLoading] = useState(!cachedProds);

  // Filters & Pagination
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
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewTab, setPreviewTab] = useState('card'); // 'card' | 'details'
  const [activeNavSection, setActiveNavSection] = useState('basic');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    slug: '',
    category: '',
    categorySlug: '',
    phase: 'Single-Phase',
    capacityKw: '',
    efficiency: '',
    warranty: '10 Years',
    enclosure: 'IP65',
    datasheetSize: '',
    datasheetUrl: '',
    rating: 5.0,
    reviewCount: 0,
    shortDesc: '',
    description: '',
    image: '',
    gallery: [],
    highlights: [],
    specGroups: [
      { label: 'Electrical', specs: [] },
      { label: 'Mechanical', specs: [] },
    ],
    featured: false,
    isActive: true,
  });

  // Tracking manual edits of auto-filled specs
  const [manualSpecs, setManualSpecs] = useState({
    electricalPower: false,
    electricalEfficiency: false,
    mechanicalProtection: false,
  });

  // Temporary UI inputs
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [galleryPreviewIdx, setGalleryPreviewIdx] = useState(0);
  const [brokenImages, setBrokenImages] = useState({});

  // Form errors
  const [formErrors, setFormErrors] = useState({});
  const [sectionErrors, setSectionErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // File input ref for media upload
  const mediaFileInputRef = useRef(null);
  const datasheetFileInputRef = useRef(null);

  // Load full catalog for uniqueness validation & load paginated list
  const loadProducts = useCallback(async () => {
    try {
      if (!getCachedData('products')) {
        setIsLoading(true);
      }
      const [pagedRes, allRes] = await Promise.all([
        productsService.getAll({
          search,
          category: selectedCategory,
          phase: selectedPhase,
          status: selectedStatus,
          sortBy: sortColumn,
          sortOrder: sortDirection,
          page,
          limit: 8,
        }),
        productsService.getAll({ limit: 1000 }),
      ]);

      setProducts(pagedRes.items);
      setAllProductsCatalog(allRes.items || []);
      setPagination({
        total: pagedRes.total,
        page: pagedRes.page,
        limit: pagedRes.limit,
        totalPages: pagedRes.totalPages,
      });
      setCachedData('products', pagedRes);
      return pagedRes.items;
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
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      } catch (err) {
        console.warn('Failed to load categories', err);
      }
    }
    loadCats();
  }, []);

  // Compute live preview product object
  const previewProduct = useMemo(() => {
    const gallery = formData.gallery && formData.gallery.length > 0 ? formData.gallery : [formData.image || images.productInverter5kW];
    return {
      id: formData.id || 'preview-temp-id',
      slug: formData.slug || 'preview-inverter',
      name: formData.name || 'Inverter Model Name',
      model: formData.model || 'SD-MODEL-PREVIEW',
      category: formData.category || 'Single-Phase String Inverters',
      categorySlug: formData.categorySlug || 'single-phase-string-inverters',
      phase: formData.phase || 'Single-Phase',
      capacityKw: parseFloat(formData.capacityKw) || 5,
      efficiency: parseFloat(formData.efficiency) || 98.2,
      warranty: formData.warranty || '10 Years',
      enclosure: formData.enclosure || 'IP65',
      datasheetSize: formData.datasheetSize || '',
      datasheetUrl: formData.datasheetUrl || '',
      rating: formData.rating || 5.0,
      reviewCount: formData.reviewCount || 0,
      shortDesc: formData.shortDesc || 'Compact, high-efficiency solar inverter engineered for optimal yield and performance.',
      description: formData.description || 'Full technical overview and engineering specifications for commercial or residential installations.',
      image: gallery[0] || images.productInverter5kW,
      gallery,
      highlights: formData.highlights || [],
      specGroups: formData.specGroups || [],
      featured: Boolean(formData.featured),
      isActive: formData.isActive !== undefined ? Boolean(formData.isActive) : true,
    };
  }, [formData]);

  // URL Sync: Handle ?drawer=view&id=... or ?drawer=edit&id=... or ?drawer=add
  useEffect(() => {
    const drawerParam = searchParams.get('drawer');
    const idParam = searchParams.get('id');

    if (drawerParam === 'add' && !isDrawerOpen) {
      handleOpenAdd();
    } else if ((drawerParam === 'view' || drawerParam === 'edit') && idParam && products.length > 0 && !isDrawerOpen) {
      const found = products.find((p) => String(p.id) === String(idParam)) || allProductsCatalog.find((p) => String(p.id) === String(idParam));
      if (found) {
        if (drawerParam === 'view') handleOpenView(found);
        else handleOpenEdit(found);
      }
    }
  }, [searchParams, products, allProductsCatalog]);

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

  // -------------------------------------------------------------
  // OPEN HANDLERS
  // -------------------------------------------------------------
  const handleOpenAdd = () => {
    setDrawerMode('add');
    setActiveProduct(null);
    const initialCategory = categories[0]?.name || 'Single-Phase String Inverters';
    const initialCategorySlug = categories[0]?.slug || 'single-phase-string-inverters';

    setFormData({
      name: '',
      model: '',
      slug: '',
      category: initialCategory,
      categorySlug: initialCategorySlug,
      phase: 'Single-Phase',
      capacityKw: '',
      efficiency: '',
      enclosure: 'IP65',
      warranty: '10 Years',
      datasheetSize: '',
      datasheetUrl: '',
      rating: 5.0,
      reviewCount: 0,
      shortDesc: '',
      description: '',
      image: '',
      gallery: [],
      highlights: [],
      specGroups: [
        {
          label: 'Electrical',
          specs: DEFAULT_EMPTY_ELECTRICAL.map((s) => ({ ...s })),
        },
        {
          label: 'Mechanical',
          specs: DEFAULT_EMPTY_MECHANICAL.map((s) => ({ ...s })),
        },
      ],
      featured: false,
      isActive: true,
    });
    setManualSpecs({
      electricalPower: false,
      electricalEfficiency: false,
      mechanicalProtection: false,
    });
    setFormErrors({});
    setSectionErrors({});
    setImageUrlInput('');
    setHighlightInput('');
    setGalleryPreviewIdx(0);
    setBrokenImages({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
  };

  const populateFormWithProduct = (prod) => {
    const elecGroup = prod.specGroups?.find((g) => g.label === 'Electrical');
    const mechGroup = prod.specGroups?.find((g) => g.label === 'Mechanical');

    const electricalSpecs = elecGroup?.specs?.length
      ? elecGroup.specs.map((s) => ({ ...s }))
      : DEFAULT_EMPTY_ELECTRICAL.map((s) => {
          if (s.label === 'Rated Power' && prod.capacityKw) return { ...s, value: `${prod.capacityKw} kW` };
          if (s.label === 'Max Efficiency' && prod.efficiency) return { ...s, value: `${prod.efficiency}%` };
          return { ...s };
        });

    const mechanicalSpecs = mechGroup?.specs?.length
      ? mechGroup.specs.map((s) => ({ ...s }))
      : DEFAULT_EMPTY_MECHANICAL.map((s) => {
          if (s.label === 'Protection Rating' && prod.enclosure) return { ...s, value: prod.enclosure };
          return { ...s };
        });

    const gallery = Array.isArray(prod.gallery) && prod.gallery.length > 0
      ? [...prod.gallery]
      : prod.image
      ? [prod.image]
      : [];

    setFormData({
      id: prod.id,
      name: prod.name || '',
      model: prod.model || '',
      slug: prod.slug || '',
      category: prod.category || categories[0]?.name || '',
      categorySlug: prod.categorySlug || '',
      phase: prod.phase || 'Single-Phase',
      capacityKw: prod.capacityKw !== undefined ? prod.capacityKw : '',
      efficiency: prod.efficiency !== undefined ? prod.efficiency : '',
      enclosure: prod.enclosure || 'IP65',
      warranty: prod.warranty || '10 Years',
      datasheetSize: prod.datasheetSize || '',
      datasheetUrl: prod.datasheetUrl || '',
      rating: prod.rating !== undefined ? prod.rating : 5.0,
      reviewCount: prod.reviewCount || 0,
      shortDesc: prod.shortDesc || '',
      description: prod.description || '',
      image: gallery[0] || prod.image || '',
      gallery,
      highlights: Array.isArray(prod.highlights) ? [...prod.highlights] : [],
      specGroups: [
        { label: 'Electrical', specs: electricalSpecs },
        { label: 'Mechanical', specs: mechanicalSpecs },
      ],
      featured: Boolean(prod.featured),
      isActive: prod.isActive !== undefined ? Boolean(prod.isActive) : (prod.active !== undefined ? Boolean(prod.active) : true),
    });

    setManualSpecs({
      electricalPower: true,
      electricalEfficiency: true,
      mechanicalProtection: true,
    });
    setGalleryPreviewIdx(0);
    setImageUrlInput('');
    setHighlightInput('');
    setBrokenImages({});
  };

  const handleOpenView = (prod) => {
    setActiveProduct(prod);
    setDrawerMode('view');
    populateFormWithProduct(prod);
    setFormErrors({});
    setSectionErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('view', prod.id);
  };

  const handleOpenEdit = (prod) => {
    setActiveProduct(prod);
    setDrawerMode('edit');
    populateFormWithProduct(prod);
    setFormErrors({});
    setSectionErrors({});
    setIsDirty(false);
    setIsDrawerOpen(true);
    updateDrawerUrl('edit', prod.id);
  };

  // Duplicate product: clone with unique model, slug and "(Copy)" in name
  const handleDuplicateProduct = (prod) => {
    setActiveProduct(null);
    setDrawerMode('add');
    populateFormWithProduct(prod);

    const baseModel = prod.model || 'SD-SP-5K';
    const baseSlug = prod.slug || 'product';
    const newModel = `${baseModel}-COPY`;
    const newSlug = `${baseSlug}-copy`;
    const newName = `${prod.name || 'Inverter'} (Copy)`;

    setFormData((prev) => ({
      ...prev,
      id: undefined,
      name: newName,
      model: newModel,
      slug: newSlug,
    }));

    setFormErrors({});
    setSectionErrors({});
    setIsDirty(true);
    setIsDrawerOpen(true);
    updateDrawerUrl('add');
    showAdminToast(`Duplicating "${prod.name}" as new draft`, 'info');
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsDirty(false);
    updateDrawerUrl(null);
  };

  // -------------------------------------------------------------
  // FORM FIELD CHANGERS & AUTO-SYNCING
  // -------------------------------------------------------------
  const handleNameChange = (val) => {
    setFormData((prev) => {
      const prevAutoSlug = prev.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const newAutoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const shouldUpdateSlug = !prev.slug || prev.slug === prevAutoSlug;

      return {
        ...prev,
        name: val,
        slug: shouldUpdateSlug ? newAutoSlug : prev.slug,
      };
    });
    setIsDirty(true);
    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: null }));
  };

  const handleCategoryChange = (catName) => {
    const foundCat = categories.find((c) => c.name === catName) || productCategories.find((c) => c.name === catName);
    const catSlug = foundCat?.slug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let newPhase = formData.phase;
    if (catName.includes('Single-Phase')) {
      newPhase = 'Single-Phase';
    } else if (catName.includes('Three-Phase String Inverters (LV)')) {
      newPhase = 'Three-Phase (LV)';
    } else if (catName.includes('Three-Phase')) {
      newPhase = 'Three-Phase';
    }

    setFormData((prev) => ({
      ...prev,
      category: catName,
      categorySlug: catSlug,
      phase: newPhase,
    }));
    setIsDirty(true);
    if (formErrors.category) setFormErrors((prev) => ({ ...prev, category: null }));
  };

  // Helper to update specific spec row inside specGroups
  const updateSpecGroupRow = (groupLabel, specLabel, newVal) => {
    setFormData((prev) => {
      const groups = [...(prev.specGroups || [])];
      let gIdx = groups.findIndex((g) => g.label === groupLabel);
      if (gIdx === -1) {
        groups.push({ label: groupLabel, specs: [] });
        gIdx = groups.length - 1;
      }
      const currentSpecs = [...groups[gIdx].specs];
      const sIdx = currentSpecs.findIndex((s) => s.label === specLabel);
      if (sIdx !== -1) {
        currentSpecs[sIdx] = { ...currentSpecs[sIdx], value: newVal };
      } else {
        currentSpecs.push({ label: specLabel, value: newVal });
      }
      groups[gIdx] = { ...groups[gIdx], specs: currentSpecs };
      return { ...prev, specGroups: groups };
    });
  };

  const handleCapacityChange = (val) => {
    setFormData((prev) => ({ ...prev, capacityKw: val }));
    setIsDirty(true);
    if (formErrors.capacityKw) setFormErrors((prev) => ({ ...prev, capacityKw: null }));

    if (!manualSpecs.electricalPower && val) {
      const num = parseFloat(val);
      const formatted = !isNaN(num) && num > 0 ? (num >= 1 ? `${Math.round(num * 1000)} W` : `${num} kW`) : '';
      if (formatted) updateSpecGroupRow('Electrical', 'Rated Power', formatted);
    }
  };

  const handleEfficiencyChange = (val) => {
    setFormData((prev) => ({ ...prev, efficiency: val }));
    setIsDirty(true);
    if (formErrors.efficiency) setFormErrors((prev) => ({ ...prev, efficiency: null }));

    if (!manualSpecs.electricalEfficiency && val) {
      updateSpecGroupRow('Electrical', 'Max Efficiency', `${val}%`);
    }
  };

  const handleEnclosureChange = (val) => {
    setFormData((prev) => ({ ...prev, enclosure: val }));
    setIsDirty(true);
    if (!manualSpecs.mechanicalProtection && val) {
      updateSpecGroupRow('Mechanical', 'Protection Rating', val);
    }
  };

  // -------------------------------------------------------------
  // MEDIA GALLERY HANDLERS
  // -------------------------------------------------------------
  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (formData.gallery.length >= 6) {
      showAdminToast('Maximum of 6 images allowed per inverter', 'warning');
      return;
    }
    if (formData.gallery.includes(url)) {
      showAdminToast('Image URL already added to gallery', 'info');
      return;
    }

    const updatedGallery = [...formData.gallery, url];
    setFormData((prev) => ({
      ...prev,
      gallery: updatedGallery,
      image: updatedGallery[0],
    }));
    setImageUrlInput('');
    setIsDirty(true);
    if (formErrors.gallery) setFormErrors((prev) => ({ ...prev, gallery: null }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showAdminToast('Image file size exceeds 2 MB limit', 'error');
      return;
    }

    if (formData.gallery.length >= 6) {
      showAdminToast('Maximum of 6 images allowed per inverter', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      const updatedGallery = [...formData.gallery, dataUrl];
      setFormData((prev) => ({
        ...prev,
        gallery: updatedGallery,
        image: updatedGallery[0],
      }));
      setIsDirty(true);
      if (formErrors.gallery) setFormErrors((prev) => ({ ...prev, gallery: null }));
      showAdminToast('Image uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSetCover = (index) => {
    if (index === 0) return;
    const item = formData.gallery[index];
    const rest = formData.gallery.filter((_, i) => i !== index);
    const updated = [item, ...rest];
    setFormData((prev) => ({
      ...prev,
      gallery: updated,
      image: updated[0],
    }));
    setGalleryPreviewIdx(0);
    setIsDirty(true);
  };

  const handleRemoveImage = (index) => {
    const updated = formData.gallery.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      gallery: updated,
      image: updated[0] || '',
    }));
    if (galleryPreviewIdx >= updated.length) {
      setGalleryPreviewIdx(Math.max(0, updated.length - 1));
    }
    setIsDirty(true);
  };

  const handleMoveImage = (index, dir) => {
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= formData.gallery.length) return;
    const updated = [...formData.gallery];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setFormData((prev) => ({
      ...prev,
      gallery: updated,
      image: updated[0],
    }));
    setGalleryPreviewIdx(targetIdx);
    setIsDirty(true);
  };

  const handleAddPreset = (src) => {
    if (formData.gallery.length >= 6) {
      showAdminToast('Maximum of 6 images allowed', 'warning');
      return;
    }
    if (formData.gallery.includes(src)) {
      showAdminToast('Preset already in gallery', 'info');
      return;
    }
    const updated = [...formData.gallery, src];
    setFormData((prev) => ({
      ...prev,
      gallery: updated,
      image: updated[0],
    }));
    setIsDirty(true);
    if (formErrors.gallery) setFormErrors((prev) => ({ ...prev, gallery: null }));
  };

  // -------------------------------------------------------------
  // HIGHLIGHTS HANDLERS
  // -------------------------------------------------------------
  const handleAddHighlight = () => {
    const val = highlightInput.trim();
    if (!val) return;
    if (formData.highlights.length >= 8) {
      showAdminToast('Maximum of 8 engineering highlights allowed', 'warning');
      return;
    }
    if (formData.highlights.includes(val)) {
      showAdminToast('Highlight already exists', 'info');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, val],
    }));
    setHighlightInput('');
    setIsDirty(true);
  };

  const handleRemoveHighlight = (idx) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
    setIsDirty(true);
  };

  const handleMoveHighlight = (idx, dir) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= formData.highlights.length) return;
    const updated = [...formData.highlights];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setFormData((prev) => ({ ...prev, highlights: updated }));
    setIsDirty(true);
  };

  // -------------------------------------------------------------
  // SPECIFICATION ROWS HANDLERS
  // -------------------------------------------------------------
  const handleAddSpecRow = (groupLabel) => {
    setFormData((prev) => {
      const groups = [...prev.specGroups];
      let gIdx = groups.findIndex((g) => g.label === groupLabel);
      if (gIdx === -1) {
        groups.push({ label: groupLabel, specs: [] });
        gIdx = groups.length - 1;
      }
      groups[gIdx] = {
        ...groups[gIdx],
        specs: [...groups[gIdx].specs, { label: '', value: '' }],
      };
      return { ...prev, specGroups: groups };
    });
    setIsDirty(true);
  };

  const handleUpdateSpecRow = (groupLabel, rowIdx, field, val) => {
    setFormData((prev) => {
      const groups = [...prev.specGroups];
      const gIdx = groups.findIndex((g) => g.label === groupLabel);
      if (gIdx === -1) return prev;
      const specs = [...groups[gIdx].specs];
      specs[rowIdx] = { ...specs[rowIdx], [field]: val };
      groups[gIdx] = { ...groups[gIdx], specs };
      return { ...prev, specGroups: groups };
    });
    setIsDirty(true);

    // If admin explicitly touched these fields, disable automatic overwriting
    if (groupLabel === 'Electrical') {
      const spec = formData.specGroups.find((g) => g.label === 'Electrical')?.specs?.[rowIdx];
      if (spec?.label === 'Rated Power' && field === 'value') {
        setManualSpecs((m) => ({ ...m, electricalPower: true }));
      }
      if (spec?.label === 'Max Efficiency' && field === 'value') {
        setManualSpecs((m) => ({ ...m, electricalEfficiency: true }));
      }
    } else if (groupLabel === 'Mechanical') {
      const spec = formData.specGroups.find((g) => g.label === 'Mechanical')?.specs?.[rowIdx];
      if (spec?.label === 'Protection Rating' && field === 'value') {
        setManualSpecs((m) => ({ ...m, mechanicalProtection: true }));
      }
    }
  };

  const handleRemoveSpecRow = (groupLabel, rowIdx) => {
    setFormData((prev) => {
      const groups = [...prev.specGroups];
      const gIdx = groups.findIndex((g) => g.label === groupLabel);
      if (gIdx === -1) return prev;
      groups[gIdx] = {
        ...groups[gIdx],
        specs: groups[gIdx].specs.filter((_, i) => i !== rowIdx),
      };
      return { ...prev, specGroups: groups };
    });
    setIsDirty(true);
  };

  // -------------------------------------------------------------
  // DATASHEET HANDLERS
  // -------------------------------------------------------------
  const handleDatasheetFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showAdminToast('PDF datasheet exceeds 10 MB limit', 'error');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      const dataUrl = uploadEvt.target.result;
      setFormData((prev) => ({
        ...prev,
        datasheetUrl: dataUrl,
        datasheetSize: sizeFormatted,
      }));
      setIsDirty(true);
      showAdminToast(`Datasheet "${file.name}" attached (${sizeFormatted})`, 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleClearDatasheet = () => {
    setFormData((prev) => ({
      ...prev,
      datasheetUrl: '',
      datasheetSize: '',
    }));
    setIsDirty(true);
  };

  // -------------------------------------------------------------
  // VALIDATION & SAVE
  // -------------------------------------------------------------
  const validateForm = () => {
    const errors = {};
    const sErrors = {
      basic: 0,
      figures: 0,
      media: 0,
      highlights: 0,
      electrical: 0,
      mechanical: 0,
      datasheet: 0,
      description: 0,
    };

    // 1. Basic Info
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
      sErrors.basic++;
    }
    if (!formData.model.trim()) {
      errors.model = 'Model number is required';
      sErrors.basic++;
    } else {
      // Unique check (case-insensitive) against all products except current
      const currentId = drawerMode === 'edit' ? activeProduct?.id : null;
      const modelConflict = allProductsCatalog.some(
        (p) => p.model?.toLowerCase() === formData.model.trim().toLowerCase() && p.id !== currentId
      );
      if (modelConflict) {
        errors.model = `Model number "${formData.model}" is already in use`;
        sErrors.basic++;
      }
    }

    if (!formData.slug.trim()) {
      errors.slug = 'URL slug is required';
      sErrors.basic++;
    } else {
      const currentId = drawerMode === 'edit' ? activeProduct?.id : null;
      const slugConflict = allProductsCatalog.some(
        (p) => p.slug?.toLowerCase() === formData.slug.trim().toLowerCase() && p.id !== currentId
      );
      if (slugConflict) {
        errors.slug = `URL slug "${formData.slug}" is already taken`;
        sErrors.basic++;
      }
    }

    if (!formData.category.trim()) {
      errors.category = 'Product category is required';
      sErrors.basic++;
    }

    // 2. Key Figures
    const cap = parseFloat(formData.capacityKw);
    if (isNaN(cap) || cap <= 0) {
      errors.capacityKw = 'Valid rated capacity (> 0 kW) is required';
      sErrors.figures++;
    }

    const eff = parseFloat(formData.efficiency);
    if (isNaN(eff) || eff < 0 || eff > 100) {
      errors.efficiency = 'Valid efficiency between 0% and 100% required';
      sErrors.figures++;
    }

    // 3. Media Gallery
    if (!formData.gallery || formData.gallery.length === 0) {
      errors.gallery = 'At least 1 product image is required in the gallery';
      sErrors.media++;
    }

    // 5. Electrical specs
    const elecGroup = formData.specGroups.find((g) => g.label === 'Electrical');
    const validElec = elecGroup?.specs?.filter((s) => s.label.trim() && s.value.trim()) || [];
    if (validElec.length < 3) {
      errors.electrical = 'At least 3 complete electrical parameters are required';
      sErrors.electrical++;
    }

    setFormErrors(errors);
    setSectionErrors(sErrors);

    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors, sErrors };
  };

  const handleSaveProduct = async (e) => {
    if (e) e.preventDefault();

    const { isValid, sErrors } = validateForm();
    if (!isValid) {
      // Scroll to the first section that contains an error
      const firstErrorSection = Object.keys(sErrors).find((k) => sErrors[k] > 0);
      if (firstErrorSection) {
        const el = document.getElementById(`section-${firstErrorSection}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveNavSection(firstErrorSection);
      }
      showAdminToast('Please resolve highlighted form errors', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const coverImage = formData.gallery[0] || formData.image || images.productInverter5kW;
      const cleanSpecGroups = formData.specGroups.map((group) => ({
        label: group.label,
        specs: group.specs.filter((s) => s.label.trim() && s.value.trim()),
      }));

      const payload = {
        name: formData.name.trim(),
        model: formData.model.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        categorySlug: formData.categorySlug || formData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        phase: formData.phase,
        capacityKw: parseFloat(formData.capacityKw),
        efficiency: parseFloat(formData.efficiency),
        warranty: formData.warranty,
        enclosure: formData.enclosure.trim() || 'IP65',
        datasheetSize: formData.datasheetSize.trim(),
        datasheetUrl: formData.datasheetUrl.trim(),
        rating: formData.rating || 5.0,
        reviewCount: formData.reviewCount || 0,
        shortDesc: formData.shortDesc.trim(),
        description: formData.description.trim(),
        image: coverImage,
        gallery: formData.gallery,
        highlights: formData.highlights,
        specGroups: cleanSpecGroups,
        featured: Boolean(formData.featured),
        isActive: Boolean(formData.isActive),
        active: Boolean(formData.isActive),
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
      console.error(err);
      showAdminToast(err.message || 'Error saving product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active/inactive in table row
  const handleToggleStatus = async (prod, e) => {
    e.stopPropagation();
    try {
      const updated = await productsService.toggleStatus(prod.id);
      const isNowActive = updated.isActive !== undefined ? updated.isActive : updated.active;
      showAdminToast(
        `"${prod.name}" set to ${isNowActive ? 'Active' : 'Inactive'}`,
        'success'
      );
      loadProducts();
    } catch (err) {
      showAdminToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Delete product
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

  // Scroll to section from sticky navigator
  const scrollToSection = (secId) => {
    setActiveNavSection(secId);
    const el = document.getElementById(`section-${secId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              src={row.image || (row.gallery && row.gallery[0]) || images.productInverter5kW}
              alt={row.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=120&q=80';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-navy text-[14px] leading-snug line-clamp-1">
                {row.name}
              </span>
              {row.featured && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-cantaloupe-50 text-cantaloupe-700 border border-cantaloupe-200 text-[10px] font-bold">
                  <Star className="w-2.5 h-2.5 fill-current text-cantaloupe-500" />
                  Featured
                </span>
              )}
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
      cell: (row) => {
        const isActive = row.isActive !== undefined ? row.isActive : row.active;
        return (
          <button
            type="button"
            onClick={(e) => handleToggleStatus(row, e)}
            className="hover:opacity-85 transition-opacity"
            title="Click to toggle status"
          >
            <StatusBadge status={isActive ? 'Active' : 'Inactive'} size="sm" />
          </button>
        );
      },
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
                label: 'Duplicate Product',
                icon: Copy,
                onClick: () => handleDuplicateProduct(row),
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
      {/* Top Header */}
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

      {/* Main Table Content */}
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
        size={showLivePreview && drawerMode !== 'view' ? '2xl' : 'xl'}
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseDrawer}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                {/* Live Preview Toggle on Desktop */}
                <button
                  type="button"
                  onClick={() => setShowLivePreview((prev) => !prev)}
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-600 hover:text-navy hover:bg-slate-50 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-electric-500" />
                  <span>{showLivePreview ? 'Hide Mobile Preview' : 'Show Mobile Preview'}</span>
                </button>
              </div>

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
          <div className="space-y-5 animate-fade-in pb-28">
            {/* Gallery View: Hero Product Image + Thumbnails */}
            <DrawerSection
              title="PRODUCT MEDIA & CATALOG PREVIEW"
              action={
                <div className="flex items-center gap-2">
                  {activeProduct.featured && (
                    <Badge variant="cantaloupe" size="xs">
                      Featured on Home
                    </Badge>
                  )}
                  <StatusBadge
                    status={activeProduct.isActive !== undefined ? (activeProduct.isActive ? 'Active' : 'Inactive') : (activeProduct.active ? 'Active' : 'Inactive')}
                    size="sm"
                  />
                </div>
              }
            >
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full rounded-2xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={formData.gallery[galleryPreviewIdx] || activeProduct.image || images.productInverter5kW}
                    alt={activeProduct.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-navy/70 backdrop-blur-md text-white text-[11px] font-semibold tabular-nums tracking-wide">
                    {galleryPreviewIdx + 1} of {formData.gallery.length || 1}
                  </div>
                </div>

                {/* Thumbnails */}
                {formData.gallery.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {formData.gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGalleryPreviewIdx(idx)}
                        className={`w-14 h-14 rounded-xl border p-1 shrink-0 overflow-hidden bg-white transition-all ${
                          galleryPreviewIdx === idx
                            ? 'border-electric-500 ring-2 ring-electric-500/20'
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </DrawerSection>

            {/* Key Figures Highlight Card */}
            <div className="p-4 rounded-2xl bg-iceblue border border-[#0297DE]/20 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Rated Capacity
                </div>
                <div className="text-[20px] font-bold text-navy tabular-nums mt-0.5">
                  {activeProduct.capacityKw} kW
                </div>
              </div>
              <div className="border-x border-[#0297DE]/20 px-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Max Efficiency
                </div>
                <div className="text-[20px] font-bold text-emerald-600 tabular-nums mt-0.5">
                  {activeProduct.efficiency}%
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Enclosure / Phase
                </div>
                <div className="text-[16px] font-bold text-navy mt-0.5 truncate">
                  {activeProduct.enclosure || 'IP65'} • {activeProduct.phase}
                </div>
              </div>
            </div>

            {/* Key Engineering Highlights */}
            {formData.highlights && formData.highlights.length > 0 && (
              <DrawerSection title="KEY ENGINEERING HIGHLIGHTS">
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-electric-50 border border-electric-200/80 text-electric-800 text-[12px] font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-electric-600 shrink-0" />
                      {h}
                    </span>
                  ))}
                </div>
              </DrawerSection>
            )}

            {/* Electrical Specifications */}
            <DrawerSection title="ELECTRICAL SPECIFICATIONS">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Model Number</span>
                  <span className="text-navy font-semibold tabular-nums">{activeProduct.model}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Category</span>
                  <span className="text-navy font-semibold">{activeProduct.category}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">AC Phase</span>
                  <span className="text-navy font-semibold">{activeProduct.phase}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Warranty</span>
                  <span className="text-navy font-semibold">{activeProduct.warranty}</span>
                </div>

                {formData.specGroups
                  .find((g) => g.label === 'Electrical')
                  ?.specs?.map((spec, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{spec.label}</span>
                      <span className="text-navy font-semibold tabular-nums">{spec.value}</span>
                    </div>
                  ))}
              </div>
            </DrawerSection>

            {/* Mechanical Specifications */}
            <DrawerSection title="MECHANICAL SPECIFICATIONS">
              <div className="divide-y divide-slate-100 text-[13px]">
                {formData.specGroups
                  .find((g) => g.label === 'Mechanical')
                  ?.specs?.map((spec, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">{spec.label}</span>
                      <span className="text-navy font-semibold tabular-nums">{spec.value}</span>
                    </div>
                  ))}
              </div>
            </DrawerSection>

            {/* Technical Datasheet Card */}
            {(activeProduct.datasheetUrl || activeProduct.datasheetSize) && (
              <DrawerSection title="TECHNICAL DATASHEET (PDF)">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-iceblue to-paleblue/60 border border-electric-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-9 h-9 rounded-xl bg-electric-500 text-white flex items-center justify-center shrink-0 shadow-glow">
                      <FileDown className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-navy truncate">
                        {activeProduct.model} Technical Datasheet
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {activeProduct.datasheetSize || 'PDF Document'}
                      </p>
                    </div>
                  </div>
                  {activeProduct.datasheetUrl && (
                    <a
                      href={activeProduct.datasheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white text-navy border border-slate-200 hover:border-electric-400 text-xs font-semibold inline-flex items-center gap-1 shadow-sm"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3 text-electric-600" />
                    </a>
                  )}
                </div>
              </DrawerSection>
            )}

            {/* Descriptions */}
            {(activeProduct.shortDesc || activeProduct.description) && (
              <DrawerSection title="CATALOG DESCRIPTION">
                {activeProduct.shortDesc && (
                  <p className="text-[14px] font-semibold text-navy mb-2">
                    {activeProduct.shortDesc}
                  </p>
                )}
                {activeProduct.description && (
                  <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line">
                    {activeProduct.description}
                  </p>
                )}
              </DrawerSection>
            )}
          </div>
        )}

        {/* EDIT / ADD MODE */}
        {drawerMode !== 'view' && (
          <div className="relative">
            {/* STICKY SECTION NAVIGATOR */}
            <div className="sticky top-0 z-20 bg-[#F7FAFC]/95 backdrop-blur-md pb-2.5 pt-1 -mt-2 border-b border-slate-200/80 mb-5">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {NAV_SECTIONS.map((sec) => {
                  const errorCount = sectionErrors[sec.id] || 0;
                  const isActive = activeNavSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`
                        inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all shrink-0
                        ${
                          isActive
                            ? 'bg-navy text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }
                      `}
                    >
                      <span>{sec.label}</span>
                      {errorCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold inline-flex items-center justify-center">
                          {errorCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONTENT AREA: Split with Phone Mock Live Preview on Desktop */}
            <div className="flex flex-col xl:flex-row gap-6 items-start pb-28">
              {/* LEFT COLUMN: THE 8 FORM SECTIONS */}
              <form onSubmit={handleSaveProduct} className="flex-1 min-w-0 space-y-5 w-full">
                {/* ---------------------------------------------------- */}
                {/* 1) Basic Information */}
                {/* ---------------------------------------------------- */}
                <div id="section-basic">
                  <DrawerSection
                    title="1. BASIC INFORMATION"
                    action={
                      sectionErrors.basic > 0 && (
                        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          {sectionErrors.basic} required
                        </span>
                      )
                    }
                  >
                    <div className="space-y-4">
                      {/* Product Name */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                          Product Name <span className="text-cantaloupe-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g. Single-Phase String Inverter 5kW"
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

                      {/* Slug (Auto-generated & Editable) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[12px] font-semibold text-slate-600">
                            URL Slug <span className="text-cantaloupe-500 font-bold">*</span>
                          </label>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Auto-generated from name
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-mono text-slate-400 bg-slate-100 px-2.5 py-2.5 rounded-xl shrink-0">
                            /products/
                          </span>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, slug: e.target.value }));
                              setIsDirty(true);
                              if (formErrors.slug) setFormErrors((prev) => ({ ...prev, slug: null }));
                            }}
                            placeholder="single-phase-string-inverter-5kw"
                            className={`
                              flex-1 h-11 px-3.5 rounded-xl bg-white text-navy text-[13px] font-mono
                              border border-slate-200 hover:border-slate-300
                              focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                              ${formErrors.slug ? 'border-rose-400 focus:border-rose-500' : ''}
                            `}
                          />
                        </div>
                        {formErrors.slug && (
                          <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.slug}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Model Number */}
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Model Number <span className="text-cantaloupe-500 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.model}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, model: e.target.value }));
                              setIsDirty(true);
                              if (formErrors.model) setFormErrors((prev) => ({ ...prev, model: null }));
                            }}
                            placeholder="e.g. SD-SP-5K"
                            className={`
                              w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums
                              border border-slate-200 hover:border-slate-300
                              focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                              ${formErrors.model ? 'border-rose-400 focus:border-rose-500' : ''}
                            `}
                          />
                          {formErrors.model && (
                            <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.model}</p>
                          )}
                        </div>

                        {/* Category Select */}
                        <Select
                          label="Product Category"
                          required
                          value={formData.category}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          options={categories.map((c) => ({
                            value: c.name,
                            label: c.name,
                          }))}
                        />
                      </div>

                      {/* AC Phase Select (Auto-linked) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[13px] font-semibold text-slate-700">
                            AC Phase <span className="text-cantaloupe-500 font-bold">*</span>
                          </label>
                          <span className="text-[11px] text-electric-600 font-medium">
                            Auto-linked with category
                          </span>
                        </div>
                        <Select
                          value={formData.phase}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, phase: e.target.value }));
                            setIsDirty(true);
                          }}
                          options={[
                            { value: 'Single-Phase', label: 'Single-Phase' },
                            { value: 'Three-Phase', label: 'Three-Phase' },
                            { value: 'Three-Phase (LV)', label: 'Three-Phase (LV)' },
                            { value: 'Split-Phase', label: 'Split-Phase (Hybrid)' },
                          ]}
                        />
                      </div>
                    </div>
                  </DrawerSection>
                </div>

                {/* ---------------------------------------------------- */}
                {/* 2) Key Figures */}
                {/* ---------------------------------------------------- */}
                <div id="section-figures">
                  <DrawerSection
                    title="2. KEY FIGURES & PERFORMANCE"
                    action={
                      sectionErrors.figures > 0 && (
                        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          {sectionErrors.figures} required
                        </span>
                      )
                    }
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Rated Capacity */}
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Rated Capacity (kW) <span className="text-cantaloupe-500 font-bold">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={formData.capacityKw}
                            onChange={(e) => handleCapacityChange(e.target.value)}
                            placeholder="e.g. 5.0"
                            className={`
                              w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums
                              border border-slate-200 hover:border-slate-300
                              focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                              ${formErrors.capacityKw ? 'border-rose-400 focus:border-rose-500' : ''}
                            `}
                          />
                          {formErrors.capacityKw && (
                            <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.capacityKw}</p>
                          )}
                        </div>

                        {/* Max Efficiency */}
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Max Efficiency (%) <span className="text-cantaloupe-500 font-bold">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={formData.efficiency}
                            onChange={(e) => handleEfficiencyChange(e.target.value)}
                            placeholder="e.g. 98.3"
                            className={`
                              w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium tabular-nums
                              border border-slate-200 hover:border-slate-300
                              focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500
                              ${formErrors.efficiency ? 'border-rose-400 focus:border-rose-500' : ''}
                            `}
                          />
                          {formErrors.efficiency && (
                            <p className="mt-1 text-[12px] text-rose-600 font-medium">{formErrors.efficiency}</p>
                          )}
                        </div>

                        {/* Phase Read-Only Chip */}
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Phase (Read-only)
                          </label>
                          <div className="h-11 px-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-between text-navy text-[13px] font-semibold">
                            <span className="truncate">{formData.phase}</span>
                            <Zap className="w-4 h-4 text-electric-600 shrink-0" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Warranty Select */}
                        <Select
                          label="Manufacturer Warranty"
                          value={formData.warranty}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, warranty: e.target.value }));
                            setIsDirty(true);
                          }}
                          options={WARRANTY_OPTIONS}
                        />

                        {/* Enclosure / IP Rating */}
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Enclosure / IP Rating
                          </label>
                          <input
                            type="text"
                            value={formData.enclosure}
                            onChange={(e) => handleEnclosureChange(e.target.value)}
                            placeholder="e.g. IP65 or IP66"
                            className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] font-medium border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <Toggle
                          label="Catalog Visibility"
                          description={formData.isActive ? 'Published to client catalog' : 'Hidden from storefront'}
                          checked={formData.isActive}
                          onChange={(val) => {
                            setFormData((prev) => ({ ...prev, isActive: val, active: val }));
                            setIsDirty(true);
                          }}
                        />

                        <Toggle
                          label="Featured on Home"
                          description="Display in the mobile app Featured Inverters section"
                          checked={formData.featured}
                          onChange={(val) => {
                            setFormData((prev) => ({ ...prev, featured: val }));
                            setIsDirty(true);
                          }}
                        />
                      </div>
                    </div>
                  </DrawerSection>
                </div>

                {/* ---------------------------------------------------- */}
                {/* 3) Media Gallery */}
                {/* ---------------------------------------------------- */}
                <div id="section-media">
                  <DrawerSection
                    title="3. MEDIA GALLERY (UP TO 6 IMAGES)"
                    action={
                      <span className="text-[12px] font-mono text-slate-500">
                        {formData.gallery.length} / 6 images
                      </span>
                    }
                  >
                    <div className="space-y-4">
                      {formErrors.gallery && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                          <span>{formErrors.gallery}</span>
                        </div>
                      )}

                      {/* URL Add Input + File Upload Trigger */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddImageUrl();
                              }
                            }}
                            placeholder="Enter image URL (https://... or /images/...)"
                            className="w-full h-10 px-3 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                          />
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleAddImageUrl}
                          disabled={!imageUrlInput.trim() || formData.gallery.length >= 6}
                        >
                          Add URL
                        </Button>
                        <input
                          ref={mediaFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Upload}
                          onClick={() => mediaFileInputRef.current?.click()}
                          disabled={formData.gallery.length >= 6}
                        >
                          Upload File
                        </Button>
                      </div>

                      {/* Standard Quick Presets Chips */}
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Standard Inverter Presets:
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                          {PRESET_IMAGES.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAddPreset(preset.src)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-electric-400 text-[11px] font-medium shrink-0 transition-colors shadow-2xs"
                            >
                              <img src={preset.src} alt="" className="w-3.5 h-3.5 object-contain" />
                              <span>{preset.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Thumbnails Manager Strip */}
                      {formData.gallery.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[12px] font-semibold text-slate-700 block">
                            Manage & Reorder (First image is Cover):
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {formData.gallery.map((url, idx) => {
                              const isCover = idx === 0;
                              const isBroken = brokenImages[url];
                              return (
                                <div
                                  key={idx}
                                  className={`
                                    relative rounded-xl border p-2 bg-white flex flex-col justify-between transition-all group
                                    ${isCover ? 'border-cantaloupe-400 ring-2 ring-cantaloupe-400/20 bg-cantaloupe-50/20' : 'border-slate-200'}
                                  `}
                                >
                                  {/* Cover Indicator Badge */}
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        isCover
                                          ? 'bg-cantaloupe-500 text-white'
                                          : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {isCover ? 'Cover Photo' : `#${idx + 1}`}
                                    </span>
                                    {!isCover && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetCover(idx)}
                                        className="text-[10px] font-semibold text-electric-600 hover:underline flex items-center gap-0.5"
                                        title="Make this the cover photo"
                                      >
                                        <Star className="w-3 h-3" />
                                        <span>Set Cover</span>
                                      </button>
                                    )}
                                  </div>

                                  {/* Thumbnail Image Box */}
                                  <div className="aspect-[4/3] w-full rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 relative">
                                    {isBroken ? (
                                      <div className="text-center p-2 text-rose-500 text-[10px]">
                                        <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
                                        Broken image
                                      </div>
                                    ) : (
                                      <img
                                        src={url}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="max-h-full max-w-full object-contain"
                                        onError={() =>
                                          setBrokenImages((prev) => ({ ...prev, [url]: true }))
                                        }
                                      />
                                    )}
                                  </div>

                                  {/* Action Controls: Move Left, Move Right, Remove */}
                                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleMoveImage(idx, -1)}
                                        disabled={idx === 0}
                                        className="p-1 hover:text-navy disabled:opacity-30 disabled:hover:text-slate-500"
                                        title="Move left"
                                      >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleMoveImage(idx, 1)}
                                        disabled={idx === formData.gallery.length - 1}
                                        className="p-1 hover:text-navy disabled:opacity-30 disabled:hover:text-slate-500"
                                        title="Move right"
                                      >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(idx)}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                      title="Remove image"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </DrawerSection>
                </div>

                {/* ---------------------------------------------------- */}
                {/* 4) Key Engineering Highlights */}
                {/* ---------------------------------------------------- */}
                <div id="section-highlights">
                  <DrawerSection
                    title="4. KEY ENGINEERING HIGHLIGHTS"
                    action={
                      <span className="text-[12px] font-mono text-slate-500">
                        {formData.highlights.length} / 8 highlights
                      </span>
                    }
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={highlightInput}
                          onChange={(e) => setHighlightInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddHighlight();
                            }
                          }}
                          placeholder='e.g. "Dual MPPT design", "Built-in surge protection"'
                          className="flex-1 h-10 px-3.5 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleAddHighlight}
                          disabled={!highlightInput.trim() || formData.highlights.length >= 8}
                        >
                          Add Highlight
                        </Button>
                      </div>

                      {/* Chips list */}
                      {formData.highlights.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {formData.highlights.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-electric-50 border border-electric-200 text-electric-900 text-[12px] font-medium"
                            >
                              <Check className="w-3 h-3 text-electric-600 shrink-0" />
                              <span>{item}</span>
                              <div className="flex items-center gap-0.5 ml-1 border-l border-electric-200 pl-1">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveHighlight(idx, -1)}
                                    className="p-0.5 hover:text-navy text-slate-400"
                                    title="Move left"
                                  >
                                    <ChevronLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {idx < formData.highlights.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveHighlight(idx, 1)}
                                    className="p-0.5 hover:text-navy text-slate-400"
                                    title="Move right"
                                  >
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveHighlight(idx)}
                                  className="p-0.5 hover:text-rose-600 text-slate-400 ml-0.5"
                                  title="Remove highlight"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] text-slate-400 italic">
                          No highlights added yet. Add up to 8 key engineering selling points.
                        </p>
                      )}
                    </div>
                  </DrawerSection>
                </div>

                {/* ---------------------------------------------------- */}
                {/* 5) Electrical Specifications */}
                {/* ---------------------------------------------------- */}
                <div id="section-electrical">
                  <DrawerSection
                    title="5. ELECTRICAL SPECIFICATIONS"
                    action={
                      <button
                        type="button"
                        onClick={() => handleAddSpecRow('Electrical')}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-electric-600 hover:text-electric-700"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Parameter</span>
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {formErrors.electrical && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                          {formErrors.electrical}
                        </div>
                      )}

                      <datalist id="electrical-spec-suggestions">
                        {ELECTRICAL_SUGGESTIONS.map((item, idx) => (
                          <option key={idx} value={item} />
                        ))}
                      </datalist>

                      <div className="space-y-2.5">
                        {formData.specGroups
                          .find((g) => g.label === 'Electrical')
                          ?.specs?.map((spec, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                list="electrical-spec-suggestions"
                                placeholder="Parameter (e.g. Rated Power)"
                                value={spec.label}
                                onChange={(e) =>
                                  handleUpdateSpecRow('Electrical', index, 'label', e.target.value)
                                }
                                className="w-1/2 h-10 px-3 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g. 5000 W)"
                                value={spec.value}
                                onChange={(e) =>
                                  handleUpdateSpecRow('Electrical', index, 'value', e.target.value)
                                }
                                className="flex-1 h-10 px-3 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecRow('Electrical', index)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                                title="Remove parameter"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </DrawerSection>
                </div>

                {/* ---------------------------------------------------- */}
                {/* 6) Mechanical Specifications */}
                {/* ---------------------------------------------------- */}
                <div id="section-mechanical">
                  <DrawerSection
                    title="6. MECHANICAL SPECIFICATIONS"
                    action={
                      <button
                        type="button"
                        onClick={() => handleAddSpecRow('Mechanical')}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-electric-600 hover:text-electric-700"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Parameter</span>
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      <datalist id="mechanical-spec-suggestions">
                        {MECHANICAL_SUGGESTIONS.map((item, idx) => (
                          <option key={idx} value={item} />
                        ))}
                      </datalist>

                      <div className="space-y-2.5">
                        {formData.specGroups
                          .find((g) => g.label === 'Mechanical')
                          ?.specs?.map((spec, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                list="mechanical-spec-suggestions"
                                placeholder="Parameter (e.g. Dimensions)"
                                value={spec.label}
                                onChange={(e) =>
                                  handleUpdateSpecRow('Mechanical', index, 'label', e.target.value)
                                }
                                className="w-1/2 h-10 px-3 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g. 360 × 290 × 130 mm)"
                                value={spec.value}
                                onChange={(e) =>
                                  handleUpdateSpecRow('Mechanical', index, 'value', e.target.value)
                                }
                                className="flex-1 h-10 px-3 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecRow('Mechanical', index)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                                title="Remove parameter"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </DrawerSection>
                </div>

                {/* ---------------------------------------------------- */}
                {/* 7) Technical Datasheet (PDF) */}
                {/* ---------------------------------------------------- */}
                <div id="section-datasheet">
                  <DrawerSection title="7. TECHNICAL DATASHEET (PDF)">
                    <div className="space-y-3.5">
                      <p className="text-[12px] text-slate-500">
                        Upload a technical PDF documentation file or provide a public URL. If omitted, the client hides the datasheet card.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                            Datasheet URL / Path
                          </label>
                          <input
                            type="text"
                            value={formData.datasheetUrl}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, datasheetUrl: e.target.value }));
                              setIsDirty(true);
                            }}
                            placeholder="https://... or /downloads/inverter.pdf"
                            className="w-full h-10 px-3 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                            Datasheet Size Display
                          </label>
                          <input
                            type="text"
                            value={formData.datasheetSize}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, datasheetSize: e.target.value }));
                              setIsDirty(true);
                            }}
                            placeholder="e.g. 2.1 MB"
                            className="w-full h-10 px-3 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500"
                          />
                        </div>
                      </div>

                      {/* Upload / Actions Bar */}
                      <div className="flex items-center justify-between pt-1">
                        <input
                          ref={datasheetFileInputRef}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={handleDatasheetFileUpload}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Upload}
                          onClick={() => datasheetFileInputRef.current?.click()}
                        >
                          Upload PDF Document (max 10MB)
                        </Button>

                        {formData.datasheetUrl && (
                          <div className="flex items-center gap-2">
                            <a
                              href={formData.datasheetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-semibold text-electric-600 hover:underline"
                            >
                              <span>Preview PDF</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={handleClearDatasheet}
                              className="text-[12px] font-semibold text-rose-600 hover:underline ml-2"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DrawerSection>
                </div>

                {/* ---------------------------------------------------- */}
                {/* 8) Descriptions */}
                {/* ---------------------------------------------------- */}
                <div id="section-description">
                  <DrawerSection title="8. DESCRIPTIONS & SUMMARY">
                    <div className="space-y-4">
                      {/* Short Summary with Counter */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[13px] font-semibold text-slate-700">
                            Short Summary (Shown on Product Cards)
                          </label>
                          <span
                            className={`text-[11px] font-mono ${
                              formData.shortDesc.length > 120 ? 'text-rose-600 font-bold' : 'text-slate-400'
                            }`}
                          >
                            {formData.shortDesc.length} / 120 chars
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={120}
                          value={formData.shortDesc}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, shortDesc: e.target.value }));
                            setIsDirty(true);
                          }}
                          placeholder="e.g. High-efficiency residential string inverter with integrated AFCI..."
                          className="w-full h-11 px-3.5 rounded-xl bg-white text-navy text-[14px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all"
                        />
                      </div>

                      {/* Full Technical Description with Counter */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[13px] font-semibold text-slate-700">
                            Full Technical Description (Product Details Page)
                          </label>
                          <span
                            className={`text-[11px] font-mono ${
                              formData.description.length > 600 ? 'text-rose-600 font-bold' : 'text-slate-400'
                            }`}
                          >
                            {formData.description.length} / 600 chars
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          maxLength={600}
                          value={formData.description}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, description: e.target.value }));
                            setIsDirty(true);
                          }}
                          placeholder="Comprehensive engineering description covering MPPT operating windows, DC/AC safety interlocks, and remote cloud telemetry..."
                          className="w-full p-3.5 rounded-xl bg-white text-navy text-[13px] border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 transition-all resize-y min-h-[110px]"
                        />
                      </div>
                    </div>
                  </DrawerSection>
                </div>
              </form>

              {/* RIGHT COLUMN: LIVE MOBILE PHONE PREVIEW (DESKTOP ONLY) */}
              {showLivePreview && (
                <div className="hidden xl:block w-[360px] shrink-0 sticky top-14">
                  <div className="rounded-[36px] bg-[#02070A] p-3 shadow-2xl border-[4px] border-slate-800">
                    {/* Phone Screen Container */}
                    <div className="rounded-[28px] bg-[#F7FAFC] overflow-hidden flex flex-col h-[640px] text-left select-none relative">
                      {/* Top Phone Notch / Status Bar */}
                      <div className="h-6 bg-white shrink-0 flex items-center justify-between px-4 text-[10px] font-bold text-slate-600 border-b border-slate-100">
                        <span>9:41</span>
                        <div className="w-14 h-3.5 bg-black rounded-full" />
                        <span>5G 100%</span>
                      </div>

                      {/* Segmented Control: Product Card vs Details Page */}
                      <div className="p-2 bg-white border-b border-slate-100 shrink-0">
                        <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xl bg-slate-100 text-[11px] font-semibold">
                          <button
                            type="button"
                            onClick={() => setPreviewTab('card')}
                            className={`py-1 rounded-lg transition-all ${
                              previewTab === 'card'
                                ? 'bg-white text-navy shadow-xs'
                                : 'text-slate-500 hover:text-navy'
                            }`}
                          >
                            Product Card
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewTab('details')}
                            className={`py-1 rounded-lg transition-all ${
                              previewTab === 'details'
                                ? 'bg-white text-navy shadow-xs'
                                : 'text-slate-500 hover:text-navy'
                            }`}
                          >
                            Details Page
                          </button>
                        </div>
                      </div>

                      {/* Scrollable Phone Body */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
                        {previewTab === 'card' ? (
                          <div className="space-y-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                              Storefront Card Preview
                            </span>
                            <div className="pointer-events-none">
                              <ProductCard product={previewProduct} layout="vertical" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center pt-2">
                              Horizontal List Preview
                            </span>
                            <div className="pointer-events-none">
                              <ProductCard product={previewProduct} layout="horizontal" />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 pointer-events-none">
                            {/* Live Gallery in Phone */}
                            <ProductGallery
                              images={previewProduct.gallery}
                              name={previewProduct.name}
                            />

                            {/* Details Header */}
                            <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="electric" size="xs">
                                  {previewProduct.category}
                                </Badge>
                                <span className="text-[10px] font-mono text-slate-500 font-bold">
                                  {previewProduct.model}
                                </span>
                              </div>
                              <h3 className="font-display text-xs font-bold text-navy leading-snug line-clamp-2">
                                {previewProduct.name}
                              </h3>
                              <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                                {previewProduct.description || previewProduct.shortDesc}
                              </p>

                              {/* Stat Metrics Bar */}
                              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-center">
                                <div className="p-1.5 rounded-lg bg-slate-50">
                                  <span className="text-[8px] text-slate-400 block uppercase">
                                    Power
                                  </span>
                                  <span className="font-display text-[10px] font-bold text-navy">
                                    {previewProduct.capacityKw} kW
                                  </span>
                                </div>
                                <div className="p-1.5 rounded-lg bg-slate-50">
                                  <span className="text-[8px] text-slate-400 block uppercase">
                                    Efficiency
                                  </span>
                                  <span className="font-display text-[10px] font-bold text-emerald-600">
                                    {previewProduct.efficiency}%
                                  </span>
                                </div>
                                <div className="p-1.5 rounded-lg bg-slate-50">
                                  <span className="text-[8px] text-slate-400 block uppercase">
                                    Phase
                                  </span>
                                  <span className="font-display text-[9px] font-bold text-navy truncate block">
                                    {previewProduct.phase}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Datasheet Card (conditionally shown) */}
                            {(previewProduct.datasheetUrl || previewProduct.datasheetSize) && (
                              <div className="p-2.5 rounded-xl bg-iceblue border border-electric-200/80 flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-7 h-7 rounded-lg bg-electric-500 text-white flex items-center justify-center shrink-0">
                                    <FileDown className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-[10px] font-bold text-navy truncate">
                                      Datasheet (PDF)
                                    </h5>
                                    <span className="text-[9px] text-slate-500 font-mono">
                                      {previewProduct.datasheetSize || 'Available'}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[9px] font-bold text-electric-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  View PDF
                                </span>
                              </div>
                            )}

                            {/* Live Specifications Component */}
                            <ProductSpecifications
                              specGroups={previewProduct.specGroups}
                              highlights={previewProduct.highlights}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This will permanently remove this inverter model from the catalog and quote pipeline."
        confirmText="Delete Product"
        isLoading={isDeleting}
      />
    </div>
  );
}
