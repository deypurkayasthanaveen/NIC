import { Monitor, Smartphone } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { Switch } from '../../components/common/Switch'
import { FormActions } from '../../components/forms/FormActions'
import { useToast } from '../../hooks/useToast'
import type { FormErrors } from '../../types/common'
import { hasNoErrors, isBlank } from '../../utils/validation'
import styles from './Settings.module.css'

interface PasswordForm {
  current: string
  next: string
  confirm: string
}

const emptyPasswords: PasswordForm = { current: '', next: '', confirm: '' }

const initialSessions = [
  { id: 1, device: 'Chrome on Linux', location: 'New Delhi, IN', lastActive: 'Current session', current: true, icon: Monitor },
  { id: 2, device: 'Safari on iPhone', location: 'Mumbai, IN', lastActive: '2 hours ago', current: false, icon: Smartphone },
  { id: 3, device: 'Firefox on Windows', location: 'Bengaluru, IN', lastActive: '3 days ago', current: false, icon: Monitor },
]

function validate(values: PasswordForm): FormErrors<PasswordForm> {
  return {
    current: isBlank(values.current) ? 'Current password is required' : undefined,
    next: isBlank(values.next)
      ? 'New password is required'
      : values.next.length < 8
        ? 'Password must be at least 8 characters'
        : undefined,
    confirm: values.confirm !== values.next ? 'Passwords do not match' : undefined,
  }
}

/** Static demo: nothing here talks to a server or changes real credentials. */
export function SecuritySection() {
  const { showToast } = useToast()
  const [passwords, setPasswords] = useState<PasswordForm>(emptyPasswords)
  const [errors, setErrors] = useState<FormErrors<PasswordForm>>({})
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessions, setSessions] = useState(initialSessions)

  const setField = (field: keyof PasswordForm, value: string) => {
    setPasswords((previous) => ({ ...previous, [field]: value }))
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  const handlePasswordSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(passwords)
    setErrors(nextErrors)
    if (!hasNoErrors(nextErrors)) return
    setPasswords(emptyPasswords)
    showToast('success', 'Password updated successfully (demo only)')
  }

  const handleTwoFactor = (enabled: boolean) => {
    setTwoFactor(enabled)
    showToast('info', enabled ? 'Two-factor authentication enabled (demo only)' : 'Two-factor authentication disabled')
  }

  const revokeSession = (id: number) => {
    setSessions((current) => current.filter((session) => session.id !== id))
    showToast('warning', 'Session signed out')
  }

  return (
    <Card title="Security" description="Password, two-factor authentication, and sessions.">
      <div className={styles.securityBlock}>
        <h3 className={styles.subheading}>Change Password</h3>
        <form className={styles.form} onSubmit={handlePasswordSubmit} noValidate>
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={passwords.current}
            onChange={(e) => setField('current', e.target.value)}
            error={errors.current}
            required
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            value={passwords.next}
            onChange={(e) => setField('next', e.target.value)}
            error={errors.next}
            hint="At least 8 characters"
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={passwords.confirm}
            onChange={(e) => setField('confirm', e.target.value)}
            error={errors.confirm}
            required
          />
          <FormActions>
            <Button type="submit">Update Password</Button>
          </FormActions>
        </form>
      </div>

      <div className={`${styles.securityBlock} ${styles.divider}`}>
        <h3>Two-Factor Authentication</h3>
        <Switch
          label="Require a verification code at login"
          description="Adds an extra layer of security to your account."
          checked={twoFactor}
          onChange={handleTwoFactor}
        />
      </div>

      <div className={`${styles.securityBlock} ${styles.divider}`}>
        <h3 className={styles.subheading}>Active Sessions</h3>
        <ul className={styles.sessions}>
          {sessions.map(({ id, device, location, lastActive, current, icon: Icon }) => (
            <li key={id} className={styles.session}>
              <Icon size={20} aria-hidden="true" />
              <div className={styles.sessionInfo}>
                <p>{device}</p>
                <p className={styles.sessionMeta}>
                  {location} - {lastActive}
                </p>
              </div>
              {!current && (
                <Button variant="secondary" size="sm" onClick={() => revokeSession(id)} aria-label={`Sign out ${device}`}>
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
