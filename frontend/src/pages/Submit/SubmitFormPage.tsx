import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Eye, EyeOff } from 'lucide-react'
import { ClientApiError, initClient } from '../../services/clientService'
import { TypewriterText } from './TypewriterText'

const BRAND = 'AuthDesk'
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

const fields: { id: FieldId; label: string; type: string; placeholder: string }[] = [
  { id: 'name', label: 'Client Name', type: 'text', placeholder: 'My web app' },
  { id: 'secret', label: 'Client Secret', type: 'password', placeholder: 'Enter client secret' },
  { id: 'redirect', label: 'Redirect URL', type: 'url', placeholder: 'https://example.com/callback' },
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

function AuthDeskLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
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
      <span className="text-xl font-semibold tracking-tight text-zinc-50">{BRAND}</span>
    </div>
  )
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
    <form onSubmit={(event) => void handleSubmit(event)} noValidate className="w-full max-w-sm">
      <h2 className="text-center !text-3xl font-semibold text-zinc-50">Register a client</h2>
      <p className="mt-2 mb-8 text-center text-zinc-400">All three fields are required.</p>
      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-zinc-300">
              {field.label}
            </label>
            <div className="relative">
              <input
                id={field.id}
                type={field.id === 'secret' && showSecret ? 'text' : field.type}
                value={values[field.id]}
                placeholder={field.placeholder}
                autoComplete="off"
                aria-invalid={errors[field.id] ? true : undefined}
                onChange={(event) => setValues({ ...values, [field.id]: event.target.value })}
                className={
                  'w-full rounded-md border bg-transparent px-3.5 py-2.5 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus-visible:!shadow-none ' +
                  (errors[field.id] ? 'border-red-500' : 'border-zinc-800') +
                  (field.id === 'secret' ? ' pr-11 [&::-ms-reveal]:hidden' : '')
                }
              />
              {field.id === 'secret' && (
                <button
                  type="button"
                  onClick={() => setShowSecret((previous) => !previous)}
                  aria-label={showSecret ? 'Hide secret' : 'Show secret'}
                  className="absolute top-1/2 right-3 -translate-y-1/2 border-0 bg-transparent p-0 text-zinc-400 hover:text-zinc-50 focus-visible:!shadow-none"
                >
                  {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            {errors[field.id] && <p className="mt-1 text-xs text-red-400">{errors[field.id]}</p>}
          </div>
        ))}
      </div>
      {submitError && (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-md bg-zinc-50 py-2.5 font-medium !text-zinc-900 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-50 focus:ring-offset-2 focus:ring-offset-zinc-950 focus-visible:!shadow-none disabled:opacity-60"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      <Link
        to="/details"
        className="mt-3 mx-auto block w-fit rounded-md border border-zinc-600 px-3.5 py-2.5 text-center text-sm font-medium text-zinc-300 no-underline hover:border-zinc-400 hover:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500/60 focus-visible:!shadow-none"
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
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50" style={{ display: 'flex', flexWrap: 'wrap' }}>
      {toastPhase !== 'hidden' ? (
        <div
          role="status"
          className={
            'authdesk-toast fixed top-5 right-5 z-50 flex items-center gap-3 overflow-hidden rounded-lg border border-teal-400/60 bg-zinc-900 px-6 py-4 text-lg font-semibold tracking-tight text-zinc-50 shadow-lg ' +
            (toastPhase === 'closing' ? 'authdesk-toast--out' : 'authdesk-toast--in')
          }
        >
          <Bell size={22} className="authdesk-toast-bell shrink-0 text-teal-400" aria-hidden="true" />
          Client Registered
          {toastPhase === 'open' ? <span className="authdesk-toast-progress" aria-hidden="true" /> : null}
        </div>
      ) : null}
      <section
        className="relative flex flex-col overflow-hidden p-10 lg:p-14"
        style={{
          flex: '1 1 360px',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-teal-500/20 blur-3xl"
        />
        <div className="relative">
          <AuthDeskLogo />
        </div>
        <div className="relative flex flex-1 items-center">
          <TypewriterText text={INTRO} />
        </div>
      </section>
      <section
        className="flex items-center justify-center border-zinc-800 p-8 md:border-l"
        style={{ flex: '1 1 360px', backgroundColor: '#09090b' }}
      >
        <ClientForm onSubmitted={() => setToastPhase('open')} />
      </section>
    </div>
  )
}
