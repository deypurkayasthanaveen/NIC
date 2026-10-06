import { ShieldCheck } from 'lucide-react'
import styles from './Layout.module.css'

export const APP_NAME = 'NIC Admin'

export function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <span className={styles.logo}>
      <span className={styles.logoMark} aria-hidden="true">
        <ShieldCheck size={20} />
      </span>
      {showText ? <span className={styles.logoText}>{APP_NAME}</span> : <span className="sr-only">{APP_NAME}</span>}
    </span>
  )
}
