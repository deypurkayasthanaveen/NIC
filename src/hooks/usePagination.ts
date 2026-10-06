import { useState } from 'react'

export interface Pagination<T> {
  page: number
  setPage: (page: number) => void
  totalPages: number
  totalItems: number
  pageSize: number
  pageItems: T[]
}

export function usePagination<T>(items: T[], pageSize = 10): Pagination<T> {
  const [requestedPage, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  // Clamp during render so deleting the last row of a page never leaves an empty page.
  const page = Math.min(Math.max(1, requestedPage), totalPages)
  const start = (page - 1) * pageSize

  return {
    page,
    setPage,
    totalPages,
    totalItems: items.length,
    pageSize,
    pageItems: items.slice(start, start + pageSize),
  }
}
