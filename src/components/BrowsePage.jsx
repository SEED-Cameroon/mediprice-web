import { useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ChevronDown, Info, SlidersHorizontal } from "lucide-react";
import { priceSummary } from "@/lib/format";
import FilterGroup from "./FilterGroup";
import PriceListRow from "./PriceListRow";
import SearchField from "./SearchField";

const ITEMS_PER_PAGE = 10;

const sortOptions = [
  { value: "price", label: "Lowest price first" },
  { value: "name", label: "Name, A to Z" },
  { value: "providers", label: "Most providers" },
];

const sorters = {
  price: (a, b) => (priceSummary(a.providers).lowest ?? Infinity) - (priceSummary(b.providers).lowest ?? Infinity),
  name: (a, b) => a.name.localeCompare(b.name),
  providers: (a, b) => b.providers.length - a.providers.length,
};

/**
 * Searchable, filterable, sortable price list. Search, filters, sort and
 * page all live in the URL so a result list can be shared or bookmarked.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.intro
 * @param {string} props.searchLabel
 * @param {string} props.searchPlaceholder
 * @param {object[]} props.items - items from src/services/catalog.js
 * @param {{ param: string, label: string, getValue: (item: object) => string }[]} props.filters
 * @param {string} props.noun - plural noun for the result count, e.g. "medications"
 * @param {boolean} [props.showKind] - show the item type in each row
 * @param {{ label: string, to: string }} [props.crossLink] - suggestion shown when nothing matches
 * @param {{ src: string, alt: string }} [props.image] - photo shown beside the title
 * @param {boolean} [props.autoFocusSearch] - put the cursor in the search box on arrival
 * @param {"ready" | "loading" | "error"} [props.status]
 * @param {string} [props.errorMessage]
 * @param {() => void} [props.onRetry]
 */
