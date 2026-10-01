const fcfa = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

const shortDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/**
 * Formats a number as FCFA with thousands separators, e.g. 2000 → "2,000 FCFA".
 * @param {number | null | undefined} amount
 * @returns {string}
 */
export function formatFCFA(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return 'Price unavailable'
  }

  return `${fcfa.format(amount)} FCFA`
}

/**
 * Formats a number without the currency suffix, e.g. 2000 → "2,000".
 * @param {number} amount
 * @returns {string}
 */
export function formatAmount(amount) {
  return fcfa.format(amount)
}

/**
 * Formats an ISO date string for display, e.g. "2026-09-28" → "28 Sep 2026".
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return 'Not recorded'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : shortDate.format(date)
}

/**
 * Summarises an item's provider prices.
 * @param {{ price: number }[]} providers
 * @returns {{ lowest: number | null, highest: number | null, count: number }}
 */
export function priceSummary(providers = []) {
  const prices = providers
    .map((provider) => provider.price)
    .filter((price) => typeof price === 'number')

  if (prices.length === 0) {
    return { lowest: null, highest: null, count: 0 }
  }

  return {
    lowest: Math.min(...prices),
    highest: Math.max(...prices),
    count: prices.length,
  }
}

const fcfaExact = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

/**
 * Formats a published price exactly as reported, keeping decimals,
 * e.g. 116.83 → "116.83 FCFA" (prices at providers are whole FCFA).
 * @param {number} amount
 */
export function formatFCFAExact(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return 'Price unavailable'
  return `${fcfaExact.format(amount)} FCFA`
}
