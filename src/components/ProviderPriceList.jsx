import { Link } from "react-router-dom";
import { CircleCheck, MapPin, Navigation } from "lucide-react";
import { formatFCFA } from "@/lib/format";
import { directionsUrl } from "@/lib/pricing";
import Freshness from "./Freshness";
import TrustBadge from "./TrustBadge";

/**
 * Every provider's price as a simple card, so it reads the same on any
 * screen. Each card says, in words, how it compares with the cheapest.
 */
const ProviderPriceList = ({ providers = [], itemName, lowest }) => {
  if (providers.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-6 text-center"
        role="status"
      >
        <p className="text-lg font-semibold text-on-surface">No prices to show</p>
        <p className="mt-1 text-base text-on-surface-variant">
          Untick “Only show checked prices” to see every price.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-4" aria-label={`Prices for ${itemName}`}>
      {providers.map((provider, index) => {
        const isCheapest = provider.price === lowest;
        const extra = provider.price - lowest;

        return (
          <li
            key={provider.id ?? index}
            className={`rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 sm:p-6 ${
              isCheapest && providers.length > 1 ? "ring-2 ring-primary" : "ring-outline-variant/70"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
              <div className="min-w-0">
                <h3 className="text-lg font-bold leading-snug text-on-surface sm:text-xl">
                  <Link
                    to={`/providers/${provider.providerId}`}
                    className="underline-offset-4 hover:text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {provider.name ?? "Unknown provider"}
                  </Link>
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-base text-on-surface-variant">
                  <MapPin className="size-4 shrink-0" aria-hidden="true" />
                  {[provider.type, provider.area].filter(Boolean).join(", ")}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="tabular text-2xl font-extrabold tracking-tight text-on-surface">
                  {formatFCFA(provider.price)}
                </p>
                {providers.length > 1 &&
                  (isCheapest ? (
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-base font-semibold text-primary">
                      <CircleCheck className="size-5" aria-hidden="true" />
                      Cheapest
                    </p>
                  ) : (
                    <p className="tabular mt-0.5 text-base font-medium text-on-surface-variant">
                      {formatFCFA(extra)} more than the cheapest
                    </p>
                  ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-outline-variant/60 pt-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-2">
                <TrustBadge status={provider.trust} showSummary />
                <Freshness date={provider.updatedAt} className="text-base" />
              </div>

              <a
                href={directionsUrl(provider)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold text-on-surface ring-1 ring-outline-variant transition-colors hover:bg-surface-container-low hover:ring-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Navigation className="size-5" aria-hidden="true" />
                Directions
                <span className="sr-only"> to {provider.name} (opens Google Maps)</span>
              </a>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default ProviderPriceList;
