import { createContext } from 'react'

export interface LayoutContextValue {
  isMobile: boolean
  /** Desktop: sidebar shrunk to an icon rail. Mirrors the "Compact Sidebar" preference. */
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  /** Mobile: sidebar drawer visible. */
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const LayoutContext = createContext<LayoutContextValue | null>(null)
