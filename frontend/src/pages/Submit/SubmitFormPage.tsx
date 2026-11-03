import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  AppWindow,
  ArrowRight,
  Bell,
  KeyRound,
  Link2 as LinkIcon,
  Mail,
  Paperclip,
  Phone,
  type LucideIcon,
  X,
} from 'lucide-react'
import { ClientApiError, registerClient } from '../../services/clientService'
import { TypewriterText } from './TypewriterText'

const DOCUMENT_REQUIRED = true
const INTRO =
  'Welcome to AuthDesk.\nRegister your app in seconds: give it a name, a secret and a redirect URL.'
const TOAST_MS = 5000
const TOAST_EXIT_MS = 280

type ToastPhase = 'hidden' | 'open' | 'closing'

type FieldId = 'name' | 'email' | 'contact' | 'redirect' | 'document'
type TextFieldId = Exclude<FieldId, 'document'>

interface ClientValues {
  name: string
  email: string
  contact: string
  redirect: string
  document: File | null
}

const emptyValues: ClientValues = { name: '', email: '', contact: '', redirect: '', document: null }

const fields: (
  | { id: TextFieldId; label: string; type: string; placeholder: string; icon: LucideIcon }
  | { id: 'document'; label: string }
)[] = [
  { id: 'name', label: 'Application Name', type: 'text', placeholder: 'My web app', icon: AppWindow },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com', icon: Mail },
  { id: 'contact', label: 'Contact number', type: 'tel', placeholder: '98765 43210', icon: Phone },
  { id: 'redirect', label: 'Redirect URL', type: 'url', placeholder: 'https://example.com/callback', icon: LinkIcon },
  { id: 'document', label: 'Supporting document' },
]

function validate(values: ClientValues): Partial<Record<FieldId, string>> {
  const errors: Partial<Record<FieldId, string>> = {}
  if (!values.name.trim()) errors.name = 'Enter an application name.'
  const email = values.email.trim()
  if (!email) errors.email = 'Enter an email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Enter a valid email address.'
  if (!/^[6-9]\d{9}$/.test(values.contact)) errors.contact = 'Enter a 10 digit mobile number.'
  try {
    if (!/^https?:$/.test(new URL(values.redirect).protocol)) throw new Error('invalid')
  } catch {
    errors.redirect = 'Enter a full URL starting with http:// or https://.'
  }
  if (!values.document) {
    if (DOCUMENT_REQUIRED) errors.document = 'Upload a supporting document.'
  } else {
    const extension = values.document.name.split('.').pop()?.toLowerCase()
    const expectedMimeType =
      extension === 'pdf'
        ? 'application/pdf'
        : extension === 'jpg' || extension === 'jpeg'
          ? 'image/jpeg'
          : extension === 'png'
            ? 'image/png'
            : null
    if (!expectedMimeType || values.document.type !== expectedMimeType) {
      errors.document = 'Upload a PDF, JPG or PNG file.'
    } else if (values.document.size > 5 * 1024 * 1024) {
      errors.document = 'File must be 5 MB or smaller.'
    }
  }
  return errors
}

function formatContactNumber(contact: string): string {
  return contact.length > 5 ? `${contact.slice(0, 5)} ${contact.slice(5)}` : contact
}

