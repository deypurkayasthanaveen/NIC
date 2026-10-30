import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="grid min-h-full flex-1 place-items-center bg-[var(--theme-bg)] px-6 text-[var(--theme-text-primary)] transition-colors duration-150">
      <div className="text-center">
        <p className="text-5xl font-bold text-teal-400" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 !text-2xl font-semibold text-[var(--theme-text-primary)]">Page not found</h1>
        <p className="mt-2 text-[var(--theme-text-secondary)]">The page you are looking for does not exist.</p>
        <Link
          to="/submit-form"
          className="mt-6 inline-block rounded-md bg-[var(--theme-btn-primary-bg)] px-5 py-2.5 font-medium !text-[var(--theme-btn-primary-text)] no-underline hover:opacity-90 transition-opacity"
        >
          Back to submit form
        </Link>
      </div>
    </main>
  )
}
