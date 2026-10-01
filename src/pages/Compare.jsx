import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, FileText, Link2, MapPin, Plus, X } from "lucide-react";
import Freshness from "../components/Freshness";
import TrustBadge from "../components/TrustBadge";
import { MAX_COMPARE, useCompare } from "@/context/CompareContext";
import useApiFetch from "@/hooks/useApiFetch";
import { formatFCFA, formatFCFAExact, priceSummary } from "@/lib/format";
import { typicalPrice } from "@/lib/pricing";
import { getComparison } from "@/services/catalog";
import usePageMeta from "@/hooks/usePageMeta";

const groups = {
  medication: { browse: "/medications", plural: "medicines", title: "Compare medicines" },
  service: { browse: "/labs-services", plural: "tests and services", title: "Compare tests and services" },
};

/** Everything the comparison shows for one item, computed once. */
const describe = (item) => {
  const { lowest, highest, count } = priceSummary(item.providers);
  return {
    item,
    lowest,
    highest,
    count,
    typical: typicalPrice(item.providers),
    cheapest: item.providers.find((provider) => provider.price === lowest),
  };
};

const CopyLinkButton = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be blocked; fall back to letting people copy the address bar.
      window.prompt("Copy this link to share the comparison:", window.location.href);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-surface-container-lowest px-5 text-lg font-semibold text-on-surface ring-1 ring-outline-variant hover:ring-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {copied ? <Check className="size-5 text-primary" aria-hidden="true" /> : <Link2 className="size-5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Link copied" : "Copy link to share"}</span>
    </button>
  );
};