function ClientForm({ onSubmitted }: { onSubmitted: (clientId: string | null) => void }) {
  const [values, setValues] = useState<ClientValues>(emptyValues)
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''
    if (!file) return

    const fileErrors = validate({ ...values, document: file })
    const documentError = fileErrors.document
    setValues((current) => ({ ...current, document: documentError ? null : file }))
    setErrors((current) => {
      const otherErrors = { ...current }
      delete otherErrors.document
      return documentError ? { ...otherErrors, document: documentError } : otherErrors
    })
  }

  const removeDocument = () => {
    if (documentInputRef.current) documentInputRef.current.value = ''
    setValues((current) => ({ ...current, document: null }))
    setErrors((current) => {
      const otherErrors = { ...current }
      delete otherErrors.document
      return otherErrors
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) return

    if (!values.document) {
      setSubmitError('A supporting document is required to register this client.')
      return
    }

    setLoading(true)
    try {
      await registerClient({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        contact: values.contact,
        redirect: values.redirect.trim(),
        document: values.document,
      })
      onSubmitted(null)
      setValues(emptyValues)
      if (documentInputRef.current) documentInputRef.current.value = ''
      setErrors({})
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
      <p className="mt-1.5 !mb-6 text-[var(--theme-text-secondary)]">All fields are required.</p>
      <div className="space-y-5">
        {fields.map((field) => {
          if (field.id === 'document') {
            return (
              <div key={field.id} className="min-w-0">
                <p id="document-label" className="mb-1.5 block text-sm font-medium text-[var(--theme-text-subtle)]">
                  {field.label}{DOCUMENT_REQUIRED ? '' : ' (optional)'}
                </p>
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <input
                    ref={documentInputRef}
                    id="document"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    className="peer sr-only"
                    aria-labelledby="document-label"
                    aria-describedby="document-hint document-error"
                    aria-invalid={errors.document ? true : undefined}
                    onChange={handleDocumentChange}
                  />
                  <label
                    htmlFor="document"
                    className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-[var(--theme-border)] px-4 py-2.5 text-sm font-medium !text-teal-700 [[data-theme=dark]_&]:!text-teal-300 hover:bg-[rgba(16,205,181,0.08)] focus:outline-none focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500 peer-focus-visible:ring-offset-2 transition-colors"
                  >
                    <Paperclip size={16} aria-hidden="true" />
                    Choose file
                  </label>
                  {values.document ? (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-[var(--theme-text-secondary)]">
                          {values.document.name}
                        </p>
                        <p className="text-xs text-[var(--theme-text-secondary)]">
                          {(values.document.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeDocument}
                        aria-label="Remove file"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border-0 bg-transparent text-[var(--theme-text-secondary)] hover:bg-[rgba(16,205,181,0.08)] hover:text-[var(--theme-text-primary)] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 transition-colors"
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <span className="min-w-0 flex-1 text-sm text-[var(--theme-text-secondary)]">
                      No file chosen
                    </span>
                  )}
                </div>
                <p id="document-hint" className="mt-1 text-xs text-[var(--theme-text-secondary)]">
                  PDF, JPG or PNG, up to 5 MB
                </p>
                <p
                  id="document-error"
                  className="mt-1 text-xs text-red-600 [[data-theme=dark]_&]:text-red-400"
                  aria-live="polite"
                >
                  {errors.document}
                </p>
              </div>
            )
          }

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
                {field.id === 'contact' && (
                  <span className="pointer-events-none absolute top-1/2 left-11 flex -translate-y-1/2 items-center gap-2 text-sm font-medium text-[var(--theme-text-primary)]">
                    +91
                    <span className="h-5 w-px bg-[var(--theme-border)]" />
                  </span>
                )}
                <input
                  id={field.id}
                  type={field.type}
                  inputMode={field.id === 'contact' ? 'numeric' : field.id === 'email' ? 'email' : undefined}
                  value={field.id === 'contact' ? formatContactNumber(values.contact) : values[field.id]}
                  placeholder={field.placeholder}
                  autoComplete={field.id === 'contact' ? 'tel-national' : field.id === 'email' ? 'email' : 'off'}
                  autoCapitalize={field.id === 'email' ? 'none' : undefined}
                  spellCheck={field.id === 'email' ? false : undefined}
                  maxLength={field.id === 'email' ? 254 : undefined}
                  aria-invalid={errors[field.id] ? true : undefined}
                  aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                  onChange={(event) => {
                    const value =
                      field.id === 'contact'
                        ? event.currentTarget.value.replace(/\D/g, '').slice(0, 10)
                        : event.currentTarget.value
                    setValues((current) => ({ ...current, [field.id]: value }))
                  }}
                  className={
                    'w-full rounded-lg border bg-[var(--theme-input-bg)] px-4 py-3 pl-10 text-[var(--theme-text-primary)] placeholder-[var(--theme-text-secondary)] focus:border-teal-500 focus:outline-none focus-visible:!shadow-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 transition-colors ' +
                    (field.id === 'contact' ? 'pl-22 ' : '') +
                    (errors[field.id] ? 'border-red-500' : 'border-[var(--theme-border)]')
                  }
                />
              </div>
              {errors[field.id] && (
                <p id={`${field.id}-error`} className="mt-1 text-xs text-red-600 [[data-theme=dark]_&]:text-red-400" role="alert">
                  {errors[field.id]}
                </p>
              )}
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
  const [toastReportId, setToastReportId] = useState<string | null>(null)

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
          {toastReportId ? (
            <Link
              to="/report"
              state={{ clientId: toastReportId }}
              className="ml-1 inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium !text-teal-700 !underline hover:!text-teal-600 [[data-theme=dark]_&]:!text-teal-300 focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-teal-500 focus-visible:!ring-offset-2 focus-visible:!shadow-none"
            >
              View report
            </Link>
          ) : null}
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
          <ClientForm
            onSubmitted={(clientId) => {
              setToastReportId(clientId)
              setToastPhase('open')
            }}
          />
        </div>
      </section>
    </div>
  )
}
