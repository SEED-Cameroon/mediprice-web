import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, FlaskConical, Hospital, Pill, Search } from "lucide-react";
import FairPriceTag from "../components/FairPriceTag";
import Freshness from "../components/Freshness";
import PriceListRow from "../components/PriceListRow";
import TrustBadge, { trustLevels } from "../components/TrustBadge";
import catalog, { providers } from "../data/catalog";
import images from "../data/images";
import { formatFCFA, priceSummary } from "@/lib/format";
import { comparePrice, typicalPrice } from "@/lib/pricing";

const popularSearches = ["Paracetamol", "Coartem", "Malaria test", "Ultrasound", "Blood count"];

// The price board: a mix of the most common medicines and services.
const boardKeys = ["medication-4", "medication-1", "service-1", "medication-2", "service-3"];
const board = boardKeys.map((key) => catalog.find((item) => item.key === key)).filter(Boolean);


// The worked example in "How to read a price".
const exampleItem = catalog.find((item) => item.key === "medication-4");
const exampleProvider = exampleItem.providers.find((provider) => provider.trust === "Provider-verified");
const exampleTypical = typicalPrice(exampleItem.providers);
const exampleFair = comparePrice(exampleProvider.price, exampleTypical);

// The floating card on the hero photo shows a real comparison.
const heroItem = exampleItem;
const heroSummary = priceSummary(heroItem.providers);
const heroCheapest = heroItem.providers.find((provider) => provider.price === heroSummary.lowest);
const heroTypical = typicalPrice(heroItem.providers);

const lowestOf = (items) => Math.min(...items.map((item) => priceSummary(item.providers).lowest));
const categories = [
  { title: "Medications", kind: "Medication", to: "/catalogue", noun: "medicines" },
  { title: "Lab tests", kind: "Lab test", to: "/services?type=Lab+test", noun: "tests" },
  { title: "Care services", kind: "Care service", to: "/services?type=Care+service", noun: "services" },
].map((category) => {
  const items = catalog.filter((item) => item.kind === category.kind);
  return { ...category, count: items.length, from: lowestOf(items), image: images[category.kind] };
});

