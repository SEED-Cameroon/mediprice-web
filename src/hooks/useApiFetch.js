import { useCallback, useEffect, useState } from 'react'

/**
 * Runs an async loader and tracks its loading / error state, so every page
 * handles these the same way (SRS section 5).
 *
 * @template T
 * @param {() => Promise<T>} loader - call into src/services
 * @param {unknown[]} deps - re-run when these change
 * @returns {{ data: T | undefined, status: "loading" | "ready" | "error", error: Error | null, reload: () => void }}
 */
export default function useApiFetch(loader, deps = []) {
  const [state, setState] = useState({ data: undefined, status: 'loading', error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState((previous) => ({ ...previous, status: 'loading', error: null }))

    loader()
      .then((data) => {
        if (!cancelled) setState({ data, status: 'ready', error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ data: undefined, status: 'error', error })
      })

    return () => {
      cancelled = true
    }
    // The caller's deps decide when to re-run; the loader itself changes every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const reload = useCallback(() => setAttempt((count) => count + 1), [])

  return { ...state, reload }
}
