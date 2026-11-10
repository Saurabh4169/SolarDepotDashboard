import { getStorage, setStorage, delay } from './storageHelper.js';
import { initialNotifications } from '../../data/demoData.js';

const STORAGE_KEY = 'solardepot_notifications';

const ensureSeeded = () => {
  const existing = getStorage(STORAGE_KEY, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    setStorage(STORAGE_KEY, initialNotifications);
    return initialNotifications;
  }
  return existing;
};

export const notificationsService = {
  async getAll() {
    await delay(70);
    return ensureSeeded();
  },

  async send(data) {
    await delay(180);
    const list = ensureSeeded();
    const newId = `notif-${Date.now().toString(36)}`;

    const newNotification = {
      id: newId,
      title: data.title,
      body: data.body,
      time: 'Just now',
      unread: true,
      type: data.type || 'system',
      targetRoute: data.targetRoute || '/my-enquiries',
      createdAt: new Date().toISOString(),
    };

    const updated = [newNotification, ...list];
    setStorage(STORAGE_KEY, updated);
    return newNotification;
  },

  async markAllRead() {
    await delay(100);
    const list = ensureSeeded();
    const updated = list.map((n) => ({ ...n, unread: false }));
    setStorage(STORAGE_KEY, updated);
    return updated;
  },

  async remove(id) {
    await delay(100);
    const list = ensureSeeded();
    const filtered = list.filter((n) => n.id !== id);
    setStorage(STORAGE_KEY, filtered);
    return { success: true };
  },
};
