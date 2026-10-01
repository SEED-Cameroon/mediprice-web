/**
 * Pricing helpers that turn raw provider prices into the judgements a
 * patient actually needs: what's typical, whether a price is fair, and
 * whether it is recent enough to trust.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Prices older than this are flagged as possibly out of date. */
export const STALE_AFTER_DAYS = 30;

/** A typical price needs at least this many prices to mean anything. */
export const MIN_PRICES_FOR_TYPICAL = 3;

/**
 * Median of the providers' prices: the "typical" price for an item.
 * Returns null with fewer than MIN_PRICES_FOR_TYPICAL prices, because the
 * middle of two prices is just their average and says little about "normal".
 * @param {{ price: number }[]} providers
 * @returns {number | null}
 */
export function typicalPrice(providers = []) {
  const prices = providers
    .map((provider) => provider.price)
    .filter((price) => typeof price === "number")
    .sort((a, b) => a - b);

  if (prices.length < MIN_PRICES_FOR_TYPICAL) return null;

  const middle = Math.floor(prices.length / 2);
  const median =
    prices.length % 2 === 0 ? (prices[middle - 1] + prices[middle]) / 2 : prices[middle];

  // Round to the nearest 50 FCFA so the typical price reads like a real price.
  return Math.round(median / 50) * 50;
}

/**
 * Compares one price against the typical price.
 * Within ±5% counts as typical.
 * @param {number} price
 * @param {number | null} typical
 * @returns {{ level: "below" | "typical" | "above", difference: number }}
 */
export function comparePrice(price, typical) {
  if (typical === null || typical === 0) return { level: "typical", difference: 0 };

  const difference = price - typical;
  const ratio = difference / typical;

  if (ratio <= -0.05) return { level: "below", difference };
  if (ratio >= 0.05) return { level: "above", difference };
  return { level: "typical", difference };
}

/**
 * How long ago a price was checked, in whole days.
 * @param {string} isoDate
 * @param {Date} [now]
 * @returns {number | null}
 */
export function daysSince(isoDate, now = new Date()) {
  if (!isoDate) return null;
  const then = new Date(isoDate);
  if (Number.isNaN(then.getTime())) return null;

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThen = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  return Math.max(0, Math.round((startOfToday - startOfThen) / DAY_MS));
}

/**
 * Human wording for how recently a price was checked.
 * @param {string} isoDate
 * @returns {{ label: string, stale: boolean }}
 */
export function freshness(isoDate) {
  const days = daysSince(isoDate);

  if (days === null) return { label: "Date not recorded", stale: true };
  if (days === 0) return { label: "Checked today", stale: false };
  if (days === 1) return { label: "Checked yesterday", stale: false };
  if (days < 14) return { label: `Checked ${days} days ago`, stale: false };
  if (days < 60) {
    const weeks = Math.round(days / 7);
    return { label: `Checked ${weeks} weeks ago`, stale: days > STALE_AFTER_DAYS };
  }

  const months = Math.round(days / 30);
  return { label: `Checked ${months} months ago`, stale: true };
}

/** Trust levels ranked from most to least reliable, for sorting. */
export const trustRank = {
  "SEED-verified": 0,
  "Provider-verified": 1,
  "Community-reported": 2,
};

/**
 * Google Maps search link for a provider. Uses the name and area only, so it
 * works without stored coordinates.
 * @param {{ name: string, area?: string }} provider
 */
export function directionsUrl(provider) {
  // Exact directions when the API has the provider's coordinates.
  if (provider.location?.lat != null && provider.location?.lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${provider.location.lat},${provider.location.lng}`;
  }
  const query = [provider.name, provider.area, "Bamenda, Cameroon"].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
