import { Search, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../common/Button'
import fieldStyles from '../forms/FormField.module.css'
import styles from './Table.module.css'

interface TableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  /** Filter controls (usually <Select hideLabel />). */
  children?: ReactNode
  onClear?: () => void
  showClear?: boolean
}

export function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  children,
  onClear,
  showClear = false,
}: TableToolbarProps) {
  return (
    <div className={styles.toolbar} role="search">
      <div className={styles.search}>
        <Search size={16} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          className={fieldStyles.control}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </div>
      {children && <div className={styles.filters}>{children}</div>}
      {showClear && onClear && (
        <Button variant="ghost" icon={<X size={16} />} onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  )
}