const Compare = () => {
  usePageMeta({ title: "Compare prices", noindex: true });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setItems } = useCompare();

  const group = searchParams.get("type");
  const config = groups[group];
  const ids = [...new Set((searchParams.get("ids") ?? "").split(",").map((id) => id.trim()).filter(Boolean))].slice(
    0,
    MAX_COMPARE,
  );
  const idsKey = ids.join(",");

  const { data, status, error, reload } = useApiFetch(
    () => (config ? getComparison({ group, ids }) : Promise.resolve([])),
    [group, idsKey],
  );

  // Opening a shared link makes it the current comparison, so people can add to it.
  useEffect(() => {
    if (status === "ready" && data.length >= 2) {
      setItems(data.map((item) => ({ key: item.key, id: item.id, name: item.name, group: item.group })));
    }
  }, [status, data, setItems]);

  const removeItem = (id) => {
    const next = ids.filter((existing) => existing !== id);
    navigate(`/compare?type=${group}&ids=${next.join(",")}`, { replace: true });
  };

  if (!config) {
    return (
      <Navigate
        to="/medications"
        replace
        state={{ notice: "Choose at least 2 medicines, or 2 tests, to compare. Open one and tap “Add to compare”." }}
      />
    );
  }

  if (status === "ready" && data.length < 2) {
    return (
      <Navigate
        to={config.browse}
        replace
        state={{
          notice: `Choose at least 2 ${config.plural} to compare. Open one and tap “Add to compare”.`,
        }}
      />
    );
  }

  const rows = status === "ready" ? data.map(describe) : [];
  const best = rows.length ? Math.min(...rows.map((row) => row.lowest ?? Infinity)) : null;
  const anyPrices = rows.some((row) => row.count > 0);

  const attributes = [
    {
      label: "Lowest price",
      render: (row) => (
        <div>
          <p className="tabular text-2xl font-extrabold tracking-tight text-on-surface">
            {row.count > 0 ? formatFCFA(row.lowest) : <span className="text-base font-medium text-on-surface-variant">No Bamenda prices yet</span>}
          </p>
          {anyPrices && row.lowest === best && rows.length > 1 && (
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-base font-semibold text-primary">
              <Check className="size-5" aria-hidden="true" />
              Lowest of these
            </p>
          )}
        </div>
      ),
    },
    {
      label: "Cheapest at",
      render: (row) =>
        row.cheapest ? (
          <div className="flex flex-col items-start gap-2">
            <p className="text-base font-semibold text-on-surface">{row.cheapest.name}</p>
            {row.cheapest.area && (
              <p className="flex items-center gap-1.5 text-base text-on-surface-variant">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                {row.cheapest.area}
              </p>
            )}
            <TrustBadge status={row.cheapest.trust} size="sm" />
            <Freshness date={row.cheapest.updatedAt} />
          </div>
        ) : (
          <p className="text-base text-on-surface-variant">No prices yet</p>
        ),
    },
    {
      label: "Typical in Cameroon",
      render: (row) => {
        const ref = row.item.referencePrices?.[0];
        return ref ? (
          <div>
            <p className="tabular text-base font-semibold text-on-surface">
              {formatFCFAExact(ref.amount)} <span className="font-normal text-on-surface-variant">{ref.unit}</span>
            </p>
            <a href={ref.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm text-secondary underline underline-offset-4">
              Survey, {ref.year}
            </a>
          </div>
        ) : (
          <p className="text-base text-on-surface-variant">No survey price</p>
        );
      },
    },
    {
      label: "Usual price",
      render: (row) => (
        <p className="tabular text-base text-on-surface">
          {row.typical !== null ? formatFCFA(row.typical) : "Not enough prices yet"}
        </p>
      ),
    },
    {
      label: "Most expensive",
      render: (row) => <p className="tabular text-base text-on-surface">{row.count > 1 ? formatFCFA(row.highest) : "Only 1 price"}</p>,
    },
    {
      label: "Places with a price",
      render: (row) => <p className="tabular text-base text-on-surface">{row.count}</p>,
    },
    {
      label: "Price is for",
      render: (row) => <p className="text-base text-on-surface">{row.item.priceFor}</p>,
    },
    ...(group === "medication"
      ? [
          {
            label: "Prescription",
            render: (row) =>
              row.item.requiresPrescription ? (
                <p className="inline-flex items-center gap-1.5 text-base font-semibold text-tertiary">
                  <FileText className="size-5" aria-hidden="true" />
                  Needed
                </p>
              ) : (
                <p className="text-base text-on-surface">Not needed</p>
              ),
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-5 sm:px-6 sm:pt-8">
      <Link
        to={config.browse}
        className="inline-flex h-11 items-center gap-2 rounded-lg text-base font-medium text-on-surface-variant hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
        All {config.plural}
      </Link>

      <header className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">{config.title}</h1>
          <p className="mt-2 max-w-[38rem] text-lg leading-8 text-on-surface-variant">
            The lowest price for each, and where to find it. Send the link to family so they can see it too.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CopyLinkButton />
          {ids.length < MAX_COMPARE && (
            <Link
              to={config.browse}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-lg font-semibold text-on-primary hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
            >
              <Plus className="size-5" aria-hidden="true" />
              Add another
            </Link>
          )}
        </div>
      </header>

      <div className="mt-8">
        {status === "loading" ? (
          <div className="grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Loading comparison">
            {ids.slice(0, 2).map((id) => (
              <div key={id} className="h-80 animate-pulse rounded-2xl bg-surface-container" />
            ))}
          </div>
        ) : status === "error" ? (
          <div className="rounded-2xl bg-error-container p-6" role="alert">
            <p className="text-lg font-semibold text-on-error-container">The comparison couldn't be loaded</p>
            <p className="mt-1 text-base text-on-error-container">{error.message}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-4 h-12 rounded-xl bg-primary px-6 text-lg font-semibold text-on-primary hover:bg-on-primary-fixed-variant"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {data.length < ids.length && (
              <p className="mb-5 rounded-xl bg-surface-container px-4 py-3 text-base text-on-surface" role="status">
                {ids.length - data.length === 1 ? "One item" : `${ids.length - data.length} items`} in this link could
                not be found, so {ids.length - data.length === 1 ? "it isn't" : "they aren't"} shown.
              </p>
            )}

            {/* Wide screens: a real table, one column per item */}
            <div className="hidden overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70 md:block">
              <table className="w-full table-fixed border-collapse text-left">
                <caption className="sr-only">{config.title}</caption>
                <colgroup>
                  <col className="w-48" />
                </colgroup>
                <thead>
                  <tr className="border-b border-outline-variant align-top">
                    <td className="p-5" />
                    {rows.map((row) => (
                      <th key={row.item.key} scope="col" className="p-5 font-normal">
                        <Link
                          to={row.item.href}
                          className="inline-block py-2.5 text-lg font-bold leading-snug text-on-surface underline-offset-4 hover:text-primary hover:underline"
                        >
                          {row.item.name.replace(/\//g, "/​")}
                        </Link>
                        <p className="mt-0.5 text-base text-on-surface-variant">{row.item.kind}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(row.item.id)}
                          className="mt-2 inline-flex h-11 items-center gap-1.5 rounded-lg text-base font-medium text-on-surface-variant hover:text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <X className="size-4" aria-hidden="true" />
                          Remove
                          <span className="sr-only"> {row.item.name}</span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {attributes.map((attribute) => (
                    <tr key={attribute.label} className="align-top">
                      <th scope="row" className="bg-surface-container-low p-5 text-base font-semibold text-on-surface">
                        {attribute.label}
                      </th>
                      {rows.map((row) => (
                        <td key={row.item.key} className="p-5">
                          {attribute.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phones: one card per item */}
            <ol className="space-y-4 md:hidden" aria-label={config.title}>
              {rows.map((row) => (
                <li
                  key={row.item.key}
                  className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={row.item.href} className="inline-block py-2.5 text-xl font-bold leading-snug text-on-surface underline-offset-4 hover:underline">
                        {row.item.name.replace(/\//g, "/​")}
                      </Link>
                      <p className="mt-0.5 text-base text-on-surface-variant">{row.item.kind}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(row.item.id)}
                      className="flex size-11 shrink-0 items-center justify-center rounded-lg text-on-surface-variant ring-1 ring-outline-variant hover:text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <X className="size-5" aria-hidden="true" />
                      <span className="sr-only">Remove {row.item.name}</span>
                    </button>
                  </div>
                  <dl className="mt-4 divide-y divide-outline-variant/60">
                    {attributes.map((attribute) => (
                      <div key={attribute.label} className="py-3">
                        <dt className="text-sm font-semibold text-on-surface-variant">{attribute.label}</dt>
                        <dd className="mt-1">{attribute.render(row)}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
};

export default Compare;
