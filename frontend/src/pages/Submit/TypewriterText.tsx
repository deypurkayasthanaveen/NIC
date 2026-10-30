import { useEffect, useState } from 'react'

const HOLD_MS = 2200

function useTypewriter(text: string, speed = 90) {
  const [count, setCount] = useState(0)
  const [announced, setAnnounced] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(text.length)
      setAnnounced(true)
      return
    }

    setCount(0)
    let timeoutId = 0
    let cancelled = false

    const typeFrom = (current: number) => {
      if (cancelled) return
      if (current >= text.length) {
        setAnnounced(true)
        timeoutId = window.setTimeout(() => {
          if (cancelled) return
          setCount(0)
          typeFrom(0)
        }, HOLD_MS)
        return
      }

      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        const next = current + 1
        setCount(next)
        typeFrom(next)
      }, speed)
    }

    typeFrom(0)
    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [text, speed])

  return { typed: text.slice(0, count), announced }
}

interface TypewriterTextProps {
  text: string
  speedMs?: number
}

export function TypewriterText({ text, speedMs = 90 }: TypewriterTextProps) {
  const { typed, announced } = useTypewriter(text, speedMs)

  return (
    <div className="max-w-md" aria-label={text}>
      <div className="grid">
        <p
          aria-hidden="true"
          className="invisible col-start-1 row-start-1 whitespace-pre-line text-3xl font-semibold leading-snug text-[var(--theme-text-primary)]"
        >
          {text}
        </p>
        <p
          aria-hidden="true"
          className="col-start-1 row-start-1 whitespace-pre-line text-3xl font-semibold leading-snug text-[var(--theme-text-primary)]"
        >
          {typed}
          <span className="animate-pulse text-teal-400">|</span>
        </p>
      </div>
      <span className="sr-only" aria-live="polite">
        {announced ? text : ''}
      </span>
    </div>
  )
}
