import { Link } from 'react-router-dom'
import { ArrowRight, Plug, ShieldCheck, Zap } from 'lucide-react'

const features = [
  { icon: Zap, label: 'Fast setup' },
  { icon: ShieldCheck, label: 'Secure by default' },
  { icon: Plug, label: 'Easy to integrate' },
] as const

const focusRing =
  'focus:outline-none focus-visible:!shadow-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2'

export function WelcomePage() {
  return (
    <div
      className="relative min-h-full flex-1 w-full overflow-x-hidden bg-[var(--theme-bg)] text-[var(--theme-text-primary)] transition-colors duration-150"
      style={{
        backgroundImage:
          'radial-gradient(circle, var(--theme-dots) 0.75px, transparent 1px), var(--theme-page-gradient)',
        backgroundSize: '32px 32px, 100% 100%',
        backgroundRepeat: 'repeat, no-repeat',
      }}
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-16 sm:pt-24 lg:pt-28 pb-16 text-center">
        <span className="inline-block rounded-full bg-[rgba(16,205,181,0.14)] px-3 py-1 text-xs sm:text-sm font-medium text-teal-700 [[data-theme=dark]_&]:text-teal-300">
          Client registration, simplified
        </span>

        <h1
          className="!mt-5 font-semibold tracking-tight text-[var(--theme-text-primary)]"
          style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}
        >
          Welcome to AuthDesk
        </h1>

        <p className="!mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-[var(--theme-text-secondary)]">
          Register your application and get credentials in seconds.
          <br />
          Built for NIC projects.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/submit-form"
            className={`group inline-flex min-h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[var(--theme-btn-primary-bg)] px-6 py-3 font-medium !text-[var(--theme-btn-primary-text)] !no-underline hover:!no-underline hover:opacity-90 transition-opacity motion-reduce:transition-none ${focusRing}`}
          >
            Register a client
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </Link>
          <Link
            to="/details"
            className={`inline-flex min-h-11 w-full sm:w-auto items-center justify-center rounded-lg border border-[var(--theme-border)] px-6 py-3 font-medium !text-teal-700 [[data-theme=dark]_&]:!text-teal-300 !no-underline hover:!no-underline hover:bg-[rgba(16,205,181,0.08)] transition-colors motion-reduce:transition-none ${focusRing}`}
          >
            Look up details
          </Link>
        </div>

        <ul className="mt-12 flex flex-wrap justify-center gap-3 list-none p-0 m-0">
          {features.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-glass-bg)] backdrop-blur-sm px-4 py-2 text-sm text-[var(--theme-text-primary)]"
            >
              <Icon size={16} aria-hidden="true" className="shrink-0 text-teal-600 [[data-theme=dark]_&]:text-teal-400" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
