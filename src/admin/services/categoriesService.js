import { getStorage, setStorage, delay } from './storageHelper.js';
import { productCategories as initialCategories } from '../../data/productsData.js';

const STORAGE_KEY = 'solardepot_admin_categories';

const ensureSeeded = () => {
  const existing = getStorage(STORAGE_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    const formatted = initialCategories.map((c, i) => ({
      id: `cat-${i + 1}`,
      ...c,
      active: true,
      createdAt: '2026-10-01T08:00:00.000Z',
    }));
    setStorage(STORAGE_KEY, formatted);
    return formatted;
  }
  return existing;
};

export const categoriesService = {
  async getAll() {
    await delay(80);
    return ensureSeeded();
  },

  async getById(idOrSlug) {
    await delay(60);
    const list = ensureSeeded();
    const item = list.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
    if (!item) throw new Error(`Category "${idOrSlug}" not found`);
    return item;
  },

  async create(data) {
    await delay(160);
    const list = ensureSeeded();
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newCategory = {
      id: `cat-${Date.now().toString(36)}`,
      name: data.name,
      slug,
      short: data.short || data.name,
      icon: data.icon || 'Zap',
      count: parseInt(data.count, 10) || 0,
      image: data.image || '/images/products/inverter-5kw.jpg',
      description: data.description || '',
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...list, newCategory];
    setStorage(STORAGE_KEY, updated);
    return newCategory;
  },

  async update(idOrSlug, updates) {
    await delay(160);
    const list = ensureSeeded();
    const index = list.findIndex((c) => c.id === idOrSlug || c.slug === idOrSlug);
    if (index === -1) throw new Error(`Category "${idOrSlug}" not found`);

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEY, list);
    return list[index];
  },

  async remove(idOrSlug) {
    await delay(120);
    const list = ensureSeeded();
    const filtered = list.filter((c) => c.id !== idOrSlug && c.slug !== idOrSlug);
    setStorage(STORAGE_KEY, filtered);
    return { success: true };
  },
};
