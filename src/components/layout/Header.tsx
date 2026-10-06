import { Menu, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLayout } from '../../hooks/useLayout'
import { getPageTitle } from '../../routes/routeTitles'
import { Button } from '../common/Button'
import fieldStyles from '../forms/FormField.module.css'
import styles from './Layout.module.css'
import { NotificationMenu } from './NotificationMenu'
import { UserMenu } from './UserMenu'

export function Header() {
  const { isMobile, collapsed, mobileOpen, toggleSidebar } = useLayout()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const toggleIcon = isMobile ? <Menu size={20} /> : collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />
  const toggleLabel = isMobile
    ? mobileOpen
      ? 'Close navigation'
      : 'Open navigation'
    : collapsed
      ? 'Expand sidebar'
      : 'Collapse sidebar'

  // Global search is a shortcut into the users list, which filters on the frontend.
  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/users?q=${encodeURIComponent(trimmed)}` : '/users')
    setQuery('')
  }

  return (
    <header className={styles.header}>
      <Button
        variant="ghost"
        iconOnly
        icon={toggleIcon}
        aria-label={toggleLabel}
        aria-controls="app-sidebar"
        aria-expanded={isMobile ? mobileOpen : !collapsed}
        onClick={toggleSidebar}
      />
      <span className={styles.pageTitle}>{getPageTitle(pathname)}</span>
      <div className={styles.headerSpacer} />

      <form className={styles.headerSearch} role="search" onSubmit={handleSearch}>
        <Search size={16} className={styles.headerSearchIcon} aria-hidden="true" />
        <input
          type="search"
          className={fieldStyles.control}
          placeholder="Search users..."
          aria-label="Search users"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>

      <div className={styles.headerActions}>
        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  )
}
