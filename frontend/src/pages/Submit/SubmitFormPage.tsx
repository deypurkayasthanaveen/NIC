import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  AppWindow,
  ArrowRight,
  Bell,
  Eye,
  EyeOff,
  KeyRound,
  Link2 as LinkIcon,
  Lock,
  type LucideIcon,
} from 'lucide-react'
import { ClientApiError, initClient } from '../../services/clientService'
import { TypewriterText } from './TypewriterText'

const INTRO =
  'Welcome to AuthDesk.\nRegister your app in seconds: give it a name, a secret and a redirect URL.'
const TOAST_MS = 5000
const TOAST_EXIT_MS = 280

type ToastPhase = 'hidden' | 'open' | 'closing'

type FieldId = 'name' | 'secret' | 'redirect'

interface ClientValues {
  name: string
  secret: string
  redirect: string
}

const emptyValues: ClientValues = { name: '', secret: '', redirect: '' }

const fields: { id: FieldId; label: string; type: string; placeholder: string; icon: LucideIcon }[] = [
  { id: 'name', label: 'Client Name', type: 'text', placeholder: 'My web app', icon: AppWindow },
  { id: 'secret', label: 'Client Secret', type: 'password', placeholder: 'Enter client secret', icon: Lock },
  { id: 'redirect', label: 'Redirect URL', type: 'url', placeholder: 'https://example.com/callback', icon: LinkIcon },
]

function validate(values: ClientValues): Partial<Record<FieldId, string>> {
  const errors: Partial<Record<FieldId, string>> = {}
  if (!values.name.trim()) errors.name = 'Enter a client name.'
  if (values.secret.length < 8) errors.secret = 'Use at least 8 characters.'
  try {
    if (!/^https?:$/.test(new URL(values.redirect).protocol)) throw new Error('invalid')
  } catch {
    errors.redirect = 'Enter a full URL starting with http:// or https://.'
  }
  return errors
}

function ClientForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [values, setValues] = useState<ClientValues>(emptyValues)
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      await initClient({
        client_name: values.name.trim(),
        client_secret: values.secret,
        redirect_urls: values.redirect.trim(),
      })
      onSubmitted()
      setValues(emptyValues)
      setErrors({})
      setShowSecret(false)
    } catch (error) {
      setSubmitError(error instanceof ClientApiError ? error.message : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} noValidate className="w-full">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(16,205,181,0.12)] text-teal-700 [[data-theme=dark]_&]:text-teal-300">
        <KeyRound size={22} aria-hidden="true" />
      </div>
      <h2 className="mt-4 !text-4xl font-semibold text-[var(--theme-text-primary)]">Register a client</h2>
      <p className="mt-1.5 !mb-6 text-[var(--theme-text-secondary)]">All three fields are required.</p>
      <div className="space-y-5">
        {fields.map((field) => {
          const FieldIcon = field.icon
          return (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-[var(--theme-text-subtle)]">
              {field.label}
            </label>
            <div className="group relative">
              <FieldIcon
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--theme-text-secondary)] group-focus-within:text-teal-600"
              />
              <input
                id={field.id}
                type={field.id === 'secret' && showSecret ? 'text' : field.type}
                value={values[field.id]}
                placeholder={field.placeholder}
                autoComplete="off"
                aria-invalid={errors[field.id] ? true : undefined}
                onChange={(event) => setValues({ ...values, [field.id]: event.target.value })}
                className={
                  'w-full rounded-lg border bg-[var(--theme-input-bg)] px-4 py-3 pl-10 text-[var(--theme-text-primary)] placeholder-[var(--theme-text-placeholder)] focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus-visible:!shadow-none transition-colors ' +
                  (errors[field.id] ? 'border-red-500' : 'border-[var(--theme-border)]') +
                  (field.id === 'secret' ? ' pr-11 [&::-ms-reveal]:hidden' : '')
                }
              />
              {field.id === 'secret' && (
                <button
                  type="button"
                  onClick={() => setShowSecret((previous) => !previous)}
                  aria-label={showSecret ? 'Hide secret' : 'Show secret'}
                  className="absolute top-1/2 right-3 -translate-y-1/2 border-0 bg-transparent p-0 text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] focus-visible:!shadow-none transition-colors"
                >
                  {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            {errors[field.id] && <p className="mt-1 text-xs text-red-400">{errors[field.id]}</p>}
          </div>
          )
        })}
      </div>
      {submitError && (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="group mt-8 flex w-full items-center justify-center gap-2 rounded-lg border-0 bg-[var(--theme-btn-primary-bg)] py-3 font-medium !text-[var(--theme-btn-primary-text)] hover:opacity-90 focus:outline-none focus-visible:!shadow-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:opacity-60 transition-opacity"
      >
        {loading ? (
          'Requesting...'
        ) : (
          <>
            Request
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
      <Link
        to="/details"
        className="mt-3 block w-full rounded-lg border border-[var(--theme-border)] py-3 text-center text-sm font-medium !text-teal-700 [[data-theme=dark]_&]:!text-teal-300 !no-underline hover:!no-underline hover:bg-[rgba(16,205,181,0.08)] hover:border-teal-500/50 focus:outline-none focus-visible:!shadow-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors"
      >
        Look up details
      </Link>
    </form>
  )
}

export function SubmitFormPage() {
  const [toastPhase, setToastPhase] = useState<ToastPhase>('hidden')

  useEffect(() => {
    if (toastPhase !== 'open') return
    const timer = window.setTimeout(() => setToastPhase('closing'), TOAST_MS)
    return () => window.clearTimeout(timer)
  }, [toastPhase])

  useEffect(() => {
    if (toastPhase !== 'closing') return
    const timer = window.setTimeout(() => setToastPhase('hidden'), TOAST_EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [toastPhase])

  return (
    <div
      className="relative min-h-full flex-1 w-full bg-[var(--theme-bg)] text-[var(--theme-text-primary)] transition-colors duration-150 overflow-x-hidden flex flex-col md:flex-row"
      style={{
        backgroundImage:
          'radial-gradient(circle, var(--theme-dots) 0.75px, transparent 1px), var(--theme-page-gradient)',
        backgroundSize: '32px 32px, 100% 100%',
        backgroundRepeat: 'repeat, no-repeat',
      }}
    >
      {toastPhase !== 'hidden' ? (
        <div
          role="status"
          className={
            'authdesk-toast fixed top-18 right-5 z-50 flex items-center gap-3 overflow-hidden rounded-lg border border-teal-400/60 bg-[var(--theme-toast-bg)] px-6 py-4 text-lg font-semibold tracking-tight text-[var(--theme-toast-text)] shadow-lg ' +
            (toastPhase === 'closing' ? 'authdesk-toast--out' : 'authdesk-toast--in')
          }
        >
          <Bell size={22} className="authdesk-toast-bell shrink-0 text-teal-400" aria-hidden="true" />
          Client Registered
          {toastPhase === 'open' ? <span className="authdesk-toast-progress" aria-hidden="true" /> : null}
        </div>
      ) : null}
      <section
        className="relative flex flex-col justify-between p-8 sm:p-12 lg:p-16"
        style={{ flex: '1 1 360px' }}
      >
        <div className="relative flex flex-1 items-center py-10 md:py-0">
          <TypewriterText text={INTRO} />
        </div>
      </section>
      <section
        className="relative flex items-center justify-center md:justify-end p-6 sm:p-10 lg:p-14 md:pr-12 lg:pr-24 xl:pr-32 transition-colors duration-150"
        style={{ flex: '1 1 360px' }}
      >
        <div className="authdesk-glass-card w-full max-w-lg rounded-[20px] p-8 sm:p-11">
          <ClientForm onSubmitted={() => setToastPhase('open')} />
        </div>
      </section>
    </div>
  )
}
