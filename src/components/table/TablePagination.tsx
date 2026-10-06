import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Table.module.css'

interface TablePaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

/** Page numbers to show, with 0 standing in for an ellipsis. */
function visiblePages(page: number, totalPages: number): number[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b)
  return sorted.flatMap((value, index) => (index > 0 && value - sorted[index - 1] > 1 ? [0, value] : [value]))
}

export function TablePagination({ page, totalPages, totalItems, pageSize, onPageChange }: TablePaginationProps) {
  if (totalItems === 0) return null

  const first = (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, totalItems)

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <span>
        Showing {first}-{last} of {totalItems}
      </span>
      <div className={styles.pages}>
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {visiblePages(page, totalPages).map((value, index) =>
          value === 0 ? (
            <span key={`gap-${index}`} className={styles.ellipsis} aria-hidden="true">
              ...
            </span>
          ) : (
            <button
              key={value}
              type="button"
              className={styles.pageButton}
              onClick={() => onPageChange(value)}
              aria-current={value === page ? 'page' : undefined}
              aria-label={`Page ${value}`}
            >
              {value}
            </button>
          ),
        )}
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  )
}
