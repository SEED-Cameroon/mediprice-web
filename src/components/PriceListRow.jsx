import { Link } from "react-router-dom";
import { ChevronRight, FileText, MapPin } from "lucide-react";
import { formatFCFA, priceSummary } from "@/lib/format";
import { typicalPrice } from "@/lib/pricing";
import TrustBadge from "./TrustBadge";

/**
 * One search result: what the item is and what the price covers, the
 * lowest price against the typical price, and where the lowest price is.
 */
const PriceListRow = ({ item, showKind = false }) => {
  const { lowest, highest, count } = priceSummary(item.providers);
  const typical = typicalPrice(item.providers);
  const cheapest = item.providers.find((provider) => provider.price === lowest);
  const saving = typical !== null ? typical - lowest : 0;

  return (
    <li>
      <Link
        to={item.href}
        className="group block px-4 py-4 transition-colors hover:bg-surface-container-low focus:outline-none focus-visible:bg-surface-container-low focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-5 sm:py-5"
      >
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-base font-semibold text-on-surface group-hover:text-primary sm:text-lg">
                {item.name}
              </h3>
              {item.requiresPrescription && (
                <span className="inline-flex items-center gap-1 rounded-sm bg-surface-container px-1.5 py-0.5 text-xs font-medium text-on-surface-variant">
                  <FileText className="size-3.5" aria-hidden="true" />
                  Prescription needed
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-on-surface-variant">
              {showKind && <span className="text-on-surface">{item.kind}. </span>}
              Price for: {item.priceFor}
            </p>
          </div>

          <div className="shrink-0 text-right">
            {count > 0 ? (
              <>
                <p className="text-xs text-on-surface-variant">{count > 1 ? "Lowest" : "Price"}</p>
                <p className="tabular whitespace-nowrap text-lg font-bold leading-tight text-on-surface sm:text-xl">
                  {formatFCFA(lowest)}
                </p>
              </>
            ) : (
              <p className="text-sm text-on-surface-variant">No prices yet</p>
            )}
          </div>

          <ChevronRight
            className="mt-4 hidden size-5 shrink-0 text-outline transition-transform group-hover:translate-x-0.5 group-hover:text-primary sm:block"
            aria-hidden="true"
          />
        </div>

        {cheapest && (
          <div className="mt-3 flex flex-col gap-2 border-t border-outline-variant/60 pt-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pr-9">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="inline-flex min-w-0 items-center gap-1 text-on-surface">
                <MapPin className="size-4 shrink-0 text-outline" aria-hidden="true" />
                <span>
                  <span className="font-medium">{cheapest.name}</span>
                  {cheapest.area && <span className="text-on-surface-variant">, {cheapest.area}</span>}
                </span>
              </span>
              <TrustBadge status={cheapest.trust} size="sm" />
            </div>

            <p className="tabular shrink-0 text-on-surface-variant">
              {count > 1 ? (
                <>
                  {typical === null ? (
                    <span className="font-medium text-primary">
                      {formatFCFA(highest - lowest)} less than the other {count === 2 ? "provider" : "providers"}
                    </span>
                  ) : (
                    <>
                      {saving > 0 ? (
                        <span className="font-medium text-primary">{formatFCFA(saving)} below typical</span>
                      ) : (
                        "Typical price"
                      )}
                      <span>, {count} providers</span>
                    </>
                  )}
                </>
              ) : (
                "Only 1 provider so far"
              )}
            </p>
          </div>
        )}
      </Link>
    </li>
  );
};

export default PriceListRow;
