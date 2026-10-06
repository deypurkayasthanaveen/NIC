import { useState, type FormEvent } from 'react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Select, type SelectOption } from '../../components/common/Select'
import { FormActions } from '../../components/forms/FormActions'
import { FormGrid } from '../../components/forms/FormField'
import { departments } from '../../data/users'
import { STATUSES, type FormErrors, type Status } from '../../types/common'
import type { UserInput } from '../../types/user'
import { hasNoErrors, isBlank, isValidEmail } from '../../utils/validation'
import styles from './Users.module.css'

const statusOptions: SelectOption[] = STATUSES.map((status) => ({ value: status, label: status }))
const departmentOptions: SelectOption[] = departments.map((department) => ({ value: department, label: department }))
const PHONE_PATTERN = /^[+\d][\d\s-]{6,}$/

function validate(values: UserInput): FormErrors<UserInput> {
  return {
    name: isBlank(values.name) ? 'Name is required' : undefined,
    email: isBlank(values.email)
      ? 'Email is required'
      : !isValidEmail(values.email)
        ? 'Invalid email'
        : undefined,
    role: isBlank(values.role) ? 'Role is required' : undefined,
    phone: values.phone && !PHONE_PATTERN.test(values.phone.trim()) ? 'Invalid phone number' : undefined,
  }
}

interface UserFormProps {
  initialValues: UserInput
  roleOptions: SelectOption[]
  submitLabel: string
  onSubmit: (values: UserInput) => Promise<void>
  onCancel: () => void
}

export function UserForm({ initialValues, roleOptions, submitLabel, onSubmit, onCancel }: UserFormProps) {
  const [values, setValues] = useState<UserInput>(initialValues)
  const [errors, setErrors] = useState<FormErrors<UserInput>>({})
  const [saving, setSaving] = useState(false)

  const setField = <K extends keyof UserInput>(field: K, value: UserInput[K]) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (!hasNoErrors(nextErrors)) return

    setSaving(true)
    try {
      await onSubmit({ ...values, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormGrid>
        <Input
          label="Name"
          value={values.name}
          onChange={(event) => setField('name', event.target.value)}
          error={errors.name}
          autoComplete="off"
          required
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) => setField('email', event.target.value)}
          error={errors.email}
          autoComplete="off"
          required
        />
        <Select
          label="Role"
          value={values.role}
          onChange={(event) => setField('role', event.target.value)}
          options={roleOptions}
          placeholder="Select a role"
          error={errors.role}
          required
        />
        <Select
          label="Status"
          value={values.status}
          onChange={(event) => setField('status', event.target.value as Status)}
          options={statusOptions}
        />
        <Input
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={(event) => setField('phone', event.target.value)}
          error={errors.phone}
          hint="Optional, e.g. +91 98765 43210"
        />
        <Select
          label="Department"
          value={values.department}
          onChange={(event) => setField('department', event.target.value)}
          options={departmentOptions}
          placeholder="Select a department"
        />
      </FormGrid>
      <FormActions>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </FormActions>
    </form>
  )
}
