import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  title?: string
  description?: string
  actions?: ReactNode
  /** Remove body padding, e.g. for tables that span the full card width. */
  flush?: boolean
  children: ReactNode
  className?: string
}

export function Card({ title, description, actions, flush = false, children, className }: CardProps) {
  return (
    <section className={`${styles.card} ${className ?? ''}`}>
      {(title || actions) && (
        <header className={styles.header}>
          <div>
            {title && <h2>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={`${styles.body} ${flush ? styles.flush : ''}`}>{children}</div>
    </section>
  )
}
