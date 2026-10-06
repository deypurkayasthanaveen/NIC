import { useState, type FormEvent } from 'react'
import { Button } from '../../components/common/Button'
import { Checkbox } from '../../components/common/Checkbox'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { Select } from '../../components/common/Select'
import { Textarea } from '../../components/common/Textarea'
import { STATUSES, type FormErrors, type Status } from '../../types/common'
import {
  emptyPermissions,
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  type PermissionAction,
  type PermissionModule,
  type Role,
  type RoleInput,
} from '../../types/role'
import { capitalize } from '../../utils/format'
import { hasNoErrors, isBlank } from '../../utils/validation'
import styles from './Roles.module.css'

const FORM_ID = 'role-form'
const statusOptions = STATUSES.map((status) => ({ value: status, label: status }))

function validate(values: RoleInput): FormErrors<RoleInput> {
  return {
    name: isBlank(values.name) ? 'Role name is required' : undefined,
    description: values.description.length > 200 ? 'Description must be 200 characters or fewer' : undefined,
  }
}

interface RoleFormModalProps {
  /** Existing role to edit; omit to create a new one. */
  role?: Role
  onClose: () => void
  onSave: (values: RoleInput) => Promise<void>
}

export function RoleFormModal({ role, onClose, onSave }: RoleFormModalProps) {
  const [values, setValues] = useState<RoleInput>(() =>
    role
      ? { name: role.name, description: role.description, status: role.status, permissions: role.permissions }
      : { name: '', description: '', status: 'Active', permissions: emptyPermissions() },
  )
  const [errors, setErrors] = useState<FormErrors<RoleInput>>({})
  const [saving, setSaving] = useState(false)

  const togglePermission = (module: PermissionModule, action: PermissionAction, checked: boolean) => {
    setValues((previous) => ({
      ...previous,
      permissions: {
        ...previous.permissions,
        [module]: { ...previous.permissions[module], [action]: checked },
      },
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (!hasNoErrors(nextErrors)) return

    setSaving(true)
    try {
      await onSave({ ...values, name: values.name.trim(), description: values.description.trim() })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      title={role ? 'Edit Role' : 'Add Role'}
      onClose={onClose}
      size="lg"
      dismissible={!saving}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={saving}>
            {role ? 'Save Changes' : 'Create Role'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="Role Name"
          value={values.name}
          onChange={(event) => {
            setValues((previous) => ({ ...previous, name: event.target.value }))
            if (errors.name) setErrors((previous) => ({ ...previous, name: undefined }))
          }}
          error={errors.name}
          required
        />
        <Textarea
          label="Description"
          value={values.description}
          onChange={(event) => setValues((previous) => ({ ...previous, description: event.target.value }))}
          error={errors.description}
          hint={`${values.description.length}/200 characters`}
        />
        <Select
          label="Status"
          value={values.status}
          onChange={(event) => setValues((previous) => ({ ...previous, status: event.target.value as Status }))}
          options={statusOptions}
        />

        <div className={styles.permissions}>
          <span className={styles.permissionsTitle}>Permissions</span>
          {PERMISSION_MODULES.map((module) => (
            <fieldset key={module} className={styles.permissionGroup}>
              <legend>{capitalize(module)}</legend>
              <div className={styles.permissionOptions}>
                {PERMISSION_ACTIONS.map((action) => (
                  <Checkbox
                    key={action}
                    label={capitalize(action)}
                    checked={values.permissions[module][action]}
                    onChange={(event) => togglePermission(module, action, event.target.checked)}
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </form>
    </Modal>
  )
}
