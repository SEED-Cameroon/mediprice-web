import { ApiError, USE_SAMPLE_DATA, apiFetch } from '@/lib/api'

/**
 * Data access for medications, services, providers and comparisons.
 *
 * Pages never import data or call fetch directly; they call these
 * functions (through useApiFetch), which call mediprice-api and normalise its
 * response into the shape pages use. Only with VITE_USE_SAMPLE_DATA=true do
 * they resolve bundled sample data instead (for working without a backend).
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

// mediprice-api provider types -> the labels shown to people.
const PROVIDER_TYPES = { pharmacy: 'Pharmacy', lab: 'Laboratory', hospital: 'Hospital' }

// Matches mediprice-api: a price row has `amount`, `trustBadge`, `updatedAt`
// and `providerId` populated with { _id, name, type, quarter, phone, location }.
// Sample data uses flat rows ({ name, type, area, price, trust }). Adjust here,
// and only here, if the API changes.
function normalisePrice(raw, index) {
  // A populated provider object carries its own id. On a flat sample row,
  // `id` is the price row's id, not the provider's, so it's never used.
  const populated = raw.providerId && typeof raw.providerId === 'object' ? raw.providerId : null
  const provider = populated ?? raw
  const name = provider.name ?? 'Unknown provider'

  return {
    id: raw._id ?? raw.id ?? index,
    providerId: String(populated?._id ?? slugify(name)),
    name,
    type: PROVIDER_TYPES[provider.type] ?? provider.type,
    area: provider.quarter ?? provider.area,
    phone: provider.phone,
    location: provider.location?.lat != null ? provider.location : undefined,
    price: Number(raw.amount ?? raw.price),
    trust: normaliseTrust(raw.trustBadge ?? raw.trust),
    updatedAt: raw.updatedAt,
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
    // Published survey prices for Cameroon: context, not a provider's price.
    referencePrices: (raw.referencePrices ?? []).map((ref) => ({
      amount: Number(ref.amount),
      unit: ref.unit,
      sector: ref.sector,
      region: ref.region,
      year: ref.year,
      note: ref.note,
      sourceTitle: ref.sourceTitle,
      sourceUrl: ref.sourceUrl,
    })),
  }
}

// ---------------------------------------------------------------------------
// Sample-data mode
// ---------------------------------------------------------------------------

const SAMPLE_DELAY_MS = 250
const sample = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), SAMPLE_DELAY_MS))

// Loaded on demand, and only in sample mode. The check on import.meta.env is
// resolved at build time, so real builds don't contain the sample data at all.
const loadSampleData =
  import.meta.env.VITE_USE_SAMPLE_DATA === 'true'
    ? () => Promise.all([import('../data/Medications'), import('../data/services')])
    : () => Promise.reject(new ApiError('Sample data is not included in this build.'))

let samplePromise
const sampleItems = () => {
  samplePromise ??= loadSampleData().then(
    ([medications, services]) => ({
      medication: medications.default.map((raw) => normaliseItem(raw, 'medication')),
      service: services.default.map((raw) => normaliseItem(raw, 'service')),
    }),
  )
  return samplePromise
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

// The API pages lists (max 100 per page). The catalogue is small, so pages
// fetch one full page and filter on the client.
// TODO: follow `pagination.totalPages` once the catalogue grows past 100 items.
const LIST_LIMIT = 100
const listQuery = (search) =>
  new URLSearchParams({ limit: String(LIST_LIMIT), ...(search ? { q: search } : {}) }).toString()

/** GET /api/medications?q= */
export async function listMedications({ search } = {}) {
  if (USE_SAMPLE_DATA) return sample((await sampleItems()).medication.filter((item) => matches(item, search)))
  const res = await apiFetch(`/medications?${listQuery(search)}`)
  return res.data.map((raw) => normaliseItem(raw, 'medication'))
}

/** GET /api/services?q= */
export async function listServices({ search } = {}) {
  if (USE_SAMPLE_DATA) return sample((await sampleItems()).service.filter((item) => matches(item, search)))
  const res = await apiFetch(`/services?${listQuery(search)}`)
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
    const item = (await sampleItems()).medication.find((entry) => entry.id === String(id))
    if (!item) throw notFound('medication')
    return sample(item)
  }
  const res = await apiFetch(`/medications/${encodeURIComponent(id)}`)
  return normaliseItem(res.data, 'medication')
}

/** GET /api/services/:id */
export async function getService(id) {
  if (USE_SAMPLE_DATA) {
    const item = (await sampleItems()).service.find((entry) => entry.id === String(id))
    if (!item) throw notFound('test or service')
    return sample(item)
  }
  const res = await apiFetch(`/services/${encodeURIComponent(id)}`)
  return normaliseItem(res.data, 'service')
}

/**
 * Items to compare side by side. Invalid ids are dropped silently (SRS 4.5).
 * Uses GET /api/compare against the real API; sample mode looks each id up.
 * @param {{ group: "medication" | "service", ids: string[] }} params
 * @returns {Promise<object[]>}
 */
export async function getComparison({ group, ids }) {
  if (!USE_SAMPLE_DATA) {
    // GET /api/compare drops unknown ids itself: one request per comparison.
    const res = await apiFetch(`/compare?${new URLSearchParams({ itemType: group, ids: ids.join(',') })}`)
    const byId = new Map(res.data.map((raw) => [String(raw._id), normaliseItem(raw, group)]))
    return ids.map((id) => byId.get(id)).filter(Boolean)
  }

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
        phone: price.phone,
        location: price.location,
        prices: [],
      }
      entry.prices.push({ item, price })
      byId.set(price.providerId, entry)
    }),
  )
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/** Provider record from the API -> the shape pages use. */
const normaliseProvider = (raw) => ({
  id: String(raw._id),
  name: raw.name,
  type: PROVIDER_TYPES[raw.type] ?? raw.type,
  area: raw.quarter,
  address: raw.address,
  city: raw.city,
  phone: raw.phone,
  location: raw.location?.lat != null ? raw.location : undefined,
  prices: [],
})

/** Every provider, including ones with no prices yet. */
export async function listProviders() {
  if (USE_SAMPLE_DATA) return providersFrom(await listAll())
  const [res, items] = await Promise.all([apiFetch('/providers'), listAll()])
  const priced = new Map(providersFrom(items).map((provider) => [provider.id, provider]))
  return res.data
    .map((raw) => ({ ...normaliseProvider(raw), prices: priced.get(String(raw._id))?.prices ?? [] }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * GET /api/providers/:id for the provider's details, plus its prices from the
 * item lists (which carry every provider's price, needed for "cheapest").
 */
export async function getProvider(id) {
  if (USE_SAMPLE_DATA) {
    const provider = providersFrom(await listAll()).find((entry) => entry.id === String(id))
    if (!provider) throw notFound('provider')
    return provider
  }
  const [res, items] = await Promise.all([apiFetch(`/providers/${encodeURIComponent(id)}`), listAll()])
  const priced = providersFrom(items).find((entry) => entry.id === String(id))
  return { ...normaliseProvider(res.data.provider), prices: priced?.prices ?? [] }
}
