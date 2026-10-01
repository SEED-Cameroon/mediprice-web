import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  Check,
  FileText,
  FlaskConical,
  MapPin,
  Navigation,
  Pill,
  Stethoscope,
} from "lucide-react";
import { formatFCFA, formatFCFAExact, priceSummary } from "@/lib/format";
import { daysSince, directionsUrl, trustRank, typicalPrice } from "@/lib/pricing";
import useApiFetch from "@/hooks/useApiFetch";
import { listMedications, listServices } from "@/services/catalog";
import CompareButton from "./CompareButton";
import Freshness from "./Freshness";
import PriceListRow from "./PriceListRow";
import PriceSpread from "./PriceSpread";
import ProviderPriceList from "./ProviderPriceList";
import ReferencePrices from "./ReferencePrices";
import JsonLd from "./JsonLd";
import usePageMeta, { SITE_URL } from "@/hooks/usePageMeta";
import TrustBadge from "./TrustBadge";

const kindIcons = {
  Medication: Pill,
  "Lab test": FlaskConical,
  "Care service": Stethoscope,
};

const sortOptions = [
  { value: "price", label: "Cheapest first" },
  { value: "trust", label: "Most trusted first" },
  { value: "recent", label: "Most recently checked" },
];

const sorters = {
  price: (a, b) => a.price - b.price,
  trust: (a, b) => (trustRank[a.trust] ?? 9) - (trustRank[b.trust] ?? 9) || a.price - b.price,
  recent: (a, b) => (daysSince(a.updatedAt) ?? Infinity) - (daysSince(b.updatedAt) ?? Infinity),
};

/** Sorting only helps once there are enough prices to scan. */
const MIN_PRICES_FOR_SORT = 4;

/**
 * Detail page shared by medications and services. Answer first (where it's
 * cheapest and how to get there), then every price as a simple card.
 * Written and sized for everyone: plain words, 16px+ text, large buttons.
 */
