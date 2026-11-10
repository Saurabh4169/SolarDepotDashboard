import { getStorage, setStorage, delay } from './storageHelper.js';

const STORAGE_KEY = 'solardepot_admin_customers';

const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    companyName: 'Apex Energy Partners LLC',
    contactPerson: 'Alex Morgan',
    email: 'alex.morgan@apexenergy.com',
    phone: '+1 (555) 382-9011',
    tier: 'Tier 1 Verified EPC',
    status: 'Active',
    location: 'New York, NY',
    joinedDate: '2023-03-15',
    totalEnquiries: 12,
    totalQuotes: 8,
    assignedEngineer: 'Sarah Chen',
  },
  {
    id: 'cust-2',
    companyName: 'SunVanguard EPC Corp',
    contactPerson: 'David Miller',
    email: 'david.miller@sunvanguard.com',
    phone: '+1 (555) 491-2384',
    tier: 'Gold EPC Partner',
    status: 'Active',
    location: 'Austin, TX',
    joinedDate: '2023-07-22',
    totalEnquiries: 9,
    totalQuotes: 6,
    assignedEngineer: 'Marcus Vance',
  },
  {
    id: 'cust-3',
    companyName: 'Helios GreenTech Solutions',
    contactPerson: 'Elena Rostova',
    email: 'elena.rostova@helios-tech.io',
    phone: '+1 (555) 843-1190',
    tier: 'Silver Installer',
    status: 'Active',
    location: 'San Jose, CA',
    joinedDate: '2024-01-10',
    totalEnquiries: 5,
    totalQuotes: 4,
    assignedEngineer: 'Sarah Chen',
  },
  {
    id: 'cust-4',
    companyName: 'GridEdge Solar Systems',
    contactPerson: 'Robert Chen',
    email: 'r.chen@gridedgesolar.net',
    phone: '+1 (555) 672-4091',
    tier: 'Tier 1 Verified EPC',
    status: 'Active',
    location: 'Denver, CO',
    joinedDate: '2023-11-04',
    totalEnquiries: 14,
    totalQuotes: 11,
    assignedEngineer: 'Admin User',
  },
  {
    id: 'cust-5',
    companyName: 'Pacific Commercial Power',
    contactPerson: 'Sarah Jenkins',
    email: 'sarah.j@pacificpower.com',
    phone: '+1 (555) 918-3320',
    tier: 'Commercial Specialist',
    status: 'Active',
    location: 'Seattle, WA',
    joinedDate: '2024-04-18',
    totalEnquiries: 4,
    totalQuotes: 2,
    assignedEngineer: 'Marcus Vance',
  },
  {
    id: 'cust-6',
    companyName: 'NextEra Distributed Energy',
    contactPerson: 'Michael Torres',
    email: 'mtorres@nextera-dist.com',
    phone: '+1 (555) 304-7712',
    tier: 'Utility Alliance',
    status: 'Inactive',
    location: 'Phoenix, AZ',
    joinedDate: '2024-08-01',
    totalEnquiries: 2,
    totalQuotes: 1,
    assignedEngineer: 'Sarah Chen',
  },
];

const ensureSeeded = () => {
  const existing = getStorage(STORAGE_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    setStorage(STORAGE_KEY, INITIAL_CUSTOMERS);
    return INITIAL_CUSTOMERS;
  }
  return existing;
};

export const customersService = {
  async getAll(params = {}) {
    await delay(80);
    let list = ensureSeeded();
    const { status, tier, search } = params;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.companyName?.toLowerCase().includes(q) ||
          c.contactPerson?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      list = list.filter((c) => c.status === status);
    }

    if (tier && tier !== 'All') {
      list = list.filter((c) => c.tier === tier);
    }

    return list;
  },

  async getById(id) {
    await delay(60);
    const list = ensureSeeded();
    const item = list.find((c) => c.id === id);
    if (!item) throw new Error(`Customer "${id}" not found`);
    return item;
  },

  async create(data) {
    await delay(160);
    const list = ensureSeeded();
    const id = `cust-${Date.now().toString(36)}`;

    const newCustomer = {
      id,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone || '',
      tier: data.tier || 'Verified EPC Partner',
      status: data.status || 'Active',
      location: data.location || 'United States',
      joinedDate: new Date().toISOString().split('T')[0],
      totalEnquiries: 0,
      totalQuotes: 0,
      assignedEngineer: data.assignedEngineer || 'Admin User',
      createdAt: new Date().toISOString(),
    };

    const updated = [newCustomer, ...list];
    setStorage(STORAGE_KEY, updated);
    return newCustomer;
  },

  async update(id, updates) {
    await delay(160);
    const list = ensureSeeded();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Customer "${id}" not found`);

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
    const item = list.find((c) => c.id === id);
    if (!item) throw new Error(`Customer "${id}" not found`);
    item.status = item.status === 'Active' ? 'Inactive' : 'Active';
    item.updatedAt = new Date().toISOString();
    setStorage(STORAGE_KEY, list);
    return item;
  },

  async remove(id) {
    await delay(120);
    const list = ensureSeeded();
    const filtered = list.filter((c) => c.id !== id);
    setStorage(STORAGE_KEY, filtered);
    return { success: true };
  },
};
