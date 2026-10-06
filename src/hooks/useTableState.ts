import { useMemo, useState } from 'react'
import type { SortState } from '../types/common'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'

interface TableStateOptions<T, K extends keyof T & string> {
  items: T[]
  searchKeys: (keyof T)[]
  filterKeys?: (keyof T & string)[]
  initialSort?: SortState<K>
  initialSearch?: string
  pageSize?: number
}

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, { sensitivity: 'base' })
}

/**
 * Client-side search + filter + sort + pagination for any list of records.
 * Filters use exact matching; an empty string means "all".
 */
export function useTableState<T, K extends keyof T & string = keyof T & string>({
  items,
  searchKeys,
  filterKeys = [],
  initialSort,
  initialSearch = '',
  pageSize = 10,
}: TableStateOptions<T, K>) {
  const [search, setSearchValue] = useState(initialSearch)
  const [filters, setFilters] = useState<Record<string, string>>(() =>
    Object.fromEntries(filterKeys.map((key) => [key, ''])),
  )
  const [sort, setSort] = useState<SortState<K> | undefined>(initialSort)
  const debouncedSearch = useDebounce(search)

  const processed = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()

    const filtered = items.filter((item) => {
      const matchesSearch =
        !query || searchKeys.some((key) => String(item[key]).toLowerCase().includes(query))
      const matchesFilters = Object.entries(filters).every(
        ([key, value]) => !value || String(item[key as keyof T]) === value,
      )
      return matchesSearch && matchesFilters
    })

    if (!sort) return filtered
    const direction = sort.direction === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => compareValues(a[sort.key], b[sort.key]) * direction)
  }, [items, searchKeys, filters, sort, debouncedSearch])

  const pagination = usePagination(processed, pageSize)
  const { setPage } = pagination

  const setSearch = (value: string) => {
    setSearchValue(value)
    setPage(1)
  }

  const setFilter = (key: keyof T & string, value: string) => {
    setFilters((previous) => ({ ...previous, [key]: value }))
    setPage(1)
  }

  const toggleSort = (key: K) => {
    setSort((previous) =>
      previous?.key === key
        ? { key, direction: previous.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  const clearFilters = () => {
    setSearchValue('')
    setFilters(Object.fromEntries(Object.keys(filters).map((key) => [key, ''])))
    setPage(1)
  }

  const hasActiveFilters = search !== '' || Object.values(filters).some(Boolean)

  return {
    search,
    setSearch,
    filters,
    setFilter,
    sort,
    toggleSort,
    clearFilters,
    hasActiveFilters,
    ...pagination,
  }
}
