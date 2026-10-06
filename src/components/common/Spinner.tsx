import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: 'sm' | 'md'
  /** Visible text next to the spinner; pass an empty string for none. */
  label?: string
  centered?: boolean
}

export function Spinner({ size = 'md', label = 'Loading...', centered = false }: SpinnerProps) {
  const spinner = (
    <span className={styles.wrapper} role="status">
      <span className={`${styles.spinner} ${size === 'sm' ? styles.sm : ''}`} aria-hidden="true" />
      {label ? <span>{label}</span> : <span className="sr-only">Loading</span>}
    </span>
  )

  return centered ? <div className={styles.centered}>{spinner}</div> : spinner
}