const ItemDetail = ({ item, backTo, backLabel }) => {
  const [sort, setSort] = useState("price");
  const [checkedOnly, setCheckedOnly] = useState(false);

  const { lowest, highest, count } = priceSummary(item.providers);
  const typical = typicalPrice(item.providers);
  const cheapest = item.providers.find((provider) => provider.price === lowest);
  const unverifiedCount = item.providers.filter((p) => p.trust === "Community-reported").length;
  const KindIcon = kindIcons[item.kind] ?? Pill;

  const reference = item.referencePrices?.[0];
  usePageMeta({
    title: `${item.name} price in Bamenda`,
    description: cheapest
      ? `Cheapest: ${formatFCFA(lowest)} at ${cheapest.name}. Compare ${count} ${count === 1 ? "price" : "prices"} for ${item.name} (${item.priceFor.toLowerCase()}) from providers in Bamenda.`
      : reference
        ? `${item.name}: no Bamenda prices yet. Typical price in Cameroon: ${formatFCFAExact(reference.amount)} ${reference.unit} (${reference.year} survey).`
        : `${item.name}: what it is for, and what providers in Bamenda charge for it.`,
  });

  const listPath = item.group === "medication" ? "/medications" : "/labs-services";
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: item.group === "medication" ? "Medicines" : "Tests & services", item: `${SITE_URL}${listPath}` },
      { "@type": "ListItem", position: 3, name: item.name, item: `${SITE_URL}${item.href}` },
    ],
  };

  const rows = item.providers
    .filter((provider) => !checkedOnly || provider.trust !== "Community-reported")
    .sort(sorters[sort]);

  // Same category first, then others of the same group (medications vs services).
  const isMedication = item.group === "medication";
  const { data: groupItems = [] } = useApiFetch(
    () => (isMedication ? listMedications() : listServices()),
    [isMedication],
  );
  const sameGroup = groupItems.filter((other) => other.key !== item.key);
  const related = [
    ...sameGroup.filter((other) => other.category === item.category),
    ...sameGroup.filter((other) => other.category !== item.category),
  ].slice(0, 3);

  const tips = [
    item.requiresPrescription && "Bring your prescription. You need it to buy this medicine.",
    `These prices are for ${item.priceFor.toLowerCase()}. Make sure you are quoted for the same.`,
    "Prices can change. Ask for the price before you pay.",
    isMedication && "Ask if there is a cheaper brand of the same medicine.",
  ].filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6 sm:pt-8">
      <JsonLd data={breadcrumbs} />
      <Link
        to={backTo}
        className="inline-flex h-11 items-center gap-2 rounded-lg text-base font-medium text-on-surface-variant hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="mt-3 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div className="min-w-0">
          {/* What it is */}
          <header className="flex gap-4">
            <span
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-16"
              aria-hidden="true"
            >
              <KindIcon className="size-7 sm:size-8" />
            </span>
            <div className="min-w-0">
              <p className="text-base text-on-surface-variant">
                {item.kind}, {item.category.toLowerCase()}
              </p>
              <h1 className="mt-0.5 break-words text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
                {/* Allow long names like "Artemether/Lumefantrine" to wrap after the slash. */}
                {item.name.replace(/\//g, "/​")}
              </h1>
            </div>
          </header>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-lg bg-surface-container px-3 py-1.5 text-base text-on-surface">
              Price is for:{" "}<strong className="font-semibold">{item.priceFor}</strong>
            </span>
            {item.requiresPrescription && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-tertiary/10 px-3 py-1.5 text-base font-semibold text-tertiary">
                <FileText className="size-5" aria-hidden="true" />
                Prescription needed
              </span>
            )}
          </div>

          {item.description && (
            <p className="mt-4 max-w-[40rem] text-lg leading-8 text-on-surface-variant">
              {item.description}
            </p>
          )}

          {/* The answer */}
          {cheapest && (
            <section
              aria-labelledby="answer-heading"
              className="mt-8 rounded-3xl bg-primary/[0.06] p-5 ring-2 ring-primary sm:p-7"
            >
              <h2 id="answer-heading" className="text-base font-bold text-primary">
                {count > 1 ? "Cheapest place we found" : "The only price we have so far"}
              </h2>

              <p className="tabular mt-2 text-4xl font-extrabold tracking-tight text-on-surface sm:text-5xl">
                {formatFCFA(lowest)}
              </p>

              <p className="mt-3 text-xl font-bold text-on-surface">
                <Link
                  to={`/providers/${cheapest.providerId}`}
                  className="underline-offset-4 hover:text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {cheapest.name}
                </Link>
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-base text-on-surface-variant">
                <MapPin className="size-5 shrink-0" aria-hidden="true" />
                {[cheapest.type, cheapest.area].filter(Boolean).join(", ")}
              </p>

              <div className="mt-4 flex flex-col items-start gap-2">
                <TrustBadge status={cheapest.trust} showSummary />
                <Freshness date={cheapest.updatedAt} className="text-base" />
              </div>

              {count > 1 && (
                <ul className="mt-5 space-y-2 border-t border-primary/20 pt-4 text-lg text-on-surface">
                  <li className="flex gap-2.5">
                    <Check className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      You save <strong className="tabular font-bold">{formatFCFA(highest - lowest)}</strong>{" "}
                      compared with the most expensive place.
                    </span>
                  </li>
                  {typical !== null && (
                    <li className="flex gap-2.5">
                      <Check className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                      <span>
                        The usual price in Bamenda is{" "}
                        <strong className="tabular font-bold">{formatFCFA(typical)}</strong>.
                      </span>
                    </li>
                  )}
                </ul>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={directionsUrl(cheapest)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-lg font-bold text-on-primary shadow-sm transition-colors hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                >
                  <Navigation className="size-5" aria-hidden="true" />
                  Get directions
                  <span className="sr-only"> to {cheapest.name} (opens Google Maps)</span>
                </a>
                <CompareButton item={item} />
                {count > 1 && (
                  <a
                    href="#all-prices"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-surface-container-lowest px-6 text-lg font-semibold text-on-surface ring-1 ring-outline-variant transition-colors hover:ring-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ArrowDown className="size-5" aria-hidden="true" />
                    See all {count} prices
                  </a>
                )}
              </div>
            </section>
          )}

          {/* No provider prices yet: say so plainly, and show published prices if any */}
          {!cheapest && (
            <div className="mt-8 space-y-5">
              <section className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-5 sm:p-6">
                <h2 className="text-xl font-bold text-on-surface">No Bamenda prices yet</h2>
                <p className="mt-2 text-base leading-7 text-on-surface-variant">
                  We haven't collected what pharmacies, labs or hospitals in Bamenda charge for this yet. Ask the
                  provider for the price before you pay.
                </p>
              </section>
              <ReferencePrices references={item.referencePrices} />
            </div>
          )}

          {/* Every price */}
          {count > 0 && (
          <section id="all-prices" aria-labelledby="all-prices-heading" className="mt-12 scroll-mt-24">
            <h2 id="all-prices-heading" className="text-2xl font-bold tracking-tight text-on-surface">
              All prices ({count})
            </h2>
            <p className="mt-1 text-base text-on-surface-variant">
              {sort === "price" ? "Cheapest first." : sortOptions.find((o) => o.value === sort).label + "."}
            </p>

            {count >= 3 && (
              <div className="mt-5 rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/70">
                <p className="mb-3 text-base font-semibold text-on-surface">How the prices compare</p>
                <PriceSpread providers={item.providers} size="lg" />
              </div>
            )}

            {(count >= MIN_PRICES_FOR_SORT || unverifiedCount > 0) && (
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                {count >= MIN_PRICES_FOR_SORT && (
                  <label className="flex items-center gap-2 text-base text-on-surface">
                    Show
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      className="h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-base font-medium text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {unverifiedCount > 0 && (
                  <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-base text-on-surface">
                    <input
                      type="checkbox"
                      checked={checkedOnly}
                      onChange={(event) => setCheckedOnly(event.target.checked)}
                      className="size-5 accent-primary"
                    />
                    Only show checked prices
                  </label>
                )}
              </div>
            )}

            <div className="mt-5">
              <ProviderPriceList providers={rows} itemName={item.name} lowest={lowest} />
            </div>
          </section>
          )}
        </div>

        {/* Tips */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {cheapest && <ReferencePrices references={item.referencePrices} compact />}
          <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/70 sm:p-6">
            <h2 className="text-xl font-bold text-on-surface">Before you go</h2>
            <ul className="mt-4 space-y-4">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-3 text-base leading-7 text-on-surface">
                  <span
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
            <Link
              to="/about#badges"
              className="mt-5 inline-flex min-h-11 items-center text-base font-semibold text-primary underline underline-offset-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              How do we check prices?
            </Link>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-14 border-t border-outline-variant pt-10">
          <h2 id="related-heading" className="text-2xl font-bold text-on-surface">
            Other {isMedication ? "medicines" : "tests and services"}
          </h2>
          <ul className="mt-5 divide-y divide-outline-variant overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70">
            {related.map((other) => (
              <PriceListRow key={other.key} item={other} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

/** Placeholder shown while an item loads. */
export const ItemDetailSkeleton = () => (
  <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading prices">
    <div className="flex gap-4">
      <div className="size-16 animate-pulse rounded-2xl bg-surface-container" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-40 animate-pulse rounded bg-surface-container" />
        <div className="h-9 w-2/3 animate-pulse rounded-lg bg-surface-container" />
      </div>
    </div>
    <div className="mt-10 h-72 max-w-3xl animate-pulse rounded-3xl bg-surface-container" />
  </div>
);

/** Shown when an item fails to load for a reason other than "not found". */
export const ItemDetailError = ({ message, onRetry }) => (
  <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
    <div className="max-w-3xl rounded-2xl bg-error-container p-6" role="alert">
      <p className="text-lg font-semibold text-on-error-container">Prices couldn't be loaded</p>
      <p className="mt-1 text-base text-on-error-container">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 h-12 rounded-xl bg-primary px-6 text-lg font-semibold text-on-primary hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
      >
        Try again
      </button>
    </div>
  </div>
);

export default ItemDetail;
