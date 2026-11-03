import { Check, Clock, X } from 'lucide-react'
import type { ClientReport, DisplayStatus } from '../../services/reportService'
import { formatDateTime } from './reportFormatting'

interface TimelineCardProps {
  report: ClientReport
  status: DisplayStatus
}

interface Step {
  title: string
  detail: string
  state: 'done' | 'current' | 'expired' | 'upcoming'
  Icon: typeof Check
}

export function TimelineCard({ report, status }: TimelineCardProps) {
  const steps: Step[] = [
    {
      title: 'Request submitted',
      detail: formatDateTime(report.createdAt),
      state: 'done',
      Icon: Check,
    },
    {
      title: 'Pending verification',
      detail:
        status === 'completed' && report.completedAt
          ? `Verified: ${formatDateTime(report.createdAt)} to ${formatDateTime(report.completedAt)}`
          : status === 'expired'
            ? 'Not verified before expiry'
            : 'Waiting for verification',
      state: status === 'completed' ? 'done' : status === 'expired' ? 'expired' : 'current',
      Icon: status === 'completed' ? Check : status === 'expired' ? X : Clock,
    },
    {
      title: 'Registration completed',
      detail:
        status === 'completed' && report.completedAt
          ? formatDateTime(report.completedAt)
          : status === 'expired'
            ? 'Not completed'
            : 'Not yet completed',
      state: status === 'completed' ? 'done' : 'upcoming',
      Icon: Check,
    },
  ]
  const completedSteps = steps.filter((step) => step.state === 'done').length

  return (
    <section className="authdesk-glass-card break-inside-avoid rounded-[20px] p-5 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-[var(--theme-text-primary)]">Timeline</h2>
        <span className="text-sm text-[var(--theme-text-secondary)]">{completedSteps} of 3 steps done</span>
      </div>
      <div className="mb-5 flex gap-1" aria-hidden="true">
        {steps.map((step, index) => (
          <span
            key={step.title}
            className={`h-1.5 flex-1 rounded-full ${
              step.state === 'done'
                ? 'bg-[#10CDB5]'
                : step.state === 'current'
                  ? 'animate-pulse bg-amber-500 motion-reduce:animate-none'
                  : 'bg-[var(--theme-border)]'
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          />
        ))}
      </div>
      <ol className="list-none">
        {steps.map((step, index) => {
          const Icon = step.Icon
          const isDone = step.state === 'done'
          const stateLabel = isDone
            ? 'done'
            : step.state === 'current'
              ? 'current'
              : step.state === 'expired'
                ? 'expired'
                : 'not started'

          return (
            <li
              key={step.title}
              className="flex gap-3"
              aria-label={`Step ${index + 1} of 3, ${stateLabel}`}
            >
              <span className="flex w-6 shrink-0 flex-col items-center">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    isDone
                      ? 'bg-[#10CDB5] text-[#06322D]'
                      : step.state === 'current'
                        ? 'bg-amber-100 text-amber-800 [[data-theme=dark]_&]:bg-amber-900/50 [[data-theme=dark]_&]:text-amber-300'
                        : step.state === 'expired'
                          ? 'bg-red-100 text-red-800 [[data-theme=dark]_&]:bg-red-900/50 [[data-theme=dark]_&]:text-red-300'
                          : 'bg-[var(--theme-border)] text-[var(--theme-text-secondary)]'
                  }`}
                >
                  <Icon size={14} aria-hidden="true" />
                </span>
                {index < steps.length - 1 ? (
                  <span
                    className={`my-1 w-0.5 flex-1 ${
                      isDone ? 'bg-[#10CDB5]' : 'bg-[var(--theme-border)]'
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
              </span>
              <div className={`min-w-0 ${index < steps.length - 1 ? 'pb-4' : ''}`}>
                <p className="text-sm font-medium text-[var(--theme-text-primary)]">{step.title}</p>
                <p className="break-words text-xs text-[var(--theme-text-secondary)]">{step.detail}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
