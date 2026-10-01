import { ApiError, USE_SAMPLE_DATA, apiFetch } from '@/lib/api'
import sampleMedications from '../data/Medications'
import sampleServices from '../data/services'

/**
 * Data access for medications, services, providers and comparisons.
 *
 * Pages never import data or call fetch directly; they call these
 * functions (through useApiFetch). With no VITE_API_URL set, they resolve
 * sample data after a short delay so loading states behave like the real
 * thing. With VITE_API_URL set, they call the backend and normalise its
 * response into the same shape, so pages don't change when the API is wired.
 */

// ---------------------------------------------------------------------------
// Normalisation: backend (or sample) record -> the shape pages use
// ---------------------------------------------------------------------------

const TRUST_KEYS = {
  'seed-verified': 'SEED-verified',
  'provider-verified': 'Provider-verified',
  'community-reported': 'Community-reported',
}

const normaliseTrust = (value = '') =>
  TRUST_KEYS[String(value).toLowerCase().replace(/[_\s]+/g, '-')] ?? value

/** Stable URL-safe id from a provider name, used when the API gives none. */
export const slugify = (text = '') =>
  text
    .toLowerCase()
    .replace(/['’.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// ASSUMPTION: field names below follow the backend SRS draft (Mongo `_id`,
// `prices[]` with a populated `provider`). Adjust here, and only here, if the
// real API differs.
function normalisePrice(raw, index) {
  // A populated `provider` object carries its own id. On a flat row, `id` is
  // the price row's id, not the provider's, so only use an explicit providerId.
  const populated = raw.provider && typeof raw.provider === 'object'
  const provider = populated ? raw.provider : raw
  const name = provider.name ?? raw.providerName ?? 'Unknown provider'
  const providerId = populated ? provider._id ?? provider.id : raw.providerId

  return {
    id: raw._id ?? raw.id ?? index,
    providerId: String(providerId ?? slugify(name)),
    name,
    type: provider.type ?? raw.type,
    area: provider.area ?? provider.quarter ?? raw.area,
    price: Number(raw.price ?? raw.amount),
    trust: normaliseTrust(raw.trust ?? raw.trustLevel ?? raw.badge),
    updatedAt: raw.updatedAt ?? raw.lastUpdated ?? raw.checkedAt,
  }
}

const KIND_BY_TYPE = { lab: 'Lab test', care: 'Care service' }

function normaliseItem(raw, group) {
  const id = String(raw._id ?? raw.id)
  const isMedication = group === 'medication'
  const kind = isMedication ? 'Medication' : KIND_BY_TYPE[String(raw.type).toLowerCase()] ?? 'Lab test'

  return {
    id,
    group,
    key: `${group}-${id}`,
    kind,
    href: isMedication ? `/medications/${id}` : `/labs-services/${id}`,
    name: raw.name,
    category: raw.category ?? 'Other',
    description: raw.description,
    priceFor: raw.priceFor ?? raw.form ?? raw.unit ?? (kind === 'Care service' ? 'One visit' : 'One test'),
    requiresPrescription: Boolean(raw.requiresPrescription ?? raw.prescriptionRequired),
    providers: (raw.prices ?? raw.providers ?? []).map(normalisePrice).filter((p) => !Number.isNaN(p.price)),
  }
}

// ---------------------------------------------------------------------------
// Sample-data mode
// ---------------------------------------------------------------------------

const SAMPLE_DELAY_MS = 250
const sample = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), SAMPLE_DELAY_MS))

const sampleItems = {
  medication: sampleMedications.map((raw) => normaliseItem(raw, 'medication')),
  service: sampleServices.map((raw) => normaliseItem(raw, 'service')),
}

const matches = (item, search) => {
  const term = search?.trim().toLowerCase()
  if (!term) return true
  return [item.name, item.category, item.description, item.kind]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(term))
}

const notFound = (what) => new ApiError(`We couldn't find that ${what}.`, 404)

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** GET /api/medications?q= */
export async function listMedications({ search } = {}) {
  if (USE_SAMPLE_DATA) return sample(sampleItems.medication.filter((item) => matches(item, search)))
  const res = await apiFetch(`/medications${search ? `?q=${encodeURIComponent(search)}` : ''}`)
  return res.data.map((raw) => normaliseItem(raw, 'medication'))
}

/** GET /api/services?q= */
export async function listServices({ search } = {}) {
  if (USE_SAMPLE_DATA) return sample(sampleItems.service.filter((item) => matches(item, search)))
  const res = await apiFetch(`/services${search ? `?q=${encodeURIComponent(search)}` : ''}`)
  return res.data.map((raw) => normaliseItem(raw, 'service'))
}

/**
 * Medications and services together. The backend has no unified search yet
 * (SRS section 7), so this fires both requests and merges them.
 */
export async function listAll(options) {
  const [medications, services] = await Promise.all([listMedications(options), listServices(options)])
  return [...medications, ...services]
}

/** GET /api/medications/:id */
export async function getMedication(id) {
  if (USE_SAMPLE_DATA) {
    const item = sampleItems.medication.find((entry) => entry.id === String(id))
    if (!item) throw notFound('medication')
    return sample(item)
  }
  const res = await apiFetch(`/medications/${encodeURIComponent(id)}`)
  return normaliseItem(res.data, 'medication')
}

/** GET /api/services/:id */
export async function getService(id) {
  if (USE_SAMPLE_DATA) {
    const item = sampleItems.service.find((entry) => entry.id === String(id))
    if (!item) throw notFound('test or service')
    return sample(item)
  }
  const res = await apiFetch(`/services/${encodeURIComponent(id)}`)
  return normaliseItem(res.data, 'service')
}

/**
 * Items to compare side by side. Invalid ids are dropped silently (SRS 4.5).
 * Until GET /api/compare is confirmed (SRS open question 3), this falls back
 * to one detail request per id.
 * @param {{ group: "medication" | "service", ids: string[] }} params
 * @returns {Promise<object[]>}
 */
export async function getComparison({ group, ids }) {
  const getOne = group === 'medication' ? getMedication : getService
  const results = await Promise.allSettled(ids.map((id) => getOne(id)))

  // A real outage should surface as an error, not as "nothing to compare".
  const outage = results.find((r) => r.status === 'rejected' && r.reason?.status !== 404)
  if (outage && results.every((r) => r.status === 'rejected')) throw outage.reason

  return results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
}

/** Groups every price by provider. Used until GET /api/providers exists. */
export function providersFrom(items) {
  const byId = new Map()
  items.forEach((item) =>
    item.providers.forEach((price) => {
      const entry = byId.get(price.providerId) ?? {
        id: price.providerId,
        name: price.name,
        type: price.type,
        area: price.area,
        prices: [],
      }
      entry.prices.push({ item, price })
      byId.set(price.providerId, entry)
    }),
  )
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/** Every provider we have prices for. */
export async function listProviders() {
  return providersFrom(await listAll())
}

/**
 * GET /api/providers/:id (SRS Phase 2). Falls back to building the provider
 * from the item lists until that endpoint exists.
 */
export async function getProvider(id) {
  const provider = (await listProviders()).find((entry) => entry.id === String(id))
  if (!provider) throw notFound('provider')
  return provider
}
