const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isBlank(value: string): boolean {
  return value.trim().length === 0
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

/** Returns true when the errors object has no messages. */
export function hasNoErrors(errors: object): boolean {
  return Object.values(errors).every((message) => !message)
}
