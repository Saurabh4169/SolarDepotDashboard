import { getStorage, setStorage, delay } from './storageHelper.js';
import { solutions as initialSolutions } from '../../data/solutionsData.js';

const STORAGE_KEY = 'solardepot_admin_solutions';

const ensureSeeded = () => {
  const existing = getStorage(STORAGE_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    const formatted = initialSolutions.map((s) => ({
      ...s,
      active: true,
      createdAt: '2026-10-01T08:00:00.000Z',
    }));
    setStorage(STORAGE_KEY, formatted);
    return formatted;
  }
  return existing;
};

export const solutionsService = {
  async getAll() {
    await delay(80);
    return ensureSeeded();
  },

  async getById(id) {
    await delay(60);
    const list = ensureSeeded();
    const item = list.find((s) => s.id === id || s.slug === id);
    if (!item) throw new Error(`Solution "${id}" not found`);
    return item;
  },

  async create(data) {
    await delay(160);
    const list = ensureSeeded();
    const id = `sol-${Date.now().toString(36)}`;
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newSolution = {
      id,
      slug,
      name: data.name,
      shortName: data.shortName || data.name,
      tagline: data.tagline || '',
      description: data.description || '',
      image: data.image || '/images/solutions/hero-battery.jpg',
      theme: data.theme || 'light',
      icon: data.icon || 'Zap',
      suitableProductIds: data.suitableProductIds || ['p1', 'p2'],
      relatedProjectSlugs: data.relatedProjectSlugs || [],
      benefits: data.benefits || [
        'High efficiency energy delivery',
        'Intelligent cloud telemetry and remote monitoring',
      ],
      architecture: data.architecture || [
        { step: '01', title: 'Solar PV Capture', text: 'Clean DC power generation.' },
        { step: '02', title: 'Power Conversion', text: 'Intelligent high-efficiency inverter.' },
      ],
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newSolution, ...list];
    setStorage(STORAGE_KEY, updated);
    return newSolution;
  },

  async update(id, updates) {
    await delay(160);
    const list = ensureSeeded();
    const index = list.findIndex((s) => s.id === id || s.slug === id);
    if (index === -1) throw new Error(`Solution "${id}" not found`);

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
    const filtered = list.filter((s) => s.id !== id && s.slug !== id);
    setStorage(STORAGE_KEY, filtered);
    return { success: true };
  },
};
