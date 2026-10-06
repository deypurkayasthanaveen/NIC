import { Badge, StatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { DetailList } from '../../components/common/DetailList'
import { Modal } from '../../components/common/Modal'
import { PERMISSION_ACTIONS, PERMISSION_MODULES, type Role } from '../../types/role'
import { capitalize } from '../../utils/format'
import styles from './Roles.module.css'

interface RoleViewModalProps {
  role: Role
  userCount: number
  onClose: () => void
  onEdit: () => void
}

export function RoleViewModal({ role, userCount, onClose, onEdit }: RoleViewModalProps) {
  const permissionItems = PERMISSION_MODULES.map((module) => {
    const granted = PERMISSION_ACTIONS.filter((action) => role.permissions[module][action])
    return {
      label: `${capitalize(module)} permissions`,
      value: granted.length ? (
        <span className={styles.permissionTags}>
          {granted.map((action) => (
            <Badge key={action} tone="info">
              {capitalize(action)}
            </Badge>
          ))}
        </span>
      ) : (
        'No access'
      ),
    }
  })

  return (
    <Modal
      open
      title={role.name}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>Edit Role</Button>
        </>
      }
    >
      <DetailList
        items={[
          { label: 'Description', value: role.description || 'No description' },
          { label: 'Status', value: <StatusBadge status={role.status} /> },
          { label: 'Assigned users', value: userCount },
          ...permissionItems,
        ]}
      />
    </Modal>
  )
}
