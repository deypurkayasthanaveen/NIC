import { AlertTriangle, RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'
import styles from './State.module.css'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  action?: ReactNode
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'The content could not be loaded. Please try again.',
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <div className={`${styles.state} ${styles.error}`} role="alert">
      <div className={styles.icon} aria-hidden="true">
        <AlertTriangle size={24} />
      </div>
      <h3>{title}</h3>
      <p className={styles.description}>{message}</p>
      {(onRetry || action) && (
        <div className={styles.action}>
          {onRetry && (
            <Button variant="secondary" icon={<RotateCw size={16} />} onClick={onRetry}>
              Try again
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  )
}
