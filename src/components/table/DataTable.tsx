import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { ReactNode } from 'react'
import type { SortState } from '../../types/common'
import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { Spinner } from '../common/Spinner'
import styles from './Table.module.css'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  /** Field used for sorting; when set the header becomes a sort button. */
  sortKey?: string
  align?: 'left' | 'right'
}

interface DataTableProps<T> {
  caption: string
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  isLoading?: boolean
  isFetching?: boolean
  error?: string
  onRetry?: () => void
  sort?: SortState
  onSort?: (key: string) => void
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
}

function SortIcon({ active, direction }: { active: boolean; direction?: 'asc' | 'desc' }) {
  if (!active) return <ArrowUpDown size={14} aria-hidden="true" />
  return direction === 'asc' ? <ArrowUp size={14} aria-hidden="true" /> : <ArrowDown size={14} aria-hidden="true" />
}

export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  isLoading = false,
  isFetching = false,
  error,
  onRetry,
  sort,
  onSort,
  emptyTitle = 'No results found',
  emptyDescription,
  emptyAction,
}: DataTableProps<T>) {
  if (isLoading) return <Spinner centered label="Loading data..." />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
  }

  return (
    <div className={`${styles.wrapper} ${isFetching ? styles.fetching : ''}`} aria-busy={isFetching || undefined}>
      <table className={styles.table}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const isSorted = column.sortKey !== undefined && sort?.key === column.sortKey
              const ariaSort = isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={column.align === 'right' ? styles.alignRight : undefined}
                >
                  {column.sortKey && onSort ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => onSort(column.sortKey as string)}
                    >
                      {column.header}
                      <SortIcon active={isSorted} direction={sort?.direction} />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key} className={column.align === 'right' ? styles.alignRight : undefined}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
