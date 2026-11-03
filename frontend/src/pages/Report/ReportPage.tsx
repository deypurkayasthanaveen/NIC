import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, Check, CircleCheck, Clock, Copy, Download, Hourglass } from 'lucide-react'
import {
  deriveDisplayStatus,
  getReport,
  ReportApiError,
  type ClientReport,
} from '../../services/reportService'
import { ClientDetailsCard, StatCard } from './ReportCards'
import { ReportError } from './ReportError'
import { ReportLoading } from './ReportLoading'
import { TimelineCard } from './TimelineCard'
import { StatusBadge } from './StatusBadge'
import { formatDate, formatDateTime, formatDuration, formatRemaining } from './reportFormatting'

const focusRing =
  'focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-teal-500 focus-visible:!ring-offset-2 focus-visible:!shadow-none'

function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div
      className="report-page relative min-h-full w-full flex-1 overflow-x-hidden bg-[var(--theme-bg)] text-[var(--theme-text-primary)] transition-colors duration-150"
      style={{
        backgroundImage:
          'radial-gradient(circle, var(--theme-dots) 0.75px, transparent 1px), var(--theme-page-gradient)',
        backgroundSize: '32px 32px, 100% 100%',
        backgroundRepeat: 'repeat, no-repeat',
      }}
    >
      {children}
    </div>
  )
}

export function ReportPage() {
  const location = useLocation()
  const clientId =
    typeof location.state === 'object' &&
    location.state !== null &&
    'clientId' in location.state &&
    typeof location.state.clientId === 'string'
      ? location.state.clientId
      : ''
  const [loadedReport, setLoadedReport] = useState<{
    clientId: string
    report: ClientReport | null
    error: string | null
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<number | null>(null)
  const generatedAt = useMemo(() => new Date(), [])

  useEffect(() => {
    if (!clientId) return

    let cancelled = false

    void (async () => {
      try {
        const result = await getReport(clientId)
        if (!cancelled) setLoadedReport({ clientId, report: result, error: null })
      } catch (caught) {
        if (!cancelled) {
          const message =
            caught instanceof ReportApiError
              ? caught.message
              : caught instanceof Error
                ? caught.message
                : 'Failed to load report.'
          setLoadedReport({ clientId, report: null, error: message })
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [clientId])

  const currentResult = loadedReport?.clientId === clientId ? loadedReport : null
  const report = currentResult?.report ?? null
  const error = currentResult?.error ?? null
  const loading = Boolean(clientId) && currentResult === null

  useEffect(
    () => () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    },
    [],
  )

  const copyClientId = async () => {
    if (!report) return
    try {
      await navigator.clipboard.writeText(report.clientId)
      setCopied(true)
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      return
    }
  }

  return (
    <PageBackground>
      <div className="mx-auto w-full max-w-5xl px-5 pt-10 pb-16 sm:px-8">
        {!clientId ? (
          <>
            <h1 className="mb-3 !text-3xl font-semibold text-[var(--theme-text-primary)]">Report</h1>
            <p className="text-[var(--theme-text-secondary)]">
              Select a client first to view its report.
            </p>
            <Link
              to="/details"
              className="mt-4 inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium !text-teal-700 !no-underline hover:!text-teal-600 [[data-theme=dark]_&]:!text-teal-300"
            >
              View clients
            </Link>
          </>
        ) : loading ? (
          <ReportLoading />
        ) : error || !report ? (
          <>
            <h1 className="mb-6 !text-3xl font-semibold text-[var(--theme-text-primary)]">Report</h1>
            <div className="grid min-h-72 place-items-center">
              <ReportError message={error ?? 'Failed to load report.'} />
            </div>
          </>
        ) : (
          <>
            <div className="print-report-heading mb-6 hidden print:block">
              <h2 className="text-xl font-semibold">AuthDesk report</h2>
              <p className="mt-1 text-sm">{report.clientName}</p>
              <p className="mt-1 text-xs">Generated: {formatDateTime(generatedAt)}</p>
            </div>

            <div className="report-screen-heading mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="!text-3xl font-semibold text-[var(--theme-text-primary)]">Report</h1>
                <p className="mt-1 text-sm text-[var(--theme-text-secondary)]">
                  Status and timeline of your registered client
                </p>
              </div>
              <div className="report-actions flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copyClientId()}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--theme-border)] px-4 py-2 text-sm font-medium !text-teal-800 hover:bg-[rgba(16,205,181,0.08)] [[data-theme=dark]_&]:!text-teal-300 ${focusRing}`}
                >
                  {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy ID'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--theme-btn-primary-bg)] px-4 py-2 text-sm font-medium !text-[var(--theme-btn-primary-text)] hover:opacity-90 ${focusRing}`}
                >
                  <Download size={17} aria-hidden="true" />
                  Download PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatCard label="Status" Icon={CircleCheck}>
                <StatusBadge status={deriveDisplayStatus(report)} />
              </StatCard>
              <StatCard label="Registered" Icon={Calendar}>
                {formatDate(report.createdAt)}
              </StatCard>
              <StatCard label="Completed in" Icon={Clock}>
                {deriveDisplayStatus(report) === 'completed'
                  ? formatDuration(report.createdAt, report.completedAt)
                  : deriveDisplayStatus(report) === 'expired'
                    ? 'Not completed'
                    : 'In progress'}
              </StatCard>
              <StatCard label="Expires in" Icon={Hourglass}>
                {deriveDisplayStatus(report) === 'expired' ? (
                  <>
                    <span>Expired</span>
                    <span className="mt-0.5 block text-xs font-normal text-[var(--theme-text-secondary)]">
                      {formatDate(report.expiresAt)}
                    </span>
                  </>
                ) : (
                  formatRemaining(report.expiresAt)
                )}
              </StatCard>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <ClientDetailsCard report={report} status={deriveDisplayStatus(report)} />
              <TimelineCard report={report} status={deriveDisplayStatus(report)} />
            </div>

            {import.meta.env.DEV ? (
              <p className="mt-8 text-xs text-[var(--theme-text-secondary)]">
                Demo data:{' '}
                <Link to="/report" state={{ clientId: 'cl_demo_completed' }}>
                  completed
                </Link>
                {' · '}
                <Link to="/report" state={{ clientId: 'cl_demo_pending' }}>
                  pending
                </Link>
                {' · '}
                <Link to="/report" state={{ clientId: 'cl_demo_expired' }}>
                  expired
                </Link>
              </p>
            ) : null}
          </>
        )}
      </div>
    </PageBackground>
  )
}
