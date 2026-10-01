import { apiFetch, apiSend } from '@/lib/api'

/**
 * Sign-in and data-management calls for admins and providers. All of these
 * need the real backend; they are never served from sample data.
 */

// ---- Auth -----------------------------------------------------------------

export const signIn = (email, password) => apiSend('POST', '/auth/login', { email, password }).then((data) => data.user)
export const signOut = () => apiSend('POST', '/auth/logout')
export const getCurrentUser = () => apiFetch('/auth/me').then((res) => res.data)

// ---- Prices ---------------------------------------------------------------

/** Prices the signed-in user can manage (providers get only their own). */
export const listManagedPrices = (filters = {}) =>
  apiFetch(`/prices?${new URLSearchParams(filters)}`).then((res) => res.data)

/** Adds a price, or updates it if this provider already prices the item. */
export const savePrice = (values) => apiSend('POST', '/prices', values)
export const updatePrice = (id, values) => apiSend('PATCH', `/prices/${id}`, values)
export const deletePrice = (id) => apiSend('DELETE', `/prices/${id}`)
export const getPriceHistory = (id) => apiFetch(`/prices/${id}/history`).then((res) => res.data)

/** Checks (dryRun) or applies spreadsheet rows. */
export const importPrices = (rows, dryRun) => apiSend('POST', '/prices/import', { rows, dryRun })

// ---- Catalogue --------------------------------------------------------------

const collection = (path) => ({
  list: () => apiFetch(`${path}?limit=100`).then((res) => res.data),
  create: (values) => apiSend('POST', path, values),
  update: (id, values) => apiSend('PATCH', `${path}/${id}`, values),
  remove: (id) => apiSend('DELETE', `${path}/${id}`),
})

export const medicationsApi = collection('/medications')
export const servicesApi = collection('/services')
export const providersApi = collection('/providers')

// ---- Accounts ---------------------------------------------------------------

export const usersApi = {
  list: () => apiFetch('/users').then((res) => res.data),
  create: (values) => apiSend('POST', '/users', values),
  update: (id, values) => apiSend('PATCH', `/users/${id}`, values),
  remove: (id) => apiSend('DELETE', `/users/${id}`),
}
