export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota or serialization failure; ignore silently
  }
}

export const STORAGE_KEYS = {
  bookmarks: 'citysense_bookmarks',
  reports: 'citysense_reports',
  compareList: 'citysense_compare',
} as const;
