import { useCallback, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

/**
 * useState that is initialised from and persisted to localStorage.
 * Corrupt or unexpected stored data falls back to `initialValue`.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
): [T, (value: T | ((previous: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue, isValid))

  const setStoredValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved = next instanceof Function ? next(previous) : next
        writeStorage(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, setStoredValue]
}
