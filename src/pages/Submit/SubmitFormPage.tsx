import { useState, type FormEvent } from 'react'
import { Check, Eye, EyeOff } from 'lucide-react'
import { ClientApiError, initClient, type InitResponse } from '../../services/clientService'
import { TypewriterText } from './TypewriterText'

const BRAND = 'AuthDesk'
const INTRO =
  'Welcome to AuthDesk.\nRegister your app in seconds: give it a name, a secret and a redirect URL.'

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

function CredentialRow({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      <p className="mb-1 text-xs font-medium text-zinc-400">{label}</p>
      <div className="flex items-center gap-2">
        <code className="block min-w-0 flex-1 truncate rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-50">
          {value}
        </code>
        {copyable ? (
          <button
            type="button"
            onClick={() => void copy()}
            className="shrink-0 rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-xs text-zinc-300 hover:text-zinc-50 focus-visible:!shadow-none"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
    </div>
  )
}

function ClientForm() {
  const [values, setValues] = useState<ClientValues>(emptyValues)
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [result, setResult] = useState<InitResponse | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      const response = await initClient({
        client_name: values.name.trim(),
        client_secret: values.secret,
        redirect_urls: values.redirect.trim(),
      })
      setResult(response)
    } catch (error) {
      setSubmitError(error instanceof ClientApiError ? error.message : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="w-full max-w-sm" role="status">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-teal-500 text-white">
          <Check size={22} />
        </span>
        <h2 className="mt-4 !text-2xl font-semibold text-zinc-50">Submitted</h2>
        <p className="mt-1 mb-6 text-zinc-400">Save this secret now. It will not be shown again.</p>
        <div className="mb-6 space-y-4">
          <CredentialRow label="Client ID" value={result.client_id} copyable />
          <CredentialRow label="Client Secret" value={result.client_secret} copyable />
          <CredentialRow label="Transaction ID" value={result.transaction_id} />
          <CredentialRow label="Status" value={result.status} />
        </div>
        <button
          type="button"
          onClick={() => {
            setValues(emptyValues)
            setResult(null)
            setErrors({})
            setSubmitError(null)
            setShowSecret(false)
          }}
          className="w-full rounded-md bg-zinc-50 px-5 py-2.5 font-medium !text-zinc-900 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-50 focus:ring-offset-2 focus:ring-offset-zinc-950 focus-visible:!shadow-none"
        >
          Add another
        </button>
      </div>
    )
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
    </form>
  )
}

export function SubmitFormPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50" style={{ display: 'flex', flexWrap: 'wrap' }}>
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
        <ClientForm />
      </section>
    </div>
  )
}
