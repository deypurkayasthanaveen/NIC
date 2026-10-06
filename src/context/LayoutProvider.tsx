import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { MOBILE_QUERY, useMediaQuery } from '../hooks/useMediaQuery'
import { isBoolean } from '../utils/storage'
import { LayoutContext } from './layoutContext'

export function LayoutProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const [collapsed, setCollapsed] = useLocalStorage('sidebarCollapsed', false, isBoolean)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    if (isMobile) setMobileOpen((open) => !open)
    else setCollapsed((value) => !value)
  }, [isMobile, setCollapsed])

  const value = useMemo(
    () => ({
      isMobile,
      collapsed,
      setCollapsed,
      mobileOpen: isMobile && mobileOpen,
      setMobileOpen,
      toggleSidebar,
    }),
    [isMobile, collapsed, setCollapsed, mobileOpen, toggleSidebar],
  )

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}
