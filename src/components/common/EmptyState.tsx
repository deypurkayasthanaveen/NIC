import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './State.module.css'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <div className={styles.icon} aria-hidden="true">
        {icon ?? <Inbox size={24} />}
      </div>
      <h3>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
