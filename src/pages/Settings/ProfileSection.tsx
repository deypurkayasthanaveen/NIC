import { useState, type FormEvent } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import { FormActions } from '../../components/forms/FormActions'
import type { Profile } from '../../context/authContext'
import { departments } from '../../data/users'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import type { FormErrors } from '../../types/common'
import { hasNoErrors, isBlank, isValidEmail } from '../../utils/validation'
import styles from './Settings.module.css'

const departmentOptions = [...departments, 'Administration'].map((value) => ({ value, label: value }))

function validate(values: Profile): FormErrors<Profile> {
  return {
    name: isBlank(values.name) ? 'Name is required' : undefined,
    email: isBlank(values.email) ? 'Email is required' : !isValidEmail(values.email) ? 'Invalid email' : undefined,
  }
}

export function ProfileSection() {
  const { profile, updateProfile } = useAuth()
  const { showToast } = useToast()
  const [values, setValues] = useState<Profile>(profile)
  const [errors, setErrors] = useState<FormErrors<Profile>>({})

  const setField = (field: keyof Profile, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (!hasNoErrors(nextErrors)) return

    updateProfile({ ...values, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() })
    showToast('success', 'Settings saved successfully')
  }

  return (
    <Card title="Profile" description="Your personal details shown across the panel.">
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input label="Name" value={values.name} onChange={(e) => setField('name', e.target.value)} error={errors.name} required />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
          required
        />
        <Input label="Phone" type="tel" value={values.phone} onChange={(e) => setField('phone', e.target.value)} />
        <Select
          label="Department"
          value={values.department}
          onChange={(e) => setField('department', e.target.value)}
          options={departmentOptions}
          placeholder="Select a department"
        />
        <FormActions>
          <Button variant="secondary" onClick={() => setValues(profile)}>
            Reset
          </Button>
          <Button type="submit">Save Profile</Button>
        </FormActions>
      </form>
    </Card>
  )
}
