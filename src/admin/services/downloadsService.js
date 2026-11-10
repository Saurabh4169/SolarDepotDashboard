import { getStorage, setStorage, delay } from './storageHelper.js';
import { resources as initialResources } from '../../data/resourcesData.js';

const STORAGE_KEY = 'solardepot_admin_resources';

const ensureSeeded = () => {
  const existing = getStorage(STORAGE_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    const formatted = initialResources.map((r) => ({
      ...r,
      active: true,
      downloadsCount: Math.floor(25 + Math.random() * 250),
      createdAt: '2026-10-01T08:00:00.000Z',
    }));
    setStorage(STORAGE_KEY, formatted);
    return formatted;
  }
  return existing;
};

export const downloadsService = {
  async getAll(params = {}) {
    await delay(80);
    let list = ensureSeeded();
    const { category, search } = params;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q) ||
          r.model?.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All Documents') {
      list = list.filter((r) => r.category === category);
    }

    return list;
  },

  async getById(id) {
    await delay(60);
    const list = ensureSeeded();
    const item = list.find((r) => r.id === id);
    if (!item) throw new Error(`Resource "${id}" not found`);
    return item;
  },

  async create(data) {
    await delay(160);
    const list = ensureSeeded();
    const id = `res-${Date.now().toString(36)}`;

    const newResource = {
      id,
      title: data.title,
      category: data.category || 'Product Datasheets',
      format: data.format || 'PDF',
      size: data.size || '2.4 MB',
      date: data.date || new Date().toISOString().slice(0, 7),
      version: data.version || 'Rev 1.0',
      model: data.model || 'Universal',
      productId: data.productId || '',
      description: data.description || '',
      downloadsCount: 0,
      active: data.active !== undefined ? data.active : true,
      previewPages: data.previewPages || [
        {
          page: 1,
          title: 'Document Overview',
          content: data.description || 'Official technical documentation and specifications.',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updated = [newResource, ...list];
    setStorage(STORAGE_KEY, updated);
    return newResource;
  },

  async update(id, updates) {
    await delay(160);
    const list = ensureSeeded();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Resource "${id}" not found`);

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEY, list);
    return list[index];
  },

  async remove(id) {
    await delay(120);
    const list = ensureSeeded();
    const filtered = list.filter((r) => r.id !== id);
    setStorage(STORAGE_KEY, filtered);
    return { success: true };
  },
};
