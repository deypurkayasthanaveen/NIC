import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import type { Toast } from '../../context/toastContext'
import type { ToastType } from '../../types/common'
import styles from './Toast.module.css'

const icons: Record<ToastType, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: number) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className={styles.container} aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`} role="status">
            <Icon size={18} className={styles.icon} aria-hidden="true" />
            <span className="sr-only">{toast.type}:</span>
            <p className={styles.message}>{toast.message}</p>
            <button
              type="button"
              className={styles.close}
              aria-label="Dismiss notification"
              onClick={() => onDismiss(toast.id)}
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
