const API_BASE_URL = import.meta.env.VITE_API_URL

/**
 * Tiny fetch wrapper around the MediPrice API.
 * @param {string} path - endpoint path, e.g. "/medications"
 * @param {RequestInit} [options] - fetch options
 * @returns {Promise<any>} parsed JSON response
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
