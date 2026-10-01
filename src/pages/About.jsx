import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import TrustBadge from "../components/TrustBadge";
import images from "../data/images";
import usePageMeta from "@/hooks/usePageMeta";

const sourcingSteps = [
  {
    title: "We collect prices",
    description:
      "Our team visits pharmacies, labs and hospitals across Bamenda and records what they charge. Providers can also send us their own price lists, and patients can share what they paid.",
  },
  {
    title: "We label where each price came from",
    description:
      "Every price is tagged with its source and the date it was last checked, so you can judge how much to rely on it.",
  },
  {
    title: "We keep checking",
    description:
      "Prices are rechecked regularly. When a provider's price changes, the old price is replaced and the date is updated.",
  },
];

const trustTiers = [
  {
    status: "SEED-verified",
    title: "The most reliable",
    description:
      "A member of the SEED team confirmed this price in person at the provider, or through a direct audit of their price list.",
  },
  {
    status: "Provider-verified",
    title: "Reliable",
    description:
      "The pharmacy, lab or hospital's management confirmed this price with us directly.",
  },
  {
    status: "Community-reported",
    title: "A useful estimate",
    description:
      "A patient shared this price from a recent receipt. We haven't confirmed it yet, so it may be out of date.",
  },
];

const About = () => {
  usePageMeta({
    title: "How MediPrice checks prices",
    description: "Why MediPrice exists, where the prices come from, and what each trust badge means.",
  });
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView({ block: "start" });
  }, [hash]);

  return (
    <>
      <header className="relative isolate overflow-hidden bg-on-primary-fixed text-white">
        <img src={images.about.src} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-on-primary-fixed/95 via-on-primary-fixed/80 to-on-primary-fixed/30"
        />
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">Why MediPrice exists</h1>
          <div className="mt-6 max-w-[38rem] space-y-4 text-lg leading-8 text-white/90">
            <p>
              In Bamenda, the price of the same medicine or test can change a
              lot from one provider to the next, and most people only find out
              at the counter. For families paying out of pocket, that
              difference matters.
            </p>
            <p>
              MediPrice collects those prices in one place and shows where each
              one came from, so you can choose where to go before you leave home.
            </p>
          </div>
        </div>
      </header>

    <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
      {/* Sourcing */}
      <section aria-labelledby="sourcing" className="pt-14 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <h2 id="sourcing" className="text-2xl font-bold tracking-tight text-on-surface">
              Where the prices come from
            </h2>
          </div>

          <ol className="space-y-8">
            {sourcingSteps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-x-3">
                <span
                  className="tabular flex size-8 items-center justify-center rounded-full bg-on-surface text-sm font-bold text-surface-container-lowest"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold leading-8 text-on-surface">
                    {step.title}
                  </h3>
                  <p className="mt-1 max-w-prose text-base leading-7 text-on-surface-variant">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Badges */}
      <section
        id="badges"
        aria-labelledby="badges-heading"
        className="mt-16 scroll-mt-24 border-t border-outline-variant pt-12 sm:mt-20"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <h2 id="badges-heading" className="text-2xl font-bold tracking-tight text-on-surface">
              What the badges mean
            </h2>
            <p className="mt-3 text-base leading-7 text-on-surface-variant">
              Every price carries one of three badges. They tell you who
              confirmed the price, not whether it is cheap.
            </p>
          </div>

          <ul className="divide-y divide-outline-variant overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/70">
            {trustTiers.map((tier) => (
              <li key={tier.status} className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <TrustBadge status={tier.status} />
                  <p className="font-semibold text-on-surface">{tier.title}</p>
                </div>
                <p className="mt-3 max-w-prose text-base leading-7 text-on-surface-variant">
                  {tier.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Caveat + SEED */}
      <section className="mt-16 grid gap-6 border-t border-outline-variant pt-12 sm:mt-20 md:grid-cols-2">
        <div className="rounded-lg bg-surface-container-low p-6">
          <h2 className="text-lg font-bold text-on-surface">
            Always confirm before you pay
          </h2>
          <p className="mt-2 text-base leading-7 text-on-surface-variant">
            Prices can change between our checks. Treat MediPrice as a guide,
            and confirm the price with the provider before buying.
          </p>
        </div>
        <div className="rounded-lg bg-surface-container-low p-6">
          <h2 className="text-lg font-bold text-on-surface">Run by SEED Cameroon</h2>
          <p className="mt-2 text-base leading-7 text-on-surface-variant">
            MediPrice is a SEED Cameroon initiative to make the cost of
            healthcare in the North West region easier to see and compare.
          </p>
        </div>
      </section>

      <div className="mt-12">
        <Link
          to="/medications"
          className="inline-flex h-12 items-center rounded-lg bg-primary px-6 text-base font-semibold text-on-primary hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Compare medication prices
        </Link>
      </div>
    </div>
    </>
  );
};

export default About;
