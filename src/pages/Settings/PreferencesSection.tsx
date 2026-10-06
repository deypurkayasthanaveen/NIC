import { Card } from '../../components/common/Card'
import { Switch } from '../../components/common/Switch'
import { useLayout } from '../../hooks/useLayout'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import styles from './Settings.module.css'

interface NotificationPreferences {
  emailNotifications: boolean
  browserNotifications: boolean
}

const defaults: NotificationPreferences = { emailNotifications: true, browserNotifications: false }

function isPreferences(value: unknown): value is NotificationPreferences {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.emailNotifications === 'boolean' && typeof candidate.browserNotifications === 'boolean'
}

export function PreferencesSection() {
  const [preferences, setPreferences] = useLocalStorage('preferences', defaults, isPreferences)
  const { collapsed, setCollapsed } = useLayout()

  const update = (key: keyof NotificationPreferences, value: boolean) =>
    setPreferences((previous) => ({ ...previous, [key]: value }))

  return (
    <Card title="Preferences" description="Notification and layout options.">
      <Switch
        label="Email Notifications"
        description="Receive account activity summaries by email."
        checked={preferences.emailNotifications}
        onChange={(value) => update('emailNotifications', value)}
      />
      <Switch
        label="Browser Notifications"
        description="Show alerts in the browser while the panel is open."
        checked={preferences.browserNotifications}
        onChange={(value) => update('browserNotifications', value)}
      />
      <Switch
        label="Compact Sidebar"
        description="Collapse the desktop sidebar to icons only."
        checked={collapsed}
        onChange={setCollapsed}
      />
      <p className={styles.hint}>Changes are saved automatically in this browser.</p>
    </Card>
  )
}
