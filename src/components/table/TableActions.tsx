import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button, LinkButton } from '../common/Button'
import styles from './Table.module.css'

type Action = string | (() => void)

interface TableActionsProps {
  /** Name of the row's item, used in accessible labels, e.g. "View John Doe". */
  itemLabel: string
  /** A route path renders a link; a function renders a button. */
  onView?: Action
  onEdit?: Action
  onDelete?: () => void
}

function ActionControl({ action, label, icon }: { action: Action; label: string; icon: ReactNode }) {
  const common = { variant: 'ghost', size: 'sm', iconOnly: true, icon, 'aria-label': label, title: label } as const
  return typeof action === 'string' ? <LinkButton to={action} {...common} /> : <Button onClick={action} {...common} />
}

export function TableActions({ itemLabel, onView, onEdit, onDelete }: TableActionsProps) {
  return (
    <div className={styles.actions}>
      {onView && <ActionControl action={onView} label={`View ${itemLabel}`} icon={<Eye size={16} />} />}
      {onEdit && <ActionControl action={onEdit} label={`Edit ${itemLabel}`} icon={<Pencil size={16} />} />}
      {onDelete && <ActionControl action={onDelete} label={`Delete ${itemLabel}`} icon={<Trash2 size={16} />} />}
    </div>
  )
}
