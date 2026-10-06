import { useState, type FormEvent } from 'react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { Select } from '../../components/common/Select'
import { FormGrid } from '../../components/forms/FormField'
import { STATUSES, type FormErrors, type Status } from '../../types/common'
import { RECORD_CATEGORIES, type DataRecord, type DataRecordInput, type RecordCategory } from '../../types/record'
import { hasNoErrors, isBlank } from '../../utils/validation'
import styles from './Data.module.css'

const FORM_ID = 'record-form'
const statusOptions = STATUSES.map((status) => ({ value: status, label: status }))
const categoryOptions = RECORD_CATEGORIES.map((category) => ({ value: category, label: category }))

interface RecordFormValues {
  name: string
  category: RecordCategory | ''
  status: Status
}

function validate(values: RecordFormValues): FormErrors<RecordFormValues> {
  return {
    name: isBlank(values.name) ? 'Name is required' : undefined,
    category: values.category === '' ? 'Category is required' : undefined,
  }
}

interface RecordFormModalProps {
  record?: DataRecord
  onClose: () => void
  onSave: (values: DataRecordInput) => Promise<void>
}

export function RecordFormModal({ record, onClose, onSave }: RecordFormModalProps) {
  const [values, setValues] = useState<RecordFormValues>(() =>
    record
      ? { name: record.name, category: record.category, status: record.status }
      : { name: '', category: '', status: 'Active' },
  )
  const [errors, setErrors] = useState<FormErrors<RecordFormValues>>({})
  const [saving, setSaving] = useState(false)

  const setField = <K extends keyof RecordFormValues>(field: K, value: RecordFormValues[K]) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (!hasNoErrors(nextErrors) || values.category === '') return

    setSaving(true)
    try {
      await onSave({ name: values.name.trim(), category: values.category, status: values.status })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      title={record ? 'Edit Record' : 'Add Record'}
      onClose={onClose}
      dismissible={!saving}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={saving}>
            {record ? 'Save Changes' : 'Create Record'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="Name"
          value={values.name}
          onChange={(event) => setField('name', event.target.value)}
          error={errors.name}
          required
        />
        <FormGrid>
          <Select
            label="Category"
            value={values.category}
            onChange={(event) => setField('category', event.target.value as RecordCategory)}
            options={categoryOptions}
            placeholder="Select a category"
            error={errors.category}
            required
          />
          <Select
            label="Status"
            value={values.status}
            onChange={(event) => setField('status', event.target.value as Status)}
            options={statusOptions}
          />
        </FormGrid>
      </form>
    </Modal>
  )
}
