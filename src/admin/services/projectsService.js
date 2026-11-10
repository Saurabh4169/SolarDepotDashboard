import { getStorage, setStorage, delay } from './storageHelper.js';
import { projects as initialProjects } from '../../data/projectsData.js';

const STORAGE_KEY = 'solardepot_admin_projects';

const ensureSeeded = () => {
  const existing = getStorage(STORAGE_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    const formatted = initialProjects.map((p) => ({
      ...p,
      active: true,
      createdAt: '2026-10-01T08:00:00.000Z',
    }));
    setStorage(STORAGE_KEY, formatted);
    return formatted;
  }
  return existing;
};

export const projectsService = {
  async getAll(params = {}) {
    await delay(80);
    let list = ensureSeeded();
    const { category, search } = params;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      list = list.filter((p) => p.category === category);
    }

    return list;
  },

  async getById(id) {
    await delay(60);
    const list = ensureSeeded();
    const item = list.find((p) => p.id === id || p.slug === id);
    if (!item) throw new Error(`Project "${id}" not found`);
    return item;
  },

  async create(data) {
    await delay(160);
    const list = ensureSeeded();
    const id = `pr-${Date.now().toString(36)}`;
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newProject = {
      id,
      slug,
      title: data.title,
      category: data.category || 'Commercial',
      location: data.location || 'United States',
      year: data.year || new Date().getFullYear().toString(),
      capacity: data.capacity || '50 kW',
      image: data.image || '/images/projects/project-office-50kw.jpg',
      excerpt: data.excerpt || data.title,
      description: data.description || '',
      associatedProductIds: data.associatedProductIds || ['p1'],
      relatedSolutionSlug: data.relatedSolutionSlug || 'commercial-solar',
      details: data.details || [
        { label: 'System Size', value: data.capacity || '50 kW' },
        { label: 'Annual Yield', value: '~60,000 kWh' },
      ],
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newProject, ...list];
    setStorage(STORAGE_KEY, updated);
    return newProject;
  },

  async update(id, updates) {
    await delay(160);
    const list = ensureSeeded();
    const index = list.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) throw new Error(`Project "${id}" not found`);

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
    const filtered = list.filter((p) => p.id !== id && p.slug !== id);
    setStorage(STORAGE_KEY, filtered);
    return { success: true };
  },
};
