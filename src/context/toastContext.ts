import { createContext } from 'react'
import type { ToastType } from '../types/common'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

export interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
