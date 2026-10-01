const API_BASE_URL = import.meta.env.VITE_API_URL

/** True when no backend URL is configured, so the app runs on sample data. */
export const USE_SAMPLE_DATA = !API_BASE_URL

/** Requests that take longer than this are aborted. */
const TIMEOUT_MS = 10000

/**
 * Error thrown for any failed API call. `status` is the HTTP status
 * (0 for network errors and timeouts), and `message` is safe to show users.
 */
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Tiny fetch wrapper around the MediPrice API. This is the only place the
 * app talks to the backend. Every response is `{ success, data, message }`;
 * callers read `res.data`.
 * @param {string} path - endpoint path, e.g. "/medications"
 * @param {RequestInit} [options] - fetch options
 * @returns {Promise<{ success: boolean, data: any, message?: string }>}
 */
export async function apiFetch(path, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: options.signal ?? controller.signal,
    })
  } catch (error) {
    throw new ApiError(
      error.name === 'AbortError'
        ? 'The server took too long to answer. Check your connection and try again.'
        : 'We could not reach MediPrice. Check your internet connection and try again.',
    )
  } finally {
    clearTimeout(timer)
  }

  // The backend sends { success: false, message } on errors; show that message.
  let body = null
  try {
    body = await res.json()
  } catch {
    // Non-JSON response (e.g. a proxy error page).
  }

  if (!res.ok || body?.success === false) {
    throw new ApiError(
      body?.message || `Something went wrong on our side (error ${res.status}). Please try again.`,
      res.status,
    )
  }

  return body
}
