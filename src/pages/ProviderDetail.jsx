import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, CircleCheck, FlaskConical, Hospital, MapPin, Navigation, Pill } from "lucide-react";
import Freshness from "../components/Freshness";
import TrustBadge from "../components/TrustBadge";
import NotFound from "./NotFound";
import useApiFetch from "@/hooks/useApiFetch";
import { formatFCFA, priceSummary } from "@/lib/format";
import { directionsUrl } from "@/lib/pricing";
import { getProvider } from "@/services/catalog";

const typeIcons = {
  Pharmacy: Pill,
  "Hospital pharmacy": Pill,
  Hospital: Hospital,
  "Health centre": Building2,
  Laboratory: FlaskConical,
};

const tabs = [
  { value: "all", label: "Everything" },
  { value: "medication", label: "Medicines" },
  { value: "service", label: "Tests and services" },
];

/**
 * One provider's page: who they are, how to get there, and every price
 * they charge compared with the cheapest in Bamenda.
 */
const ProviderDetail = () => {
  const { id } = useParams();
  const [tab, setTab] = useState("all");
  const { data: provider, status, error, reload } = useApiFetch(() => getProvider(id), [id]);

  if (status === "error" && error.status === 404) {
    return (
      <NotFound
        title="We couldn't find that provider"
        message="It may have been removed, or the link may be wrong. Search for a medicine to see who sells it."
        linkTo="/medications"
        linkLabel="Browse medicines"
      />
    );
  }

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading provider">
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-surface-container" />
        <div className="mt-4 h-5 w-1/3 animate-pulse rounded bg-surface-container" />
        <div className="mt-10 space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 animate-pulse rounded-2xl bg-surface-container" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl bg-error-container p-6" role="alert">
          <p className="text-lg font-semibold text-on-error-container">This provider couldn't be loaded</p>
          <p className="mt-1 text-base text-on-error-container">{error.message}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-4 h-12 rounded-xl bg-primary px-6 text-lg font-semibold text-on-primary hover:bg-on-primary-fixed-variant"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const Icon = typeIcons[provider.type] ?? Building2;
  const entries = provider.prices
    .map(({ item, price }) => {
      const { lowest } = priceSummary(item.providers);
      return { item, price, lowest, isCheapest: price.price === lowest };
    })
    .sort((a, b) => a.item.name.localeCompare(b.item.name));
  const shown = entries.filter((entry) => tab === "all" || entry.item.group === tab);
  const cheapestCount = entries.filter((entry) => entry.isCheapest && entry.item.providers.length > 1).length;
  const groupsPresent = new Set(entries.map((entry) => entry.item.group));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-5 sm:px-6 sm:pt-8">
      <Link
        to="/medications"
        className="inline-flex h-11 items-center gap-2 rounded-lg text-base font-medium text-on-surface-variant hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
        Browse medicines
      </Link>

      <header className="mt-3 rounded-3xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/70 sm:p-8">
        <div className="flex gap-4">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-16"
            aria-hidden="true"
          >
            <Icon className="size-7 sm:size-8" />
          </span>
          <div className="min-w-0">
            <p className="text-base text-on-surface-variant">{provider.type}</p>
            <h1 className="mt-0.5 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">{provider.name}</h1>
            {provider.area && (
              <p className="mt-2 flex items-center gap-1.5 text-lg text-on-surface-variant">
                <MapPin className="size-5 shrink-0" aria-hidden="true" />
                {provider.area}, Bamenda
              </p>
            )}
          </div>
        </div>

        <ul className="mt-6 grid gap-3 text-lg text-on-surface sm:grid-cols-2">
          <li className="flex gap-2.5">
            <CircleCheck className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <strong className="tabular">{entries.length}</strong> {entries.length === 1 ? "price" : "prices"} on MediPrice
            </span>
          </li>
          {cheapestCount > 0 && (
            <li className="flex gap-2.5">
              <CircleCheck className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Cheapest in Bamenda for <strong className="tabular">{cheapestCount}</strong> of them
              </span>
            </li>
          )}
        </ul>

        <a
          href={directionsUrl(provider)}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-lg font-bold text-on-primary hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 sm:w-auto"
        >
          <Navigation className="size-5" aria-hidden="true" />
          Get directions
          <span className="sr-only"> to {provider.name} (opens Google Maps)</span>
        </a>
      </header>

      <section aria-labelledby="prices-heading" className="mt-10">
        <h2 id="prices-heading" className="text-2xl font-bold tracking-tight text-on-surface">
          Prices at {provider.name}
        </h2>

        {groupsPresent.size > 1 && (
          <div role="group" aria-label="Show" className="mt-4 inline-flex rounded-xl bg-surface-container-low p-1">
            {tabs.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={tab === option.value}
                onClick={() => setTab(option.value)}
                className={`h-11 rounded-lg px-4 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  tab === option.value ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <ul className="mt-5 space-y-4">
          {shown.map(({ item, price, lowest, isCheapest }) => (
            <li key={item.key} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/70">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                <div className="min-w-0">
                  <Link
                    to={item.href}
                    className="inline-block py-2.5 text-lg font-bold leading-snug text-on-surface underline-offset-4 hover:text-primary hover:underline"
                  >
                    {item.name.replace(/\//g, "/​")}
                  </Link>
                  <p className="mt-0.5 text-base text-on-surface-variant">Price is for: {item.priceFor}</p>
                </div>
                <div className="sm:text-right">
                  <p className="tabular text-2xl font-extrabold tracking-tight text-on-surface">{formatFCFA(price.price)}</p>
                  {item.providers.length > 1 &&
                    (isCheapest ? (
                      <p className="inline-flex items-center gap-1.5 text-base font-semibold text-primary">
                        <CircleCheck className="size-5" aria-hidden="true" />
                        Cheapest in Bamenda
                      </p>
                    ) : (
                      <p className="tabular text-base text-on-surface-variant">
                        {formatFCFA(price.price - lowest)} more than the cheapest
                      </p>
                    ))}
                </div>
              </div>
              <div className="mt-3 flex flex-col items-start gap-2 border-t border-outline-variant/60 pt-3">
                <TrustBadge status={price.trust} size="sm" />
                <Freshness date={price.updatedAt} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ProviderDetail;
