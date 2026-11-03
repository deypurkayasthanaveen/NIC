const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function parseDate(value: string | Date): number | null {
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value)
  return Number.isFinite(timestamp) ? timestamp : null
}

export function formatDate(value: string | Date): string {
  const timestamp = parseDate(value)
  return timestamp === null ? '—' : dateFormatter.format(timestamp)
}

export function formatDateTime(value: string | Date): string {
  const timestamp = parseDate(value)
  if (timestamp === null) return '—'
  const parts = dateTimeFormatter.formatToParts(timestamp)
  const date = dateFormatter.format(timestamp)
  const time = parts
    .filter((part) => part.type === 'hour' || part.type === 'minute')
    .map((part) => part.value)
    .join(':')
  return `${date}, ${time}`
}

export function formatDuration(start: string, end: string | null): string {
  if (!end) return '—'
  const startTime = parseDate(start)
  const endTime = parseDate(end)
  if (startTime === null || endTime === null || endTime < startTime) return '—'

  const totalMinutes = Math.floor((endTime - startTime) / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} min`
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`
}

export function formatRemaining(value: string, now = Date.now()): string {
  const expiryTime = parseDate(value)
  if (expiryTime === null || expiryTime <= now) return '—'

  const remainingMs = expiryTime - now
  const days = Math.round(remainingMs / 86_400_000)
  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'}`

  const hours = Math.round(remainingMs / 3_600_000)
  if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  return 'Less than an hour'
}
