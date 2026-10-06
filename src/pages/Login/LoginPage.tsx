import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Checkbox } from '../../components/common/Checkbox'
import { Input } from '../../components/common/Input'
import { Logo } from '../../components/layout/Logo'
import { useAuth } from '../../hooks/useAuth'
import type { FormErrors } from '../../types/common'
import { hasNoErrors, isBlank } from '../../utils/validation'
import styles from './LoginPage.module.css'

interface LoginForm {
  username: string
  password: string
}

function validate(values: LoginForm): FormErrors<LoginForm> {
  return {
    username: isBlank(values.username) ? 'Email or username is required' : undefined,
    password: isBlank(values.password) ? 'Password is required' : undefined,
  }
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState<LoginForm>({ username: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<FormErrors<LoginForm>>({})

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const handleChange = (field: keyof LoginForm, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (!hasNoErrors(nextErrors)) return

    login(values.username, remember)
    navigate(redirectTo, { replace: true })
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Logo />
        </div>
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.subheading}>Sign in to continue to the admin panel.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            label="Email / Username"
            name="username"
            autoComplete="username"
            value={values.username}
            onChange={(event) => handleChange('username', event.target.value)}
            error={errors.username}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => handleChange('password', event.target.value)}
            error={errors.password}
            required
          />
          <Checkbox label="Remember me" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
          <Button type="submit" fullWidth>
            Login
          </Button>
        </form>

        <p className={styles.note}>Demo mode: any non-empty username and password will sign you in.</p>
      </div>
    </main>
  )
}
