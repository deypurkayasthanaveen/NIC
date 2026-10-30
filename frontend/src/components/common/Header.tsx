import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { to: '/submit-form', label: 'Register' },
  { to: '/details', label: 'Look up' },
] as const

const focusRing =
  'focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-teal-500/60 focus-visible:!ring-offset-2 focus-visible:!shadow-none'

function AuthDeskMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
      <rect width="36" height="36" rx="9" className="fill-teal-400" />
      <path
        d="M11 24V12l7 8 7-8v12"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-950"
      />
    </svg>
  )
}

function navClassName({ isActive }: { isActive: boolean }) {
  return [
    'rounded-full px-4 py-2 text-[15px] !no-underline hover:!no-underline transition-[background-color,color,font-weight] duration-150 motion-reduce:transition-none',
    isActive
      ? 'bg-[rgba(16,205,181,0.12)] font-medium !text-teal-700 [[data-theme=dark]_&]:!text-teal-300'
      : 'font-normal !text-[var(--theme-text-secondary)] hover:bg-[rgba(16,205,181,0.08)] hover:!text-[var(--theme-text-primary)]',
    focusRing,
  ].join(' ')
}

function mobileNavClassName({ isActive }: { isActive: boolean }) {
  return [
    'block w-full rounded-xl px-4 py-2.5 text-[15px] !no-underline hover:!no-underline transition-[background-color,color,font-weight] duration-150 motion-reduce:transition-none',
    isActive
      ? 'bg-[rgba(16,205,181,0.12)] font-medium !text-teal-700 [[data-theme=dark]_&]:!text-teal-300'
      : 'font-normal !text-[var(--theme-text-secondary)] hover:bg-[rgba(16,205,181,0.08)] hover:!text-[var(--theme-text-primary)]',
    focusRing,
  ].join(' ')
}

export interface HeaderProps {
  onSignIn?: () => void
}

export function Header({ onSignIn }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const pillRef = useRef<HTMLDivElement>(null)
  const [menuPathname, setMenuPathname] = useState(location.pathname)

  if (menuPathname !== location.pathname) {
    setMenuPathname(location.pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (pillRef.current && !pillRef.current.contains(target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  return (
    <header className="sticky top-4 z-50 mx-4 w-auto pb-4 sm:mx-6 lg:mx-8">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div
        ref={pillRef}
        className="relative grid min-w-0 w-auto grid-cols-[1fr_auto_1fr] items-center rounded-full border-[0.5px] border-[var(--hdr-border)] bg-[var(--hdr-bg)] px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.06)] backdrop-blur-[8px] [[data-theme=dark]_&]:ring-1 [[data-theme=dark]_&]:ring-[rgba(255,255,255,0.08)] lg:px-6"
      >
        <Link
          to="/"
          className={`min-w-0 justify-self-start inline-flex items-center gap-3 rounded-[9px] !text-[var(--theme-text-primary)] !no-underline hover:!no-underline ${focusRing}`}
        >
          <AuthDeskMark />
          <span className="truncate text-xl font-semibold tracking-tight">AuthDesk</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1.5 justify-self-center md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 justify-self-end">
          <ThemeToggle />

          {onSignIn ? (
            <button
              type="button"
              onClick={onSignIn}
              className={`max-[479px]:hidden rounded-full bg-[var(--hdr-btn-bg)] px-4 py-2 text-[15px] font-medium text-[var(--hdr-btn-text)] transition-[background-color] duration-150 hover:bg-[#26282A] motion-reduce:transition-none ${focusRing}`}
            >
              Sign in
            </button>
          ) : null}

          <button
            type="button"
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[0.5px] border-[var(--hdr-border)] bg-[var(--hdr-toggle-bg)] text-[var(--hdr-icon)] transition-[background-color,border-color,color] duration-150 motion-reduce:transition-none md:hidden ${focusRing}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-nav-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu size={18} aria-hidden="true" />
          </button>
        </div>

        {menuOpen ? (
          <div
            id="main-nav-menu"
            className="absolute top-full right-0 left-0 z-50 mt-2 rounded-3xl border-[0.5px] border-[var(--hdr-border)] bg-[var(--hdr-bg)] p-2 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.06)] backdrop-blur-[8px] [[data-theme=dark]_&]:ring-1 [[data-theme=dark]_&]:ring-[rgba(255,255,255,0.08)] md:hidden"
          >
            <nav aria-label="Main" className="flex flex-col">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileNavClassName}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  )
}
