/**
 * i18n Copy Store for UI-DSL
 * 
 * Manages internationalized text content for UI components.
 * Supports multiple locales and copy updates via setCopy patch.
 * 
 * v1.1: i18n support for conversational UI editing.
 */

export type Locale = string; // e.g., "en", "pl", "de"

export interface CopyStore {
  [key: string]: {
    [locale: Locale]: string;
  };
}

/**
 * Create a new copy store
 */
export function createCopyStore(): CopyStore {
  return {};
}

/**
 * Get copy for a key and locale
 */
export function getCopy(
  store: CopyStore,
  key: string,
  locale: Locale = 'en'
): string | undefined {
  return store[key]?.[locale];
}

/**
 * Set copy for a key and locale
 */
export function setCopy(
  store: CopyStore,
  key: string,
  locale: Locale,
  value: string
): CopyStore {
  const newStore = { ...store };
  if (!newStore[key]) {
    newStore[key] = {};
  }
  newStore[key] = { ...newStore[key], [locale]: value };
  return newStore;
}

/**
 * Set copy for multiple locales
 */
export function setCopyMulti(
  store: CopyStore,
  key: string,
  copies: Record<Locale, string>
): CopyStore {
  const newStore = { ...store };
  newStore[key] = { ...newStore[key], ...copies };
  return newStore;
}

/**
 * Get all locales for a key
 */
export function getLocales(store: CopyStore, key: string): Locale[] {
  return store[key] ? Object.keys(store[key]) : [];
}

/**
 * Get all keys in the store
 */
export function getKeys(store: CopyStore): string[] {
  return Object.keys(store);
}

/**
 * Check if a key exists in the store
 */
export function hasKey(store: CopyStore, key: string): boolean {
  return key in store;
}

/**
 * Remove a key from the store
 */
export function removeKey(store: CopyStore, key: string): CopyStore {
  const newStore = { ...store };
  delete newStore[key];
  return newStore;
}

/**
 * Merge two copy stores
 */
export function mergeCopyStores(store1: CopyStore, store2: CopyStore): CopyStore {
  const merged = { ...store1 };
  for (const key in store2) {
    merged[key] = { ...merged[key], ...store2[key] };
  }
  return merged;
}

