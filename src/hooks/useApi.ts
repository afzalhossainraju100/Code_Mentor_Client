import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'

type Settled<T> = { key: string | null; data: T | null; error: string | null }

/**
 * Loads JSON from the API. Pass null to skip. Call reload() to fetch again.
 * While a new request is in flight, the previous data stays available (no flicker).
 */
export function useApi<T>(path: string | null) {
  const [version, setVersion] = useState(0)
  const [settled, setSettled] = useState<Settled<T>>({ key: null, data: null, error: null })
  const key = path ? `${path}#${version}` : null

  useEffect(() => {
    if (!path) return
    const requestKey = `${path}#${version}`
    let cancelled = false
    apiFetch<T>(path)
      .then((data) => {
        if (!cancelled) setSettled({ key: requestKey, data, error: null })
      })
      .catch((error: Error) => {
        if (!cancelled) setSettled({ key: requestKey, data: null, error: error.message })
      })
    return () => {
      cancelled = true
    }
  }, [path, version])

  const reload = useCallback(() => setVersion((value) => value + 1), [])
  const loading = key !== null && settled.key !== key

  return { data: settled.data, error: loading ? null : settled.error, loading, reload }
}
