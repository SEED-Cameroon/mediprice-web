import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Scale, ShieldCheck, CheckCircle2, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const popularSearches = ["Paracetamol", "Malaria test", "Coartem"];

const howItWorks = [
  {
    icon: Search,
    title: "Search",
    description:
      "Find any medication or service in seconds using our comprehensive database of local providers.",
  },
  {
    icon: Scale,
    title: "Compare",
    description:
      "See real-time prices from providers across Bamenda and find the most affordable care options nearby.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    description:
      "Check the badge to know who verified the price and when it was last updated for total peace of mind.",
  },
];

const verificationLegend = [
  {
    icon: CheckCircle2,
    title: "SEED Verified",
    highlight: "SEED Team",
    description:
      "personally verified on-site or via direct audit. This is the highest level of trust.",
  },
  {
    icon: Shield,
    title: "Provider Verified",
    highlight: "pharmacy or hospital",
    description:
      "management directly confirmed and updated this price through their official portal.",
  },
  {
    icon: Users,
    title: "Community Reported",
    highlight: "User-submitted",
    description:
      "data from recent patient receipts. Unverified, but useful real-world context.",
  },
];

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
    navigate(search ? `/catalogue?search=${encodeURIComponent(search)}` : "/catalogue");
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
      {/* Hero */}
      <section className="hero-gradient relative flex min-h-[600px] items-center justify-center overflow-hidden bg-on-primary-container">
        <div className="relative z-10 flex w-full max-w-container-max flex-col items-center px-gutter py-xl text-center">
          <h1 className="mb-4 max-w-3xl font-display text-4xl font-black text-white sm:text-5xl">
            Find the best prices for health in Bamenda.
          </h1>

          <p className="mb-10 max-w-2xl text-lg text-white/90">
            Compare medication, lab tests, and care services across local
            pharmacies and hospitals in real-time.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-3xl flex-col gap-2 rounded-xl border border-white/20 bg-surface-container-lowest p-2 shadow-2xl sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2">
              <Search
                className="ml-2 size-5 shrink-0 text-outline"
                aria-hidden="true"
              />

              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a drug or service…"
                aria-label="Search a drug, lab test, or service"
                className="h-auto flex-1 border-none bg-transparent py-3 text-base text-on-surface shadow-none focus-visible:ring-0"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-lg px-8 py-6 sm:w-auto"
            >
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium uppercase tracking-wider text-white/70">
              Popular:
            </span>

            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => goToCatalogue(term)}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-on-primary-container"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-surface-container-low py-xl"
      >
        <div className="mx-auto max-w-container-max px-gutter">
          <div className="mb-xl flex flex-col items-center text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-on-surface">
              How it works: Trust the Badge
            </h2>

            <p className="max-w-2xl text-lg text-on-surface-variant">
              We bridge the gap between providers and patients with verified,
              transparent pricing data you can count on.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            {howItWorks.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-xl border border-outline-variant bg-surface-container-lowest p-lg transition-all hover:border-primary"
              >
                <div className="mb-md flex size-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container transition-transform group-hover:scale-110">
                  <Icon className="size-7" aria-hidden="true" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-on-surface">
                  {title}
                </h3>

                <p className="text-sm text-on-surface-variant">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification legend */}
      <section className="bg-surface-container-lowest py-xl">
        <div className="mx-auto max-w-container-max px-gutter">
          <div className="rounded-2xl border border-outline-variant bg-surface-bright p-lg md:p-xl">
            <h2 className="mb-xl border-b border-outline-variant pb-4 font-display text-xl font-bold text-on-surface">
              Verification Legend
            </h2>

            <div className="grid grid-cols-1 gap-xl lg:grid-cols-3">
              {verificationLegend.map(
                ({ icon: Icon, title, highlight, description }) => (
                  <div key={title} className="flex items-start gap-md">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>

                    <div>
                      <h4 className="mb-1 text-base font-bold text-on-surface">
                        {title}
                      </h4>

                      <p className="text-sm leading-relaxed text-on-surface-variant">
                        This price has been{" "}
                        <span className="font-bold text-primary">
                          {highlight}
                        </span>{" "}
                        {description}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="border-y border-primary/10 bg-primary-container/20 py-xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-lg px-gutter md:flex-row">
          <div className="max-w-[36rem] text-center md:text-left">
            <h3 className="mb-2 font-display text-xl font-bold text-on-primary-container">
              Want to save more on healthcare?
            </h3>

            <p className="text-sm text-on-surface-variant">
              Sign up for our monthly health transparency report for Bamenda.
              No spam, just savings.
            </p>
          </div>

          {subscribed ? (
            <p
              role="status"
              className="w-full max-w-[24rem] rounded-lg border border-primary bg-surface-container-lowest px-4 py-3 text-center text-sm font-medium text-primary"
            >
              You're on the list — thanks for joining!
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-[24rem] gap-2"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                className="h-auto flex-1 rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm"
              />

              <Button type="submit" className="rounded-lg px-6 py-2.5">
                Join
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
