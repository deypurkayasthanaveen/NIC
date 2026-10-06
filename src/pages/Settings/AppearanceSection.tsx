import { Moon, Sun } from 'lucide-react'
import { Card } from '../../components/common/Card'
import { useTheme } from '../../hooks/useTheme'
import type { Theme } from '../../types/common'
import styles from './Settings.module.css'

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light Theme', icon: Sun },
  { value: 'dark', label: 'Dark Theme', icon: Moon },
]

export function AppearanceSection() {
  const { theme, setTheme } = useTheme()

  return (
    <Card title="Appearance" description="Choose how the admin panel looks.">
      <fieldset className={styles.themeOptions}>
        <legend className="sr-only">Theme</legend>
        {options.map(({ value, label, icon: Icon }) => (
          <label key={value} className={styles.themeOption}>
            <input
              type="radio"
              name="theme"
              value={value}
              checked={theme === value}
              onChange={() => setTheme(value)}
            />
            <Icon size={18} aria-hidden="true" />
            {label}
          </label>
        ))}
      </fieldset>
      <p className={styles.hint}>Your choice is saved in this browser.</p>
    </Card>
  )
}
