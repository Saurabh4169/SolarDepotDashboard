import { getStorage, setStorage, delay } from './storageHelper.js';

const STORAGE_KEY = 'solardepot_admin_users';

const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Alexandre Mercer',
    email: 'admin@solardepot.com',
    role: 'Super Admin',
    department: 'Executive Operations',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    lastLogin: '2026-11-09T14:22:10.000Z',
    createdAt: '2025-01-10',
  },
  {
    id: 'usr-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@solardepot.com',
    role: 'Admin',
    department: 'Technical Operations',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    lastLogin: '2026-11-08T09:15:00.000Z',
    createdAt: '2025-03-12',
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@solardepot.com',
    role: 'Support',
    department: 'Engineering Desk',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastLogin: '2026-11-07T16:45:00.000Z',
    createdAt: '2025-06-20',
  },
  {
    id: 'usr-4',
    name: 'Elena Ward',
    email: 'elena.ward@solardepot.com',
    role: 'Support',
    department: 'Customer Care',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    lastLogin: '2026-10-15T11:00:00.000Z',
    createdAt: '2025-09-05',
  },
];

const ensureSeeded = () => {
  const existing = getStorage(STORAGE_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    setStorage(STORAGE_KEY, INITIAL_USERS);
    return INITIAL_USERS;
  }
  return existing;
};

export const usersService = {
  async getAll(params = {}) {
    await delay(80);
    let list = ensureSeeded();
    const { role, status, search } = params;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.department?.toLowerCase().includes(q)
      );
    }

    if (role && role !== 'All') {
      list = list.filter((u) => u.role === role);
    }

    if (status && status !== 'All') {
      list = list.filter((u) => u.status === status);
    }

    return list;
  },

  async getById(id) {
    await delay(60);
    const list = ensureSeeded();
    const item = list.find((u) => u.id === id);
    if (!item) throw new Error(`User "${id}" not found`);
    return item;
  },

  async create(data) {
    await delay(160);
    const list = ensureSeeded();
    const id = `usr-${Date.now().toString(36)}`;

    const newUser = {
      id,
      name: data.name,
      email: data.email,
      role: data.role || 'Admin',
      department: data.department || 'Operations',
      status: data.status || 'Active',
      avatar:
        data.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0297DE&color=fff`,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newUser, ...list];
    setStorage(STORAGE_KEY, updated);
    return newUser;
  },

  async update(id, updates) {
    await delay(160);
    const list = ensureSeeded();
    const index = list.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User "${id}" not found`);

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEY, list);
    return list[index];
  },

  async toggleStatus(id) {
    await delay(100);
    const list = ensureSeeded();
    const item = list.find((u) => u.id === id);
    if (!item) throw new Error(`User "${id}" not found`);
    item.status = item.status === 'Active' ? 'Inactive' : 'Active';
    item.updatedAt = new Date().toISOString();
    setStorage(STORAGE_KEY, list);
    return item;
  },

  async remove(id) {
    await delay(120);
    const list = ensureSeeded();
    const filtered = list.filter((u) => u.id !== id);
    setStorage(STORAGE_KEY, filtered);
    return { success: true };
  },
};
