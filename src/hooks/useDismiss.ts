import { useEffect, useEffectEvent, type RefObject } from 'react'

/** Calls `onDismiss` on outside click or Escape while `active` is true (dropdowns, drawers). */
export function useDismiss(ref: RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void) {
  const dismiss = useEffectEvent(onDismiss)

  useEffect(() => {
    if (!active) return

    const handlePointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) dismiss()
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss()
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [ref, active])
}
