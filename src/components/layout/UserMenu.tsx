import { ChevronDown, LogOut, Moon, Settings, Sun } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDismiss } from '../../hooks/useDismiss'
import { useTheme } from '../../hooks/useTheme'
import styles from './Layout.module.css'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return (parts[0]?.[0] ?? '?').concat(parts[1]?.[0] ?? '').toUpperCase()
}

export function UserMenu() {
  const { profile, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useDismiss(containerRef, open, () => setOpen(false))

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.dropdown} ref={containerRef}>
      <button
        type="button"
        className={styles.userButton}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`User menu for ${profile.name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.avatar} aria-hidden="true">
          {initials(profile.name)}
        </span>
        <span className={styles.userName}>{profile.name}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {open && (
        <div id={panelId} className={`${styles.panel} ${styles.userPanel}`}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.notificationTitle}>{profile.name}</p>
              <p className={styles.panelSubtitle}>{profile.email}</p>
            </div>
          </div>
          <ul className={styles.menuList}>
            <li>
              <Link to="/settings" className={styles.menuItem} onClick={() => setOpen(false)}>
                <Settings size={16} aria-hidden="true" />
                Settings
              </Link>
            </li>
            <li>
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
                {theme === 'dark' ? 'Light theme' : 'Dark theme'}
              </button>
            </li>
            <li>
              <button type="button" className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={handleLogout}>
                <LogOut size={16} aria-hidden="true" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
