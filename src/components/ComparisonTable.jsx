import { Navigation } from "lucide-react";
import { formatFCFA } from "@/lib/format";
import { comparePrice, directionsUrl } from "@/lib/pricing";
import FairPriceTag from "./FairPriceTag";
import Freshness from "./Freshness";
import TrustBadge from "./TrustBadge";

/**
 * Provider-by-provider price comparison. Each row answers: how much, is
 * that fair, who verified it, how recently, and how to get there.
 * A real table on wide screens; each row becomes a stacked card on phones.
 */
const ComparisonTable = ({ providers = [], itemName, typical, lowest }) => {
  if (providers.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center"
        role="status"
      >
        <p className="font-semibold text-on-surface">No prices to show</p>
        <p className="mt-1 text-sm text-on-surface-variant">
          No provider matches this view. Show all prices to see the full list.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70">
      <table className="w-full border-collapse text-left max-md:block">
        <caption className="sr-only">Prices for {itemName} at each provider</caption>

        <thead className="border-b border-outline-variant bg-surface-container-low text-sm text-on-surface-variant max-md:hidden">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">Provider</th>
            <th scope="col" className="px-5 py-3 font-medium">Price</th>
            <th scope="col" className="px-5 py-3 font-medium">Verified by and when</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant max-md:block">
          {providers.map((provider, index) => {
            const isLowest = provider.price === lowest && providers.length > 1;
            const fair = comparePrice(provider.price, typical);

            return (
              <tr
                key={provider.id ?? index}
                className={`max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-4 max-md:gap-y-3 max-md:p-4 ${isLowest ? "bg-primary/5" : ""}`}
              >
                <th scope="row" className="w-[40%] px-5 py-4 align-top font-normal max-md:w-auto max-md:p-0">
                  {isLowest && (
                    <p className="mb-1 text-xs font-semibold text-primary">Cheapest option</p>
                  )}
                  <p className="font-semibold text-on-surface">{provider.name ?? "Unknown provider"}</p>
                  <p className="mt-0.5 text-sm text-on-surface-variant">
                    {[provider.type, provider.area].filter(Boolean).join(", ")}
                  </p>
                  <a
                    href={directionsUrl(provider)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md text-sm font-medium text-secondary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Navigation className="size-4" aria-hidden="true" />
                    Directions
                    <span className="sr-only"> to {provider.name} (opens Google Maps)</span>
                  </a>
                </th>

                <td className="px-5 py-4 align-top max-md:p-0 max-md:text-right">
                  <p className="tabular whitespace-nowrap text-xl font-bold text-on-surface">
                    {formatFCFA(provider.price)}
                  </p>
                  {typical !== null && (
                    <div className="mt-1">
                      <FairPriceTag level={fair.level} difference={fair.difference} />
                    </div>
                  )}
                </td>

                <td className="px-5 py-4 align-top max-md:col-span-2 max-md:p-0">
                  <span className="sr-only md:hidden">Verified by: </span>
                  <TrustBadge status={provider.trust} showSummary />
                  <div className="mt-2">
                    <Freshness date={provider.updatedAt} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
