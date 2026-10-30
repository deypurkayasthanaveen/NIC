import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[0.5px] border-[var(--hdr-border)] bg-[var(--hdr-toggle-bg)] text-[var(--hdr-icon)] transition-[background-color,border-color,color] duration-150 motion-reduce:transition-none focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-teal-500/60 focus-visible:!ring-offset-2 focus-visible:!shadow-none"
    >
      {isDark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  )
}
