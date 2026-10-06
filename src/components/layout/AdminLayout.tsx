import { Outlet, useLocation } from 'react-router-dom'
import { useLayout } from '../../hooks/useLayout'
import { ErrorBoundary } from '../common/ErrorBoundary'
import { Header } from './Header'
import styles from './Layout.module.css'
import { Sidebar } from './Sidebar'

export function AdminLayout() {
  const { isMobile, collapsed, mobileOpen } = useLayout()
  const { pathname } = useLocation()

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar />
      {mobileOpen && <div className={styles.backdrop} aria-hidden="true" />}

      <div className={`${styles.main} ${collapsed && !isMobile ? styles.mainCollapsed : ''}`}>
        <Header />
        <main id="main-content" className={styles.content} tabIndex={-1}>
          {/* Keyed by path so an error on one page clears when navigating away. */}
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
