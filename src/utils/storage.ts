/**
 * Safe wrappers around Web Storage. Stored values are JSON; anything that fails to
 * parse or fails the optional type guard falls back to the provided default.
 */
export function readStorage<T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => value is T,
  storage: Storage = window.localStorage,
): T {
  try {
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (isValid && !isValid(parsed)) return fallback
    return parsed as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T, storage: Storage = window.localStorage): void {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be full or disabled (e.g. private mode); the app keeps working in memory.
  }
}

export function removeStorage(key: string, storage: Storage = window.localStorage): void {
  try {
    storage.removeItem(key)
  } catch {
    // Ignore: nothing to clean up if storage is unavailable.
  }
}

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
