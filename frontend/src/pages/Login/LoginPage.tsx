import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { AuthApiError, loginUser } from '../../services/authService'

type FieldId = 'username' | 'password'

interface LoginValues {
  username: string
  password: string
}

const emptyValues: LoginValues = { username: '', password: '' }

function validate(values: LoginValues): Partial<Record<FieldId, string>> {
  const errors: Partial<Record<FieldId, string>> = {}
  if (!values.username.trim()) errors.username = 'Enter a username.'
  if (!values.password) errors.password = 'Enter a password.'
  return errors
}

export function LoginPage() {
  const [values, setValues] = useState<LoginValues>(emptyValues)
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      await loginUser({
        username: values.username.trim(),
        password: values.password,
      })
      // TODO: redirect after successful login
    } catch (error) {
      setSubmitError(error instanceof AuthApiError ? error.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-full flex-1 w-full overflow-x-hidden bg-[var(--theme-bg)] text-[var(--theme-text-primary)] transition-colors duration-150 flex flex-col"
      style={{
        backgroundImage:
          'radial-gradient(circle, var(--theme-dots) 0.75px, transparent 1px), var(--theme-page-gradient)',
        backgroundSize: '32px 32px, 100% 100%',
        backgroundRepeat: 'repeat, no-repeat',
      }}
    >
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="authdesk-glass-card w-full max-w-md rounded-[20px] p-8">
          <form onSubmit={(event) => void handleSubmit(event)} noValidate className="w-full">
            <h1 className="!text-4xl font-semibold text-[var(--theme-text-primary)]">Login</h1>
            <p className="mt-1.5 !mb-6 text-[var(--theme-text-secondary)]">Sign in to continue.</p>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm font-medium text-[var(--theme-text-subtle)]"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={values.username}
                  placeholder="Enter username"
                  autoComplete="username"
                  aria-invalid={errors.username ? true : undefined}
                  onChange={(event) => setValues({ ...values, username: event.target.value })}
                  className={
                    'w-full rounded-lg border bg-[var(--theme-input-bg)] px-4 py-3 text-[var(--theme-text-primary)] placeholder-[var(--theme-text-placeholder)] focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus-visible:!shadow-none transition-colors ' +
                    (errors.username ? 'border-red-500' : 'border-[var(--theme-border)]')
                  }
                />
                {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-[var(--theme-text-subtle)]"
                >
                  Password
                </label>
                <div className="group relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    aria-invalid={errors.password ? true : undefined}
                    onChange={(event) => setValues({ ...values, password: event.target.value })}
                    className={
                      'w-full rounded-lg border bg-[var(--theme-input-bg)] px-4 py-3 pr-11 text-[var(--theme-text-primary)] placeholder-[var(--theme-text-placeholder)] focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus-visible:!shadow-none transition-colors [&::-ms-reveal]:hidden ' +
                      (errors.password ? 'border-red-500' : 'border-[var(--theme-border)]')
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute top-1/2 right-3 -translate-y-1/2 border-0 bg-transparent p-0 text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] focus-visible:!shadow-none transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              </div>
            </div>

            {submitError && (
              <p className="mt-4 text-sm text-red-400" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-0 bg-[var(--theme-btn-primary-bg)] py-3 font-medium !text-[var(--theme-btn-primary-text)] hover:opacity-90 focus:outline-none focus-visible:!shadow-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:opacity-60 transition-opacity motion-reduce:transition-none"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <Link
              to="/"
              className="mt-3 block w-full rounded-lg py-2 text-center text-sm font-medium !text-teal-700 [[data-theme=dark]_&]:!text-teal-300 !no-underline hover:!no-underline hover:underline focus:outline-none focus-visible:!shadow-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Back to home
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
