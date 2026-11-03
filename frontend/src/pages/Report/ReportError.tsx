import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const focusRing =
  'focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-teal-500 focus-visible:!ring-offset-2 focus-visible:!shadow-none'

export function ReportError({ message }: { message: string }) {
  return (
    <section className="authdesk-glass-card mx-auto w-full max-w-lg rounded-[20px] p-6 text-center sm:p-8">
      <AlertCircle className="mx-auto text-red-600 [[data-theme=dark]_&]:text-red-400" size={36} aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold text-[var(--theme-text-primary)]">Report unavailable</h2>
      <p className="mt-2 text-sm text-[var(--theme-text-secondary)]" role="alert">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/details"
          className={`inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--theme-border)] px-4 py-2 !text-teal-800 !no-underline hover:!no-underline hover:bg-[rgba(16,205,181,0.08)] [[data-theme=dark]_&]:!text-teal-300 ${focusRing}`}
        >
          Look up another client
        </Link>
        <Link
          to="/"
          className={`inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--theme-btn-primary-bg)] px-4 py-2 font-medium !text-[var(--theme-btn-primary-text)] !no-underline hover:!no-underline hover:opacity-90 ${focusRing}`}
        >
          Back to home
        </Link>
      </div>
    </section>
  )
}
