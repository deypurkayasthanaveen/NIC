import type { ReactNode } from 'react'
import styles from './DetailList.module.css'

export interface DetailItem {
  label: string
  value: ReactNode
}

interface DetailListProps {
  items: DetailItem[]
  columns?: 1 | 2
}

/** Read-only label/value pairs, rendered as a description list. */
export function DetailList({ items, columns = 2 }: DetailListProps) {
  return (
    <dl className={`${styles.list} ${columns === 1 ? styles.single : ''}`}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
