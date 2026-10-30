import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ClientApiError, listClients, type ClientListItem } from '../../services/clientService'

type DateSort = 'newest' | 'oldest'

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
    <div className="min-h-full flex-1 bg-[var(--theme-bg)] text-[var(--theme-text-primary)] transition-colors duration-150">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--theme-border)] px-6 py-5 md:px-10 pr-16 sm:pr-16 md:pr-16">
        <Link
          to="/submit-form"
          aria-label="Back to submit form"
          title="Back to submit form"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--theme-border)] bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] no-underline hover:text-[var(--theme-text-primary)] focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-teal-500/60 focus-visible:!ring-offset-2 focus-visible:!shadow-none transition-colors"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search By Client Name"
          aria-label="Search By Client Name"
          className="w-full max-w-xs rounded-md border border-[var(--theme-border)] bg-[var(--theme-input-bg)] px-3.5 py-2.5 text-sm text-[var(--theme-text-primary)] placeholder-[var(--theme-text-placeholder)] focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus-visible:!shadow-none transition-colors sm:w-72"
        />
      </header>

      <main className="px-6 py-8 md:px-10">
        <div className="mb-6">
          <h1 className="!text-3xl font-semibold text-[var(--theme-text-primary)]">Clients</h1>
          <p className="mt-1 text-[var(--theme-text-secondary)]">Registered client applications.</p>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border border-[var(--theme-border)]">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="bg-[var(--theme-table-header-bg)] text-[var(--theme-text-secondary)]">
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
                    className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-medium text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] focus-visible:!shadow-none transition-colors"
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
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--theme-text-secondary)]">
                    Loading clients...
                  </td>
                </tr>
              ) : visibleClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--theme-text-secondary)]">
                    {search.trim() ? 'No clients match that name.' : 'No clients registered yet.'}
                  </td>
                </tr>
              ) : (
                visibleClients.map((client) => (
                  <tr key={client.client_id} className="border-t border-[var(--theme-border)] hover:bg-[var(--theme-table-row-hover)] transition-colors">
                    <td className="max-w-[14rem] truncate px-4 py-3 font-mono text-xs text-[var(--theme-text-secondary)]">
                      {client.client_id}
                    </td>
                    <td className="px-4 py-3 text-[var(--theme-text-primary)]">{client.client_name}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-[var(--theme-text-secondary)]">{client.redirect_urls}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--theme-text-secondary)]">{client.date}</td>
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
