/** IDs a form control should reference via aria-describedby (matches FormField's markup). */
export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  const ids = [error && `${id}-error`, hint && !error && `${id}-hint`].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
}
