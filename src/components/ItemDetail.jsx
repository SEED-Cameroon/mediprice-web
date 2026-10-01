import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, FileText } from "lucide-react";
import { formatAmount, formatFCFA, priceSummary } from "@/lib/format";
import { daysSince, freshness, trustRank, typicalPrice } from "@/lib/pricing";
import catalog from "../data/catalog";
import images from "../data/images";
import ComparisonTable from "./ComparisonTable";
import PriceListRow from "./PriceListRow";
import PriceSpread from "./PriceSpread";
import { trustLevels } from "./TrustBadge";

const sortOptions = [
  { value: "price", label: "Cheapest" },
  { value: "trust", label: "Most trusted" },
  { value: "recent", label: "Latest check" },
];

const sorters = {
  price: (a, b) => a.price - b.price,
  trust: (a, b) => (trustRank[a.trust] ?? 9) - (trustRank[b.trust] ?? 9) || a.price - b.price,
  recent: (a, b) => (daysSince(a.updatedAt) ?? Infinity) - (daysSince(b.updatedAt) ?? Infinity),
};

/**
 * Detail page shared by medications and services. Leads with the answer
 * (where it's cheapest and what that saves), then the evidence.
 */
const ItemDetail = ({ item, backTo, backLabel }) => {
  const [sort, setSort] = useState("price");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const { lowest, highest, count } = priceSummary(item.providers);
  const typical = typicalPrice(item.providers);
  const cheapest = item.providers.find((provider) => provider.price === lowest);
  const savingVsTypical = typical !== null ? typical - lowest : 0;
  const newest = [...item.providers].sort(sorters.recent)[0];
  const verifiedCount = item.providers.filter((p) => p.trust !== "Community-reported").length;

  const rows = item.providers
    .filter((provider) => !verifiedOnly || provider.trust !== "Community-reported")
    .sort(sorters[sort]);

  // Same category first, then others of the same group (medications vs services).
  const isMedication = item.kind === "Medication";
  const sameGroup = catalog.filter(
    (other) => other.key !== item.key && (other.kind === "Medication") === isMedication,
  );
  const related = [
    ...sameGroup.filter((other) => other.category === item.category),
    ...sameGroup.filter((other) => other.category !== item.category),
  ].slice(0, 3);

  const tips = [
    item.requiresPrescription && "Bring your prescription. You'll need it to buy this medicine.",
    `The prices below are for ${item.priceFor.toLowerCase()}. Check you're being quoted for the same thing.`,
    "Call ahead or ask at the counter to confirm the price before you pay.",
    item.kind === "Medication" && "Ask whether a cheaper generic brand of the same medicine is available.",
  ].filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
      <Link
        to={backTo}
        className="inline-flex h-10 items-center gap-2 rounded-md text-sm font-medium text-on-surface-variant hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div className="min-w-0">
          {/* What it is */}
          <header className="relative">
            {images[item.kind] && (
              <img
                src={images[item.kind].src}
                alt=""
                className="mb-5 h-40 w-full rounded-2xl object-cover sm:h-48"
              />
            )}
            <p className="text-sm text-on-surface-variant">
              {item.kind}, {item.category.toLowerCase()}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-on-surface break-words sm:text-4xl">
              {/* Allow long names like "Artemether/Lumefantrine" to wrap after the slash. */}
            {item.name.replace(/\//g, "/\u200b")}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md border border-outline-variant bg-surface-container-lowest px-2.5 py-1 text-sm text-on-surface">
                <span className="text-on-surface-variant">Price for:&nbsp;</span>
                <span className="font-medium">{item.priceFor}</span>
              </span>
              {item.requiresPrescription && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-container px-2.5 py-1 text-sm font-medium text-on-surface">
                  <FileText className="size-4" aria-hidden="true" />
                  Prescription needed
                </span>
              )}
            </div>
            {item.description && (
              <p className="mt-4 max-w-[42rem] text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
                {item.description}
              </p>
            )}
          </header>

          {/* The answer */}
          {count > 0 && (
            <section
              aria-labelledby="summary-heading"
              className="mt-8 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-primary/25"
            >
              <div className="bg-primary/5 p-5 sm:p-6">
                <h2 id="summary-heading" className="text-sm font-semibold text-primary">
                  {count > 1 ? "Cheapest option we found" : "The only price we have so far"}
                </h2>
                <p className="mt-2 text-lg leading-7 text-on-surface sm:text-xl sm:leading-8">
                  <strong className="tabular text-2xl font-extrabold sm:text-3xl">{formatFCFA(lowest)}</strong>{" "}
                  at <strong className="font-semibold">{cheapest.name}</strong>
                  {cheapest.area && <>, {cheapest.area}</>}.
                </p>
                {count > 1 && (
                  <p className="mt-1 text-base text-on-surface-variant">
                    {savingVsTypical > 0 ? (
                      <>
                        That's <span className="tabular font-semibold text-primary">{formatFCFA(savingVsTypical)} less</span>{" "}
                        than the typical price, and{" "}
                        <span className="tabular font-semibold text-on-surface">{formatFCFA(highest - lowest)} less</span>{" "}
                        than the most expensive provider.
                      </>
                    ) : (
                      <>
                        That's <span className="tabular font-semibold text-primary">{formatFCFA(highest - lowest)} less</span>{" "}
                        than the most expensive provider.
                      </>
                    )}
                  </p>
                )}
              </div>

              {count > 1 && (
                <div className="border-t border-primary/15 p-5 sm:p-6">
                  <PriceSpread providers={item.providers} size="lg" />
                </div>
              )}

              <dl className="grid grid-cols-2 divide-outline-variant border-t border-outline-variant text-sm sm:grid-cols-4 sm:divide-x">
                {[
                  ["Typical price", typical !== null ? formatFCFA(typical) : "Needs 3+ prices"],
                  ["Price range", count > 1 ? `${formatAmount(lowest)} to ${formatFCFA(highest)}` : formatFCFA(lowest)],
                  ["Providers", `${count}, ${verifiedCount === count ? "all" : verifiedCount} verified`],
                  ["Latest check", freshness(newest.updatedAt).label.replace("Checked ", "")],
                ].map(([term, value]) => (
                  <div key={term} className="px-5 py-3 sm:px-6">
                    <dt className="text-on-surface-variant">{term}</dt>
                    <dd className="tabular mt-0.5 font-semibold text-on-surface">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* The evidence */}
          <section aria-labelledby="comparison-heading" className="mt-10">
            <h2 id="comparison-heading" className="text-2xl font-bold tracking-tight text-on-surface">
              Compare all {count} {count === 1 ? "provider" : "providers"}
            </h2>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div role="group" aria-label="Sort providers" className="inline-flex rounded-lg bg-surface-container-low p-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={sort === option.value}
                    onClick={() => setSort(option.value)}
                    className={`h-9 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      sort === option.value
                        ? "bg-surface-container-lowest text-on-surface shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {verifiedCount < count && (
                <label className="inline-flex h-9 cursor-pointer items-center gap-2 text-sm text-on-surface">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(event) => setVerifiedOnly(event.target.checked)}
                    className="size-4 accent-primary"
                  />
                  Only verified prices
                </label>
              )}
            </div>

            <div className="mt-4">
              <ComparisonTable providers={rows} itemName={item.name} typical={typical} lowest={lowest} />
            </div>

            <p className="mt-3 text-sm text-on-surface-variant">
              {typical !== null
                ? "“Typical” is the middle price across all providers we've checked. "
                : "We show a typical price once we have 3 or more prices. "}
              <Link to="/about#badges" className="font-medium text-primary underline-offset-4 hover:underline">
                How we verify prices
              </Link>
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/70">
            <h2 className="text-base font-bold text-on-surface">Before you go</h2>
            <ul className="mt-3 space-y-3">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-2.5 text-sm leading-6 text-on-surface">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-surface-container-low p-5">
            <h2 className="text-base font-bold text-on-surface">Who checked these prices</h2>
            <ul className="mt-3 space-y-2.5">
              {Object.entries(trustLevels).map(([key, level]) => (
                <li key={key} className="flex gap-2.5 text-sm leading-6 text-on-surface-variant">
                  <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${level.dot}`} aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-on-surface">{level.label}:</span> {level.summary}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-14 border-t border-outline-variant pt-10">
          <h2 id="related-heading" className="text-xl font-bold text-on-surface">
            Other {isMedication ? "medications" : "tests and services"}
          </h2>
          <ul className="mt-4 divide-y divide-outline-variant overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70">
            {related.map((other) => (
              <PriceListRow key={other.key} item={other} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ItemDetail;
