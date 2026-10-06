import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import styles from './Button.module.css'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md'

interface StyleProps {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  /** Render only the icon; `aria-label` is then required for screen readers. */
  iconOnly?: boolean
  fullWidth?: boolean
}

function classNames({ variant = 'primary', size = 'md', iconOnly, fullWidth }: StyleProps, extra?: string) {
  return [
    styles.button,
    styles[variant],
    size === 'sm' && styles.sm,
    iconOnly && styles.iconOnly,
    fullWidth && styles.fullWidth,
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {
  loading?: boolean
}

export function Button({
  variant,
  size,
  icon,
  iconOnly,
  fullWidth,
  loading = false,
  type = 'button',
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames({ variant, size, iconOnly, fullWidth }, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size="sm" label="" /> : icon}
      {!iconOnly && children}
    </button>
  )
}

type LinkButtonProps = LinkProps & StyleProps

export function LinkButton({ variant, size, icon, iconOnly, fullWidth, className, children, ...rest }: LinkButtonProps) {
  return (
    <Link className={classNames({ variant, size, iconOnly, fullWidth }, className)} {...rest}>
      {icon}
      {!iconOnly && children}
    </Link>
  )
}
