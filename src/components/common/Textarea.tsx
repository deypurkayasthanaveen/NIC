import { useId, type TextareaHTMLAttributes } from 'react'
import { describedBy } from '../../utils/aria'
import { FormField } from '../forms/FormField'
import styles from '../forms/FormField.module.css'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, id, required, ...rest }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <FormField id={textareaId} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={textareaId}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(textareaId, error, hint)}
        aria-required={required || undefined}
        {...rest}
      />
    </FormField>
  )
}