const BrowsePage = ({
  title,
  intro,
  searchLabel,
  searchPlaceholder,
  items,
  filters = [],
  noun,
  showKind = false,
  crossLink,
  image,
  autoFocusSearch = false,
  status = "ready",
  errorMessage,
  onRetry,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Other pages can send people here with a message, e.g. Compare with too few items.
  const notice = useLocation().state?.notice;
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get("search") ?? "";
  const sort = sorters[searchParams.get("sort")] ? searchParams.get("sort") : "price";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const selected = Object.fromEntries(
    filters.map((filter) => [filter.param, searchParams.get(filter.param) ?? "all"]),
  );

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setSearchParams(next, { replace: key === "search" });
  };

  const searched = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      [item.name, item.category, item.kind, item.description, ...item.providers.map((p) => p.name)]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term)),
    );
  }, [items, search]);

  const results = useMemo(
    () =>
      searched
        .filter((item) =>
          filters.every((filter) => selected[filter.param] === "all" || filter.getValue(item) === selected[filter.param]),
        )
        .sort(sorters[sort]),
    // selected is rebuilt every render; its contents come from searchParams.
    [searched, searchParams], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Option counts reflect the search, so people can see where results are.
  const filterOptions = (filter) => {
    const counts = new Map();
    searched.forEach((item) => {
      const value = filter.getValue(item);
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return [
      { value: "all", label: "All", count: searched.length },
      ...[...counts.keys()].sort().map((value) => ({ value, label: value, count: counts.get(value) })),
    ];
  };

  const visible = results.slice(0, page * ITEMS_PER_PAGE);
  const activeFilterCount = filters.filter((filter) => selected[filter.param] !== "all").length;
  const hasFilters = search || filters.some((filter) => selected[filter.param] !== "all");

  return (
    <>
      <header className="relative isolate overflow-hidden bg-on-primary-fixed text-white">
        {image && (
          <img src={image.src} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-on-primary-fixed/95 via-on-primary-fixed/80 to-on-primary-fixed/40"
        />
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="max-w-[40rem] text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-3 max-w-[38rem] text-base leading-7 text-white/90 sm:text-lg sm:leading-8">{intro}</p>
          <div className="mt-6 max-w-[38rem]">
            <SearchField
              id={`${noun}-search`}
              label={searchLabel}
              value={search}
              onChange={(value) => updateParam("search", value)}
              placeholder={searchPlaceholder}
              size="lg"
              autoFocus={autoFocusSearch}
            />
          </div>
        </div>
      </header>

    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      {notice && (
        <p
          role="status"
          className="mt-6 flex gap-3 rounded-2xl bg-secondary/10 px-5 py-4 text-lg text-on-surface ring-1 ring-secondary/30"
        >
          <Info className="mt-1 size-5 shrink-0 text-secondary" aria-hidden="true" />
          {notice}
        </p>
      )}
      <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-10">
        {filters.length > 0 && (
          <aside aria-label="Filters" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            {/* On phones, filters fold behind a button so results come first */}
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="filter-panel"
              className="flex h-12 w-full items-center justify-between gap-3 rounded-xl bg-surface-container-lowest px-4 text-lg font-semibold text-on-surface ring-1 ring-outline-variant hover:ring-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-5" aria-hidden="true" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                    {activeFilterCount}
                    <span className="sr-only"> on</span>
                  </span>
                )}
              </span>
              <ChevronDown
                className={`size-5 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            <div
              id="filter-panel"
              className={`mt-4 space-y-5 lg:mt-0 lg:block ${filtersOpen ? "block" : "hidden"}`}
            >
              {filters.map((filter) => (
                <FilterGroup
                  key={filter.param}
                  label={filter.label}
                  options={filterOptions(filter)}
                  value={selected[filter.param]}
                  onChange={(value) => updateParam(filter.param, value)}
                />
              ))}
            </div>
          </aside>
        )}

        <section aria-label="Results" className="min-w-0 lg:col-start-2">
          {status === "loading" ? (
            <ul
              className="divide-y divide-outline-variant overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70"
              aria-busy="true"
              aria-label={`Loading ${noun}`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <li key={index} className="space-y-3 px-5 py-5">
                  <div className="flex justify-between gap-6">
                    <div className="h-5 w-1/2 animate-pulse rounded bg-surface-container" />
                    <div className="h-6 w-24 animate-pulse rounded bg-surface-container" />
                  </div>
                  <div className="h-4 w-1/3 animate-pulse rounded bg-surface-container" />
                </li>
              ))}
            </ul>
          ) : status === "error" ? (
            <div className="rounded-lg border border-error/30 bg-error-container p-6" role="alert">
              <p className="font-semibold text-on-error-container">Prices couldn't be loaded</p>
              <p className="mt-1 text-sm text-on-error-container">
                {errorMessage || "Check your internet connection, then try again."}
              </p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-4 h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Try again
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="text-base leading-[2.75rem] text-on-surface" aria-live="polite">
                  <span className="font-semibold">{results.length}</span>{" "}
                  {results.length === 1 ? noun.replace(/s$/, "") : noun}
                  {search.trim() && <> matching “{search.trim()}”</>}
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={() => setSearchParams(sort === "price" ? {} : { sort })}
                      className="ml-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Clear all
                    </button>
                  )}
                </p>

                <label className="flex items-center gap-2 text-base text-on-surface-variant">
                  Sort by
                  <select
                    value={sort}
                    onChange={(event) => updateParam("sort", event.target.value === "price" ? "" : event.target.value)}
                    className="h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-base font-medium text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-6 sm:p-8">
                  <p className="font-semibold text-on-surface">
                    No {noun} match {search.trim() ? `“${search.trim()}”` : "these filters"}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
                    <li>Check the spelling, or try the generic name (for example, paracetamol).</li>
                    <li>Use a shorter search, such as one word.</li>
                    {hasFilters && <li>Remove a filter.</li>}
                  </ul>
                  {crossLink && (
                    <Link
                      to={`${crossLink.to}${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`}
                      className="mt-4 inline-flex h-10 items-center rounded-md text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {crossLink.label}
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-outline-variant overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70">
                  {visible.map((item) => (
                    <PriceListRow key={item.key} item={item} showKind={showKind} />
                  ))}
                </ul>
              )}

              {visible.length < results.length && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => updateParam("page", String(page + 1))}
                    className="h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-6 text-sm font-semibold text-on-surface hover:border-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Show {Math.min(ITEMS_PER_PAGE, results.length - visible.length)} more
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
    </>
  );
};

export default BrowsePage;
