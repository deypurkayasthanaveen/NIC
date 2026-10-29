import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-6 text-zinc-50">
      <div className="text-center">
        <p className="text-5xl font-bold text-teal-400" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 !text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-zinc-400">The page you are looking for does not exist.</p>
        <Link
          to="/submit-form"
          className="mt-6 inline-block rounded-md bg-zinc-50 px-5 py-2.5 font-medium !text-zinc-900 no-underline"
        >
          Back to submit form
        </Link>
      </div>
    </main>
  )
}