const providerIcons = {
  Pharmacy: Pill,
  "Hospital pharmacy": Pill,
  Hospital: Hospital,
  "Health centre": Building2,
  Laboratory: FlaskConical,
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!location.hash) return;
    document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/search?search=${encodeURIComponent(term)}` : "/search");
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <>
      {/* Hero: full-width photo, search on top */}
      <section className="relative isolate overflow-hidden bg-on-primary-fixed text-white">
        <picture>
          <source media="(max-width: 640px)" srcSet={images.hero.srcSm} />
          <img
            src={images.hero.src}
            alt=""
            className="absolute inset-0 -z-10 size-full object-cover object-[70%_center]"
          />
        </picture>
        {/* Scrim: darkens only where the text sits, so it stays readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-on-primary-fixed/80 via-on-primary-fixed/75 to-on-primary-fixed/90 lg:bg-gradient-to-r lg:from-on-primary-fixed/95 lg:via-on-primary-fixed/70 lg:to-on-primary-fixed/10"
        />

        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:min-h-[34rem] lg:grid-cols-[1.25fr_1fr] lg:items-center lg:py-24">
          <div>
            <h1 className="max-w-[36rem] text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Find the best price for your medicine before you go
            </h1>
            <p className="mt-5 max-w-[32rem] text-lg leading-8 text-white/90 sm:text-xl sm:leading-9">
              Compare pharmacies, labs and hospitals in Bamenda. See who charges
              less, and who checked the price.
            </p>

            <form
              onSubmit={handleSearch}
              role="search"
              className="mt-8 flex max-w-[36rem] flex-col gap-2 sm:flex-row sm:gap-0"
            >
              <div className="relative flex-1">
                <label htmlFor="hero-search" className="sr-only">
                  Search medicines, lab tests and services
                </label>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-outline"
                  aria-hidden="true"
                />
                <input
                  id="hero-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Type a medicine or test"
                  autoComplete="off"
                  className="h-14 w-full rounded-xl bg-white pl-13 pr-4 text-lg text-on-surface shadow-lg outline-none placeholder:text-outline focus:ring-4 focus:ring-primary-fixed-dim sm:rounded-r-none"
                />
              </div>
              <button
                type="submit"
                className="h-14 rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-lg transition-colors hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-fixed-dim sm:rounded-l-none"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-base text-white/85">Popular:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  to={`/search?search=${encodeURIComponent(term)}`}
                  className="inline-flex h-10 items-center rounded-lg bg-white/15 px-4 text-base font-medium text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          {/* A real comparison, so the first thing people see is a price */}
          <Link
            to={heroItem.href}
            className="block self-end rounded-2xl bg-white p-5 text-on-surface shadow-2xl shadow-black/30 transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-fixed-dim lg:ml-auto lg:w-[22rem]"
          >
            <p className="text-sm font-medium text-on-surface-variant">Today's lowest price for</p>
            <p className="mt-0.5 text-lg font-bold leading-snug">Malaria treatment (adult)</p>
            <p className="tabular mt-3 text-3xl font-extrabold tracking-tight">{formatFCFA(heroSummary.lowest)}</p>
            <p className="mt-0.5 text-base text-on-surface-variant">at {heroCheapest.name}</p>
            <div className="mt-3">
              <TrustBadge status={heroCheapest.trust} />
            </div>
            {heroTypical !== null && (
              <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-base font-semibold text-primary">
                Save {formatFCFA(heroTypical - heroSummary.lowest)} on the usual price
              </p>
            )}
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories-heading" className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-16">
        <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          What do you need today?
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {categories.map((category) => (
            <li key={category.title}>
              <Link
                to={category.to}
                className="group block overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/60 transition hover:shadow-lg hover:ring-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="aspect-[16/10] overflow-hidden bg-surface-container">
                  <img
                    src={category.image.src}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                  <div>
                    <p className="text-lg font-bold text-on-surface">{category.title}</p>
                    <p className="mt-0.5 text-sm text-on-surface-variant">
                      {category.count} {category.noun}, from{" "}
                      <span className="tabular font-semibold text-on-surface">{formatFCFA(category.from)}</span>
                    </p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Price board */}
      <section aria-labelledby="board-heading" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h2 id="board-heading" className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
              Prices for common needs
            </h2>
            <p className="mt-1 text-base text-on-surface-variant">
              The typical price in Bamenda, and the cheapest place we've found.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            See all {catalog.length} prices
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Table on wide screens */}
        <div className="mt-6 hidden overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70 md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Typical and lowest prices for common medicines and services</caption>
            <thead className="border-b border-outline-variant bg-surface-container-low text-sm text-on-surface-variant">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Medicine or service</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Typical price</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Lowest price</th>
                <th scope="col" className="px-5 py-3 font-medium">Cheapest at</th>
                <th scope="col" className="px-5 py-3"><span className="sr-only">Compare</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {board.map((item) => {
                const { lowest } = priceSummary(item.providers);
                const cheapest = item.providers.find((provider) => provider.price === lowest);

                return (
                  <tr key={item.key} className="hover:bg-surface-container-low">
                    <th scope="row" className="px-5 py-4 font-normal">
                      <Link to={item.href} className="font-semibold text-on-surface hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        {item.name}
                      </Link>
                      <p className="text-sm text-on-surface-variant">{item.priceFor}</p>
                    </th>
                    <td className="tabular px-5 py-4 text-right text-on-surface-variant">
                      {typicalPrice(item.providers) !== null ? (
                        formatFCFA(typicalPrice(item.providers))
                      ) : (
                        <span className="text-sm">Needs 3+ prices</span>
                      )}
                    </td>
                    <td className="tabular px-5 py-4 text-right text-lg font-bold text-on-surface">
                      {formatFCFA(lowest)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-on-surface">{cheapest.name}</p>
                      <div className="mt-1">
                        <TrustBadge status={cheapest.trust} size="sm" />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={item.href}
                        className="inline-flex h-9 items-center rounded-md border border-outline-variant px-3 text-sm font-semibold text-on-surface hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={`Compare ${item.providers.length} prices for ${item.name}`}
                      >
                        Compare {item.providers.length}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* List on phones */}
        <ul className="mt-6 divide-y divide-outline-variant overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70 md:hidden">
          {board.map((item) => (
            <PriceListRow key={item.key} item={item} />
          ))}
        </ul>
      </section>

      {/* How to read a price */}
      <section
        id="how-it-works"
        aria-labelledby="read-heading"
        className="scroll-mt-20 border-y border-outline-variant bg-surface-container-low"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
          <div>
            <h2 id="read-heading" className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
              How to read a price
            </h2>
            <p className="mt-2 text-base leading-7 text-on-surface-variant">
              Every price on MediPrice tells you four things, so you can decide
              where to go with confidence.
            </p>

            <ol className="mt-6 space-y-4">
              {[
                ["What the price is for", "The exact pack size, or one test or visit, so you compare like with like."],
                ["How it compares", "Whether it's below, at or above the typical price in Bamenda, and by how much."],
                ["Who verified it", "Our team, the provider itself, or a patient's receipt."],
                ["When it was checked", "Recent prices are more reliable. We warn you when one may be out of date."],
              ].map(([title, text], index) => (
                <li key={title} className="grid grid-cols-[1.75rem_1fr] gap-x-3">
                  <span
                    className="tabular flex size-7 items-center justify-center rounded-full bg-on-surface text-sm font-bold text-surface-container-lowest"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold leading-7 text-on-surface">{title}</p>
                    <p className="text-sm leading-6 text-on-surface-variant">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Annotated example, built from real data */}
          <figure className="rounded-2xl bg-surface-container-lowest p-5 shadow-md ring-1 ring-outline-variant/60 sm:p-6">
            <figcaption className="text-sm text-on-surface-variant">Example</figcaption>
            <p className="mt-1 text-lg font-bold text-on-surface">{exampleItem.name}</p>

            <dl className="mt-4 divide-y divide-outline-variant border-t border-outline-variant">
              {[
                [
                  1,
                  "Price for",
                  <span key="for" className="font-medium text-on-surface">{exampleItem.priceFor}</span>,
                ],
                [
                  2,
                  `${exampleProvider.name}`,
                  <div key="price" className="text-right">
                    <p className="tabular text-xl font-bold text-on-surface">{formatFCFA(exampleProvider.price)}</p>
                    <FairPriceTag level={exampleFair.level} difference={exampleFair.difference} />
                  </div>,
                ],
                [3, "Verified by", <TrustBadge key="badge" status={exampleProvider.trust} />],
                [4, "Last checked", <Freshness key="fresh" date={exampleProvider.updatedAt} />],
              ].map(([number, term, value]) => (
                <div key={number} className="flex items-center justify-between gap-4 py-3">
                  <dt className="flex items-center gap-2.5 text-sm text-on-surface-variant">
                    <span
                      className="tabular flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-on-surface text-xs font-bold text-on-surface"
                      aria-hidden="true"
                    >
                      {number}
                    </span>
                    {term}
                  </dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </figure>
        </div>
      </section>

      {/* Badges */}
      <section aria-labelledby="badges-heading" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 id="badges-heading" className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          Who checks the prices
        </h2>
        <p className="mt-2 max-w-[40rem] text-base leading-7 text-on-surface-variant">
          The badge tells you where a price came from. It says how certain the
          price is, not whether it's cheap.
        </p>

        <dl className="mt-8 grid gap-4 md:grid-cols-3">
          {Object.entries(trustLevels).map(([key, level]) => (
            <div key={key} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/70">
              <dt className="flex items-center justify-between gap-3">
                <TrustBadge status={key} />
                <span className="text-sm text-on-surface-variant">{level.strength}</span>
              </dt>
              <dd className="mt-3 text-base leading-7 text-on-surface">{level.summary}</dd>
            </div>
          ))}
        </dl>

        <Link
          to="/about#badges"
          className="mt-5 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          How we collect and verify prices
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      {/* Coverage */}
      <section aria-labelledby="coverage-heading" className="border-t border-outline-variant bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 id="coverage-heading" className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
            Providers we cover
          </h2>
          <p className="mt-2 max-w-[40rem] text-base leading-7 text-on-surface-variant">
            We're adding more pharmacies, labs and hospitals across Bamenda every month.
          </p>

          <ul className="mt-8 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => {
              const Icon = providerIcons[provider.type] ?? Building2;
              return (
                <li key={provider.name} className="flex items-start gap-3 border-b border-outline-variant py-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-on-surface">{provider.name}</p>
                    <p className="text-sm text-on-surface-variant">
                      {provider.type}
                      {provider.area && `, ${provider.area}`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Monthly report */}
      <section className="border-t border-outline-variant">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[32rem]">
            <h2 className="text-xl font-bold text-on-surface">Get the monthly Bamenda price report</h2>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              One short email a month with price changes for common medicines and tests.
            </p>
          </div>

          {subscribed ? (
            <p
              role="status"
              className="w-full rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary md:max-w-[24rem]"
            >
              You're subscribed. The next report will arrive in your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full flex-col gap-2 sm:flex-row md:max-w-[28rem]">
              <label htmlFor="report-email" className="sr-only">
                Email address
              </label>
              <input
                id="report-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-11 flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 text-base text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-3 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="h-11 rounded-lg bg-on-surface px-5 text-sm font-semibold text-surface-container-lowest hover:bg-inverse-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
