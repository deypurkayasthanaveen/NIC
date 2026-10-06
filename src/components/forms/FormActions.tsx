import type { ReactNode } from 'react'
import styles from './FormField.module.css'

export function FormActions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>
}
