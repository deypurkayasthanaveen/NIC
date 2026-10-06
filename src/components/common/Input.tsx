import { useId, type InputHTMLAttributes } from 'react'
import { describedBy } from '../../utils/aria'
import { FormField } from '../forms/FormField'
import styles from '../forms/FormField.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, id, required, className, ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FormField id={inputId} label={label} error={error} hint={hint} required={required}>
      <input
        id={inputId}
        className={`${styles.control} ${className ?? ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        aria-required={required || undefined}
        {...rest}
      />
    </FormField>
  )
}
