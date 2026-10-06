const DEFAULT_DELAY_MS = 400

/**
 * Resolves with a deep copy of `value` after a short delay so the UI exercises its
 * loading states, and callers can never mutate the in-memory store by reference.
 */
export function mockResponse<T>(value: T, delay = DEFAULT_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(value)), delay)
  })
}

export function mockError(message: string, delay = DEFAULT_DELAY_MS): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay)
  })
}

export function nextId(items: { id: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}
