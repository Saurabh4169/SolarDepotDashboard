import { getStorage, setStorage, delay } from './storageHelper.js';
import { initialEnquiries } from '../../data/demoData.js';

const STORAGE_KEY = 'solardepot_enquiries';
const NOTIFICATIONS_KEY = 'solardepot_notifications';

const ensureSeeded = () => {
  const existing = getStorage(STORAGE_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    setStorage(STORAGE_KEY, initialEnquiries);
    return initialEnquiries;
  }
  return existing;
};

export const enquiriesService = {
  async getAll(params = {}) {
    await delay(90);
    let list = ensureSeeded();
    const { status, search } = params;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.id?.toLowerCase().includes(q) ||
          e.contact?.name?.toLowerCase().includes(q) ||
          e.contact?.email?.toLowerCase().includes(q) ||
          e.productOrSolution?.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      list = list.filter((e) => {
        if (status === 'New') return e.status === 'New' || e.status === 'Submitted (Demo)';
        if (status === 'In Review') return e.status === 'In Review' || e.status === 'Engineering Review';
        return e.status === status;
      });
    }

    return list;
  },

  async getById(id) {
    await delay(60);
    const list = ensureSeeded();
    const item = list.find((e) => e.id === id);
    if (!item) throw new Error(`Enquiry "${id}" not found`);
    return item;
  },

  async updateStatus(id, newStatus, replyNote = '', notifyCustomer = true) {
    await delay(200);
    const list = ensureSeeded();
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Enquiry "${id}" not found`);

    const current = list[index];

    let statusColor = 'electric';
    if (['Quote Prepared', 'Paid', 'Active', 'Completed'].includes(newStatus)) {
      statusColor = 'emerald';
    } else if (['Pending', 'In Review', 'Engineering Review'].includes(newStatus)) {
      statusColor = 'amber';
    } else if (['Closed', 'Rejected'].includes(newStatus)) {
      statusColor = 'rose';
    } else if (['Replied'].includes(newStatus)) {
      statusColor = 'slate';
    }

    const updated = {
      ...current,
      status: newStatus,
      statusColor,
      replyNote: replyNote || current.replyNote || '',
      estimatedResponse:
        newStatus === 'Quote Prepared'
          ? 'Quote ready for review in portal'
          : newStatus === 'Replied'
          ? 'Replied by Solar Engineering Team'
          : newStatus === 'Closed'
          ? 'Enquiry concluded'
          : current.estimatedResponse,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    setStorage(STORAGE_KEY, list);

    // If requested, push a notification into the user's mobile notifications
    if (notifyCustomer) {
      try {
        const notifications = getStorage(NOTIFICATIONS_KEY, []);
        const newNotif = {
          id: `n-${Date.now()}`,
          title: `Update on Enquiry ${current.id}`,
          body:
            newStatus === 'Quote Prepared'
              ? `A formal quote has been generated for ${current.productOrSolution}. Tap to review specifications.`
              : replyNote || `Your inquiry status changed to "${newStatus}".`,
          time: 'Just now',
          unread: true,
          type: 'quote',
          targetRoute: '/my-enquiries',
          createdAt: new Date().toISOString(),
        };
        setStorage(NOTIFICATIONS_KEY, [newNotif, ...notifications]);
      } catch (err) {
        console.warn('Could not dispatch customer notification:', err);
      }
    }

    return updated;
  },

  async create(data) {
    await delay(180);
    const list = ensureSeeded();
    const newId = `SDQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEnquiry = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      type: data.type || 'Product Quote',
      productOrSolution: data.productOrSolution || 'Inverter System',
      capacity: data.capacity || '10 kW',
      quantity: data.quantity || '1 unit',
      projectType: data.projectType || 'Commercial Rooftop',
      status: data.status || 'New',
      statusColor: 'electric',
      notes: data.notes || '',
      replyNote: '',
      estimatedResponse: 'Under review by Tech Support',
      contact: {
        name: data.contactName || 'Partner Client',
        email: data.contactEmail || 'partner@example.com',
        phone: data.contactPhone || '+1 (555) 000-0000',
      },
      createdAt: new Date().toISOString(),
    };

    const updated = [newEnquiry, ...list];
    setStorage(STORAGE_KEY, updated);
    return newEnquiry;
  },

  async remove(id) {
    await delay(120);
    const list = ensureSeeded();
    const filtered = list.filter((e) => e.id !== id);
    setStorage(STORAGE_KEY, filtered);
    return { success: true };
  },
};
