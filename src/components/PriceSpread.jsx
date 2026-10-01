import { formatAmount, formatFCFA, priceSummary } from "@/lib/format";
import { typicalPrice } from "@/lib/pricing";
import { getTrustLevel } from "@/lib/trust";

/**
 * Plots every provider's price for one item on a single line, with a tick
 * for the typical price, so the cheapest option and how far prices spread
 * are visible at a glance. Markers are colored by trust level.
 */
const PriceSpread = ({ providers = [], size = "md", showTypical = true }) => {
  const { lowest, highest, count } = priceSummary(providers);

  if (count === 0) return null;

  const typical = typicalPrice(providers);
  const range = highest - lowest;

  // Keep markers inside the track: map prices onto 4%–96%.
  const position = (price) => (range === 0 ? 50 : 4 + ((price - lowest) / range) * 92);

  const sorted = [...providers].sort((a, b) => a.price - b.price);
  const marker = size === "lg" ? "size-4" : "size-3";
  const track = size === "lg" ? "h-2.5" : "h-2";
  const hasTypical = showTypical && typical !== null;
  const typicalAt = hasTypical ? position(typical) : 0;

  return (
    <figure className="w-full">
      <div className={`relative ${hasTypical ? "pt-7" : ""}`}>
        {hasTypical && (
          <div
            aria-hidden="true"
            className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-on-surface"
            style={{ left: `${Math.min(Math.max(typicalAt, 12), 88)}%` }}
          >
            Typical {formatAmount(typical)}
          </div>
        )}

        <div
          role="img"
          aria-label={
            count === 1
              ? `One price reported: ${formatFCFA(lowest)}`
              : `Prices range from ${formatFCFA(lowest)} to ${formatFCFA(highest)} across ${count} providers.${typical !== null ? ` Typical price ${formatFCFA(typical)}.` : ""}`
          }
          className={`relative rounded-full bg-surface-container-high ${track}`}
        >
          {hasTypical && (
            <span
              aria-hidden="true"
              className="absolute -top-2 bottom-[-0.5rem] w-0.5 -translate-x-1/2 rounded-full bg-on-surface/70"
              style={{ left: `${typicalAt}%` }}
            />
          )}

          {sorted.map((provider, index) => (
            <span
              key={provider.id ?? index}
              aria-hidden="true"
              title={`${provider.name}: ${formatFCFA(provider.price)}`}
              className={`spread-marker absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface-container-lowest ${marker} ${getTrustLevel(provider.trust).dot}`}
              style={{ left: `${position(provider.price)}%`, animationDelay: `${index * 70}ms` }}
            />
          ))}
        </div>
      </div>

      {count > 1 && (
        <figcaption
          aria-hidden="true"
          className="tabular mt-3 flex justify-between text-xs text-on-surface-variant"
        >
          <span>Lowest {formatAmount(lowest)}</span>
          <span>Highest {formatAmount(highest)}</span>
        </figcaption>
      )}
    </figure>
  );
};

export default PriceSpread;
