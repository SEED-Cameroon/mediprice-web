import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import medications from "@/data/Medications";

const featured = medications[0]; // Paracetamol 500mg — the board's example entry
const otherSearches = medications.slice(1).map((m) => m.name.split(" ")[0]);

const steps = [
  {
    number: "01",
    title: "Search",
    description:
      "Look up a medication, lab test, or service by name. No account needed.",
  },
  {
    number: "02",
    title: "Compare",
    description:
      "See what pharmacies and hospitals near you are actually charging for it.",
  },
  {
    number: "03",
    title: "Check the stamp",
    description:
      "Every price is marked with who confirmed it and when, so you know how far to trust it.",
  },
];

const stamps = [
  {
    label: "SEED verified",
    rotate: "-rotate-3",
    color: "forest",
    description:
      "Confirmed on-site by the SEED team. The highest level of trust on the board.",
  },
  {
    label: "Provider verified",
    rotate: "rotate-2",
    color: "stamp",
    description:
      "Confirmed directly by the pharmacy or hospital through their own listing.",
  },
  {
    label: "Community reported",
    rotate: "-rotate-2",
    color: "clay",
    description:
      "Submitted by a patient from a recent receipt. Useful, but not yet confirmed.",
  },
];

const stampColorClasses = {
  forest: "border-forest text-forest",
  stamp: "border-stamp text-stamp",
  clay: "border-clay text-clay",
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  const goToCatalogue = (term) => {
    const search = term.trim();
    navigate(
      search ? `/catalogue?search=${encodeURIComponent(search)}` : "/catalogue",
    );
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    goToCatalogue(query);
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <main className="flex flex-col">
      {/* Hero: the board's cover, with today's example entry open on it */}
      <section className="bg-forest-deep">
        <div className="mx-auto grid w-full max-w-container-max gap-xl px-gutter py-xl lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="font-display text-lg italic text-paper/70">
              A community price ledger for Bamenda
            </p>

            <h1 className="mt-3 max-w-144 font-display text-4xl font-semibold leading-[1.1] text-paper sm:text-5xl">
              {featured.name} costs {featured.providers[0].price} here,{" "}
              {featured.providers[1].price} there.
            </h1>

            <p className="mt-5 max-w-112 text-base leading-7 text-paper/75">
              SEED Cameroon and the people of Bamenda keep this board
              up to date, so you know the price before you walk in — for
              medication, lab tests, and hospital services alike.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 flex flex-col gap-2 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 rounded-sm border border-paper/25 bg-forest-deep px-3 py-2.5 focus-within:border-paper/60">
                <Search
                  className="size-4 shrink-0 text-paper/50"
                  aria-hidden="true"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Look up a drug, test, or service"
                  aria-label="Look up a drug, test, or service"
                  className="h-auto flex-1 border-none bg-transparent p-0 text-base text-paper shadow-none placeholder:text-paper/50 focus-visible:ring-0"
                />
              </div>

              <Button
                type="submit"
                className="rounded-sm bg-paper px-6 py-5 text-forest-deep hover:bg-paper/90"
              >
                Search the board
              </Button>
            </form>

            <p className="mt-4 text-sm text-paper/60">
              Also on the board:{" "}
              {otherSearches.map((term, i) => (
                <span key={term}>
                  <button
                    type="button"
                    onClick={() => goToCatalogue(term)}
                    className="rounded-xs text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-forest-deep"
                  >
                    {term}
                  </button>
                  {i < otherSearches.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          </div>

          {/* The ledger entry itself */}
          <div className="rounded-sm bg-paper-raised p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)] sm:p-8">
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="text-xs text-ink-soft">{featured.category}</p>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {featured.name}
                </h2>
              </div>
              <p className="whitespace-nowrap text-xs text-ink-soft">
                Checked today in Bamenda
              </p>
            </div>

            <ul>
              {featured.providers.map((provider, index) => (
                <li
                  key={provider.id}
                  className="ledger-row flex items-center justify-between gap-4 border-b border-line py-4 last:border-b-0"
                  style={{ "--row-index": index }}
                >
                  <div>
                    <p className="font-medium text-ink">{provider.name}</p>
                    <p className="text-xs text-ink-soft">
                      {provider.trust}, updated {provider.updatedAt.toLowerCase()}
                    </p>
                  </div>
                  <p className="font-mono text-lg font-medium tabular-nums text-ink">
                    {provider.price}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs leading-relaxed text-ink-soft">
              {featured.description}
            </p>
          </div>
        </div>
      </section>

      {/* How the board works — a real 3-step sequence */}
      <section id="how-it-works" className="scroll-mt-20 bg-paper py-xl">
        <div className="mx-auto max-w-container-max px-gutter">
          <h2 className="max-w-112 font-display text-3xl font-semibold text-ink">
            How the board works
          </h2>

          <ol className="mt-xl divide-y divide-line border-y border-line">
            {steps.map((step) => (
              <li
                key={step.number}
                className="flex flex-col gap-2 py-lg sm:flex-row sm:items-baseline sm:gap-8"
              >
                <span className="font-display text-3xl font-medium text-ink-soft sm:w-16 sm:shrink-0">
                  {step.number}
                </span>

                <div>
                  <h3 className="text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1 max-w-144 text-sm leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Verification stamps */}
      <section className="bg-paper-recessed py-xl">
        <div className="mx-auto max-w-container-max px-gutter">
          <h2 className="max-w-112 font-display text-3xl font-semibold text-ink">
            Three kinds of stamp
          </h2>
          <p className="mt-3 max-w-144 text-base leading-relaxed text-ink-soft">
            Every price on the board carries one of these. Look for it before
            you decide how much to trust a number.
          </p>

          <div className="mt-xl grid grid-cols-1 gap-lg md:grid-cols-3">
            {stamps.map((stamp) => (
              <div key={stamp.label} className="flex flex-col items-start">
                <div
                  className={`flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-double p-2 text-center ${stampColorClasses[stamp.color]} ${stamp.rotate}`}
                >
                  <span className="text-[0.65rem] font-semibold uppercase leading-tight tracking-wide">
                    {stamp.label}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  {stamp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter — a tear-off slip */}
      <section className="bg-paper py-xl">
        <div className="mx-auto max-w-container-max px-gutter">
          <div
            className="flex flex-col gap-lg border-t-2 border-dashed border-line pt-lg sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="max-w-112">
              <h3 className="font-display text-xl font-semibold text-ink">
                Get the monthly price report
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                One email a month with what's changed on the board for
                Bamenda. Nothing else.
              </p>
            </div>

            {subscribed ? (
              <p
                role="status"
                className="w-full max-w-88 rounded-sm border border-forest bg-paper-raised px-4 py-3 text-sm font-medium text-forest"
              >
                Added to the list — thanks for joining.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex w-full max-w-88 gap-2"
              >
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="h-auto flex-1 rounded-sm border-line bg-paper-raised px-3 py-2.5 text-sm"
                />

                <Button
                  type="submit"
                  className="rounded-sm bg-forest px-5 py-2.5 hover:bg-forest-deep"
                >
                  Join
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
