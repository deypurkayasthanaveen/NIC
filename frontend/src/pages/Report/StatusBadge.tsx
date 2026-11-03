import { CircleCheck, CircleX, Clock } from 'lucide-react'
import type { DisplayStatus } from '../../services/reportService'

const statusContent = {
  completed: { label: 'Completed', className: 'report-badge--completed', Icon: CircleCheck },
  pending: { label: 'Pending', className: 'report-badge--pending', Icon: Clock },
  expired: { label: 'Expired', className: 'report-badge--expired', Icon: CircleX },
} satisfies Record<DisplayStatus, { label: string; className: string; Icon: typeof CircleCheck }>

export function StatusBadge({ status }: { status: DisplayStatus }) {
  const { label, className, Icon } = statusContent[status]

  return (
    <span
      className={`report-status-badge ${className} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium`}
    >
      <Icon size={14} aria-hidden="true" />
      {label}
    </span>
  )
}
