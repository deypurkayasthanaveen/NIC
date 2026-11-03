import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { ClientReport, DisplayStatus } from '../../services/reportService'
import { formatDateTime } from './reportFormatting'
import { StatusBadge } from './StatusBadge'

interface StatCardProps {
  label: string
  Icon: LucideIcon
  children: ReactNode
}

export function StatCard({ label, Icon, children }: StatCardProps) {
  return (
    <section className="authdesk-glass-card break-inside-avoid rounded-[20px] p-5 sm:p-6">
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(16,205,181,0.14)] text-teal-800 [[data-theme=dark]_&]:text-teal-300">
        <Icon size={16} aria-hidden="true" />
      </div>
      <h2 className="text-xs font-medium text-[var(--theme-text-secondary)]">{label}</h2>
      <div className="mt-1 text-sm font-semibold text-[var(--theme-text-primary)]">{children}</div>
    </section>
  )
}

interface ClientDetailsCardProps {
  report: ClientReport
  status: DisplayStatus
}

export function ClientDetailsCard({ report, status }: ClientDetailsCardProps) {
  const fields = [
    { label: 'Application name', value: report.clientName, className: 'font-medium' },
    { label: 'Client ID', value: report.clientId, className: 'font-mono text-xs' },
    { label: 'Redirect URL', value: report.redirectUrls, className: 'break-all' },
    { label: 'Valid until', value: formatDateTime(report.expiresAt), className: '' },
  ]

  return (
    <section className="authdesk-glass-card break-inside-avoid rounded-[20px] p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-[var(--theme-text-primary)]">Client details</h2>
        <StatusBadge status={status} />
      </div>
      <dl className="space-y-3">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <dt className="text-xs text-[var(--theme-text-secondary)]">{field.label}</dt>
            <dd className={`mt-0.5 min-w-0 text-sm text-[var(--theme-text-primary)] ${field.className}`}>
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
