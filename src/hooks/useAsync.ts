import { useCallback, useEffect, useState } from 'react'

type AsyncState<T> =
  | { status: 'loading'; data?: T; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: T; error: string }

export interface AsyncResult<T> {
  data: T | undefined
  error: string | undefined
  /** True only while there is no data yet (first load or after an error). */
  isLoading: boolean
  /** True while any request is in flight, including background refreshes. */
  isFetching: boolean
  reload: () => void
}

/**
 * Runs an async loader and tracks loading / success / error state.
 * `loader` must be referentially stable (a module function or a useCallback).
 */
export function useAsync<T>(loader: () => Promise<T>): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    loader().then(
      (data) => {
        if (!cancelled) setState({ status: 'success', data })
      },
      (error: unknown) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Something went wrong.'
          setState({ status: 'error', error: message })
        }
      },
    )
    return () => {
      cancelled = true
    }
  }, [loader, version])

  const reload = useCallback(() => {
    setState((previous) => ({ status: 'loading', data: previous.data }))
    setVersion((current) => current + 1)
  }, [])

  return {
    data: state.data,
    error: state.error,
    isLoading: state.status === 'loading' && state.data === undefined,
    isFetching: state.status === 'loading',
    reload,
  }
}
