import { getStorage, setStorage, removeStorage, delay } from './storageHelper.js';

const SESSION_KEY = 'solardepot_admin_session';

export const DEFAULT_ADMIN_USER = {
  id: 'usr-admin-1',
  name: 'Alexandre Mercer',
  email: 'admin@solardepot.com',
  role: 'Super Admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  title: 'Principal Systems Administrator',
  department: 'Executive Operations',
  lastLogin: new Date().toISOString(),
};

export const authService = {
  async getSession() {
    await delay(60);
    const session = getStorage(SESSION_KEY, null);
    return session;
  },

  async login(email, password) {
    await delay(300);
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Check against seeded demo credentials
    if (normalizedEmail === 'admin@solardepot.com' && password === 'Admin@123') {
      const user = {
        ...DEFAULT_ADMIN_USER,
        lastLogin: new Date().toISOString(),
      };
      setStorage(SESSION_KEY, user);
      return { success: true, user };
    }

    // Allow user from users list if they match
    const users = getStorage('solardepot_admin_users', []);
    const found = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && (u.password === password || password === 'Admin@123')
    );

    if (found && found.status === 'Active') {
      const user = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role || 'Admin',
        avatar: found.avatar || DEFAULT_ADMIN_USER.avatar,
        title: found.title || 'Platform Engineer',
        department: 'Operations',
        lastLogin: new Date().toISOString(),
      };
      setStorage(SESSION_KEY, user);
      return { success: true, user };
    }

    throw new Error('Invalid email or password. Use demo credentials: admin@solardepot.com / Admin@123');
  },

  async logout() {
    await delay(100);
    removeStorage(SESSION_KEY);
    return { success: true };
  },

  async updateProfile(updates) {
    await delay(150);
    const current = getStorage(SESSION_KEY, DEFAULT_ADMIN_USER);
    const updated = { ...current, ...updates };
    setStorage(SESSION_KEY, updated);
    return updated;
  },
};
