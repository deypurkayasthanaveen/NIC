import { useId, type SelectHTMLAttributes } from 'react'
import { describedBy } from '../../utils/aria'
import { FormField } from '../forms/FormField'
import styles from '../forms/FormField.module.css'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  placeholder?: string
  error?: string
  hint?: string
  /** Visually hide the label (it stays available to screen readers), e.g. in toolbars. */
  hideLabel?: boolean
}

export function Select({
  label,
  options,
  placeholder,
  error,
  hint,
  hideLabel = false,
  id,
  required,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  const control = (
    <select
      id={selectId}
      className={styles.control}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(selectId, error, hint)}
      aria-required={required || undefined}
      aria-label={hideLabel ? label : undefined}
      {...rest}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  if (hideLabel) return control

  return (
    <FormField id={selectId} label={label} error={error} hint={hint} required={required}>
      {control}
    </FormField>
  )
}
