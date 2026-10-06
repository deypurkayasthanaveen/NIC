import { useParams } from 'react-router-dom'

/** Reads the `:id` route param as a positive integer, or null when missing / malformed. */
export function useIdParam(): number | null {
  const { id } = useParams()
  const parsed = Number(id)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}
