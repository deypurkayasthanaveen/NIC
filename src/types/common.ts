export type Status = 'Active' | 'Inactive'

export const STATUSES: Status[] = ['Active', 'Inactive']

export type SortDirection = 'asc' | 'desc'

export interface SortState<K extends string = string> {
  key: K
  direction: SortDirection
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type Theme = 'light' | 'dark'

/** Field-level validation errors keyed by form field name. */
export type FormErrors<T> = Partial<Record<keyof T, string>>
