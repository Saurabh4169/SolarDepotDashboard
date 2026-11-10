/**
 * Admin Storage Helper
 * Provides a reliable abstraction layer over localStorage with cross-context event notification.
 */

export const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const getStorage = (key, fallback = []) => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined || raw === '') {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[AdminStorage] Failed to read "${key}":`, err);
    return fallback;
  }
};

export const setStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event so same-tab hooks update instantaneously
    window.dispatchEvent(
      new CustomEvent('solardepot_storage_update', {
        detail: { key, value },
      })
    );
    return true;
  } catch (err) {
    console.error(`[AdminStorage] Failed to write "${key}":`, err);
    return false;
  }
};

export const removeStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent('solardepot_storage_update', {
        detail: { key, value: null },
      })
    );
  } catch (err) {
    console.error(`[AdminStorage] Failed to remove "${key}":`, err);
  }
};

