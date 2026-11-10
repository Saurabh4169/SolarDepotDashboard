import { getStorage, setStorage, removeStorage, delay } from './storageHelper.js';
import { companyData as initialCompany } from '../../data/companyData.js';

const SETTINGS_KEY = 'solardepot_admin_settings';

const DEFAULT_SETTINGS = {
  companyName: initialCompany.name,
  tagline: initialCompany.tagline,
  description: initialCompany.description,
  address: initialCompany.address,
  primaryEmail: initialCompany.email,
  supportEmail: initialCompany.supportEmail,
  phone: initialCompany.phones[0] || '+1 212 300 4115',
  website: initialCompany.website,
  operatingHours: initialCompany.operatingHours,
  emergencySupport: initialCompany.emergencySupport,
  accentColor: 'electric',
  systemStatus: 'Operational',
  allowNewRegistrations: true,
  autoNotifyOnQuote: true,
  maintenanceMode: false,
};

const ensureSeeded = () => {
  const existing = getStorage(SETTINGS_KEY, null);
  if (!existing || typeof existing !== 'object') {
    setStorage(SETTINGS_KEY, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return existing;
};

export const settingsService = {
  async getSettings() {
    await delay(70);
    return ensureSeeded();
  },

  async updateSettings(updates) {
    await delay(180);
    const current = ensureSeeded();
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorage(SETTINGS_KEY, updated);
    return updated;
  },

  async getStorageStats() {
    await delay(50);
    let totalBytes = 0;
    const keys = [
      'solardepot_admin_products',
      'solardepot_admin_categories',
      'solardepot_admin_solutions',
      'solardepot_admin_projects',
      'solardepot_admin_resources',
      'solardepot_enquiries',
      'solardepot_admin_customers',
      'solardepot_admin_users',
      'solardepot_notifications',
      'solardepot_admin_settings',
    ];

    const keyStats = {};
    keys.forEach((k) => {
      const val = window.localStorage.getItem(k) || '';
      const bytes = val.length * 2; // UTF-16 approximate
      totalBytes += bytes;
      keyStats[k] = {
        bytes,
        count: (() => {
          try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed.length : 1;
          } catch {
            return 0;
          }
        })(),
      };
    });

    return {
      totalBytes,
      totalKb: (totalBytes / 1024).toFixed(1),
      keyStats,
    };
  },

  async resetAllData() {
    await delay(300);
    removeStorage('solardepot_admin_products');
    removeStorage('solardepot_admin_categories');
    removeStorage('solardepot_admin_solutions');
    removeStorage('solardepot_admin_projects');
    removeStorage('solardepot_admin_resources');
    removeStorage('solardepot_enquiries');
    removeStorage('solardepot_admin_customers');
    removeStorage('solardepot_admin_users');
    removeStorage('solardepot_notifications');
    removeStorage('solardepot_admin_settings');
    return { success: true };
  },
};
