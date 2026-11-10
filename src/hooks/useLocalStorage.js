import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Synchronize across tabs and listen to custom internal storage update events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key !== key) return;
      try {
        const fresh = window.localStorage.getItem(key);
        if (fresh !== null) {
          setStoredValue(JSON.parse(fresh));
        }
      } catch (err) {
        console.warn(`Error syncing storage for "${key}":`, err);
      }
    };

    const handleCustomUpdate = (e) => {
      if (e.detail && e.detail.key && e.detail.key !== key) return;
      try {
        const fresh = window.localStorage.getItem(key);
        if (fresh !== null) {
          setStoredValue(JSON.parse(fresh));
        }
      } catch (err) {
        console.warn(`Error syncing custom storage update for "${key}":`, err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('solardepot_storage_update', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('solardepot_storage_update', handleCustomUpdate);
    };
  }, [key]);

  return [storedValue, setStoredValue];
}
