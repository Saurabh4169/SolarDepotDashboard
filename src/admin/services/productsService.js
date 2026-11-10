import { getStorage, setStorage, delay } from './storageHelper.js';
import { products as initialProducts, featuredProductSlugs } from '../../data/productsData.js';

const STORAGE_KEY = 'solardepot_admin_products';

const ensureSeeded = () => {
  const existing = getStorage(STORAGE_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    const formatted = initialProducts.map((p) => {
      const isFeat = featuredProductSlugs ? featuredProductSlugs.includes(p.slug) : false;
      const isActive = p.isActive !== undefined ? p.isActive : (p.active !== undefined ? p.active : true);
      return {
        ...p,
        isActive,
        active: isActive,
        featured: p.featured !== undefined ? p.featured : isFeat,
        gallery: p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []),
        highlights: p.highlights || [],
        specGroups: p.specGroups || [
          {
            label: 'Electrical',
            specs: [
              { label: 'Rated Power', value: `${p.capacityKw || 5} kW` },
              { label: 'Max Efficiency', value: `${p.efficiency || 98}%` },
            ],
          },
          {
            label: 'Mechanical',
            specs: [
              { label: 'Protection Rating', value: p.enclosure || 'IP65' },
            ],
          },
        ],
        datasheetSize: p.datasheetSize || '',
        datasheetUrl: p.datasheetUrl || '',
        createdAt: p.createdAt || '2026-10-01T08:00:00.000Z',
        updatedAt: p.updatedAt || '2026-11-01T12:00:00.000Z',
      };
    });
    setStorage(STORAGE_KEY, formatted);
    return formatted;
  }

  // Ensure any existing stored products have normalized fields
  let modified = false;
  const normalized = existing.map((p) => {
    const isActive = p.isActive !== undefined ? p.isActive : (p.active !== undefined ? p.active : true);
    const isFeat = p.featured !== undefined ? p.featured : (featuredProductSlugs ? featuredProductSlugs.includes(p.slug) : false);
    const gallery = p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []);
    if (p.isActive === undefined || p.featured === undefined || !p.gallery) {
      modified = true;
    }
    return {
      ...p,
      isActive,
      active: isActive,
      featured: isFeat,
      gallery,
      highlights: p.highlights || [],
      specGroups: p.specGroups || [],
      datasheetSize: p.datasheetSize || '',
      datasheetUrl: p.datasheetUrl || '',
    };
  });
  if (modified) {
    setStorage(STORAGE_KEY, normalized);
  }
  return normalized;
};

export const productsService = {
  async getAll(params = {}) {
    await delay(100);
    let list = ensureSeeded();
    const {
      search = '',
      category = 'All',
      phase = 'All',
      status = 'All',
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = params;

    // Filter by search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.model?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      list = list.filter((p) => p.category === category || p.categorySlug === category);
    }

    // Filter by phase
    if (phase && phase !== 'All') {
      list = list.filter((p) => p.phase === phase);
    }

    // Filter by status
    if (status && status !== 'All') {
      const isActive = status === 'Active';
      list = list.filter((p) => (p.isActive !== undefined ? Boolean(p.isActive) : Boolean(p.active)) === isActive);
    }

    // Sorting
    list = [...list].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'capacityKw' || sortBy === 'efficiency') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getById(id) {
    await delay(60);
    const list = ensureSeeded();
    const found = list.find((p) => p.id === id || p.slug === id);
    if (!found) throw new Error(`Product with ID "${id}" not found`);
    return found;
  },

  async create(data) {
    await delay(180);
    const list = ensureSeeded();
    const newId = data.id || `p-${Date.now().toString(36)}`;
    const slug =
      data.slug ||
      (data.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const isActive = data.isActive !== undefined ? Boolean(data.isActive) : (data.active !== undefined ? Boolean(data.active) : true);
    const gallery = Array.isArray(data.gallery) && data.gallery.length > 0
      ? data.gallery
      : (data.image ? [data.image] : []);
    const coverImage = gallery[0] || data.image || '/images/products/inverter-5kw.jpg';

    const newProduct = {
      id: newId,
      slug,
      name: data.name,
      model: data.model,
      category: data.category || 'Single-Phase String Inverters',
      categorySlug:
        data.categorySlug ||
        (data.category || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      phase: data.phase || 'Single-Phase',
      capacityKw: parseFloat(data.capacityKw) || 0,
      efficiency: parseFloat(data.efficiency) || 0,
      warranty: data.warranty || '10 Years',
      enclosure: data.enclosure || 'IP65',
      datasheetSize: data.datasheetSize || '',
      datasheetUrl: data.datasheetUrl || '',
      rating: data.rating !== undefined ? Number(data.rating) : 5.0,
      reviewCount: data.reviewCount !== undefined ? Number(data.reviewCount) : 0,
      shortDesc: data.shortDesc || '',
      description: data.description || '',
      image: coverImage,
      gallery,
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      specGroups: Array.isArray(data.specGroups) ? data.specGroups : [],
      featured: Boolean(data.featured),
      isActive,
      active: isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProduct, ...list];
    setStorage(STORAGE_KEY, updated);
    return newProduct;
  },

  async update(id, updates) {
    await delay(180);
    const list = ensureSeeded();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product with ID "${id}" not found`);

    const current = list[index];
    const isActive = updates.isActive !== undefined ? Boolean(updates.isActive) : (updates.active !== undefined ? Boolean(updates.active) : current.isActive !== undefined ? current.isActive : current.active);

    const gallery = Array.isArray(updates.gallery) ? updates.gallery : current.gallery;
    const coverImage = (gallery && gallery[0]) || updates.image || current.image;

    const updatedItem = {
      ...current,
      ...updates,
      capacityKw: updates.capacityKw !== undefined ? parseFloat(updates.capacityKw) || 0 : current.capacityKw,
      efficiency: updates.efficiency !== undefined ? parseFloat(updates.efficiency) || 0 : current.efficiency,
      image: coverImage,
      gallery,
      isActive,
      active: isActive,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedItem;
    setStorage(STORAGE_KEY, list);
    return updatedItem;
  },

  async toggleStatus(id) {
    await delay(100);
    const list = ensureSeeded();
    const item = list.find((p) => p.id === id);
    if (!item) throw new Error(`Product with ID "${id}" not found`);
    const newStatus = !(item.isActive !== undefined ? item.isActive : item.active);
    item.isActive = newStatus;
    item.active = newStatus;
    item.updatedAt = new Date().toISOString();
    setStorage(STORAGE_KEY, list);
    return item;
  },

  async remove(id) {
    await delay(150);
    const list = ensureSeeded();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) {
      throw new Error(`Product with ID "${id}" not found`);
    }
    setStorage(STORAGE_KEY, filtered);
    return { success: true, id };
  },
};
