import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClientApiError, listClients, type ClientListItem } from '../../services/clientService'

type DateSort = 'newest' | 'oldest'

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
      <span className="text-xl font-semibold tracking-tight text-zinc-50">AuthDesk</span>
    </div>
  )
}

export function DetailsPage() {
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [search, setSearch] = useState('')
  const [dateSort, setDateSort] = useState<DateSort>('newest')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const rows = await listClients()
        if (!cancelled) setClients(rows)
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof ClientApiError ? caught.message : 'Failed to load clients.')
          setClients([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const visibleClients = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = query
      ? clients.filter((client) => client.client_name.toLowerCase().includes(query))
      : clients.slice()
    filtered.sort((a, b) => {
      const left = a.date
      const right = b.date
      if (left === right) return 0
      if (dateSort === 'newest') return left < right ? 1 : -1
      return left < right ? -1 : 1
    })
    return filtered
  }, [clients, search, dateSort])

  const toggleDateSort = () => {
    setDateSort((previous) => (previous === 'newest' ? 'oldest' : 'newest'))
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 px-6 py-5 md:px-10">
        <AuthDeskLogo />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="search by client name"
          aria-label="Search by client name"
          className="w-full max-w-xs rounded-md border border-zinc-800 bg-transparent px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus-visible:!shadow-none sm:w-72"
        />
      </header>

      <main className="px-6 py-8 md:px-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="!text-3xl font-semibold text-zinc-50">Clients</h1>
            <p className="mt-1 text-zinc-400">Registered client applications.</p>
          </div>
          <Link to="/submit-form" className="text-sm text-zinc-400 no-underline hover:text-zinc-50">
            Back to submit form
          </Link>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Client Id
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Client Name
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Redirect URL
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    onClick={toggleDateSort}
                    className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-medium text-zinc-300 hover:text-zinc-50 focus-visible:!shadow-none"
                    aria-label={
                      dateSort === 'newest'
                        ? 'Sorted newest to oldest. Click to sort oldest to newest.'
                        : 'Sorted oldest to newest. Click to sort newest to oldest.'
                    }
                  >
                    Date
                    <span aria-hidden="true" className="text-teal-400">
                      {dateSort === 'newest' ? '↓' : '↑'}
                    </span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                    Loading clients...
                  </td>
                </tr>
              ) : visibleClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                    {search.trim() ? 'No clients match that name.' : 'No clients registered yet.'}
                  </td>
                </tr>
              ) : (
                visibleClients.map((client) => (
                  <tr key={client.client_id} className="border-t border-zinc-800 hover:bg-zinc-900/60">
                    <td className="max-w-[14rem] truncate px-4 py-3 font-mono text-xs text-zinc-200">
                      {client.client_id}
                    </td>
                    <td className="px-4 py-3 text-zinc-100">{client.client_name}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-zinc-300">{client.redirect_urls}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">{client.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
