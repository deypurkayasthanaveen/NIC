import type { ReactNode } from 'react'
import type { Status } from '../../types/common'
import styles from './Badge.module.css'

type Tone = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

interface BadgeProps {
  tone?: Tone
  children: ReactNode
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}

export function StatusBadge({ status }: { status: Status }) {
  return <Badge tone={status === 'Active' ? 'success' : 'neutral'}>{status}</Badge>
}
