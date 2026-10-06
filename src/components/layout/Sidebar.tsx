import { Database, KeyRound, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react'
import { useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDismiss } from '../../hooks/useDismiss'
import { useLayout } from '../../hooks/useLayout'
import styles from './Layout.module.css'
import { Logo } from './Logo'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/roles', label: 'Roles', icon: KeyRound },
  { to: '/data', label: 'Data', icon: Database },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { logout } = useAuth()
  const { isMobile, collapsed, mobileOpen, setMobileOpen } = useLayout()
  const navigate = useNavigate()
  const sidebarRef = useRef<HTMLElement>(null)

  useDismiss(sidebarRef, mobileOpen, () => setMobileOpen(false))

  // The icon-only rail is a desktop feature; the mobile drawer always shows labels.
  const iconOnly = collapsed && !isMobile

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const className = [styles.sidebar, iconOnly && styles.sidebarCollapsed, mobileOpen && styles.sidebarOpen]
    .filter(Boolean)
    .join(' ')

  return (
    <aside
      ref={sidebarRef}
      id="app-sidebar"
      className={className}
      aria-label="Sidebar"
      // Keep the off-canvas drawer out of the tab order while it is hidden.
      inert={isMobile && !mobileOpen}
    >
      <div className={styles.sidebarBrand}>
        <Logo showText={!iconOnly} />
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        <ul className={styles.navList}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                title={iconOnly ? label : undefined}
                aria-label={iconOnly ? label : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} aria-hidden="true" />
                {!iconOnly && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <button
          type="button"
          className={styles.navLink}
          onClick={handleLogout}
          title={iconOnly ? 'Logout' : undefined}
          aria-label={iconOnly ? 'Logout' : undefined}
        >
          <LogOut size={20} aria-hidden="true" />
          {!iconOnly && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
