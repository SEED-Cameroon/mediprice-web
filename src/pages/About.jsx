import { Database, ShieldCheck, PiggyBank } from "lucide-react";
import TrustBadge from "../components/TrustBadge";

const steps = [
  {
    icon: Database,
    title: "1. We source prices",
    description:
      "We continuously gather pricing data from local pharmacies, diagnostic labs, and hospitals across Bamenda.",
  },
  {
    icon: ShieldCheck,
    title: "2. We verify data",
    description:
      "Every price point is passed through our trust-badge system to check its reliability and accuracy.",
  },
  {
    icon: PiggyBank,
    title: "3. You save",
    description:
      "You compare verified prices, choose the best option for your budget, and spend less on healthcare.",
  },
];

const trustTiers = [
  {
    status: "SEED-verified",
    title: "Highest trust",
    description:
      "Prices checked and verified by the SEED team on-site. This data is guaranteed accurate at the time of verification.",
  },
  {
    status: "Provider-verified",
    title: "High trust",
    description:
      "Prices confirmed directly by the pharmacy or hospital management through their own listing.",
  },
  {
    status: "Community-reported",
    title: "Estimate",
    description:
      "Unverified prices submitted by patients. Useful as a baseline, but may be out of date.",
  },
];

const About = () => {
  return (
    <main className="flex flex-col">
      {/* Mission */}
      <section className="bg-surface-container-low py-xl">
        <div className="mx-auto max-w-3xl px-gutter">
          <h1 className="mb-lg font-display text-display-lg font-bold text-on-surface">
            Our mission: healthcare transparency for Bamenda.
          </h1>

          <p className="mb-lg text-body-lg text-on-surface-variant">
            At MediPrice Cameroon, we believe access to accurate pricing
            information is a fundamental right. In Bamenda and across the
            region, fluctuating costs for essential medications and
            procedures create a real financial burden. Our platform helps
            people make informed decisions with clear, verifiable data —
            reducing anxiety and healthcare costs alike.
          </p>

          <p className="text-body-lg text-on-surface-variant">
            We're building a centralized resource for medical pricing you
            can trust when it matters most.
          </p>
        </div>
      </section>

      {/* How MediPrice works */}
      <section className="border-y border-outline-variant bg-surface-container-lowest py-xl">
        <div className="mx-auto max-w-container-max px-gutter">
          <div className="mb-xl text-center">
            <h2 className="mb-2 font-display text-headline-lg font-bold text-on-surface">
              How MediPrice works
            </h2>
            <p className="mx-auto max-w-2xl text-body-lg text-on-surface-variant">
              Three steps to finding the best healthcare prices.
            </p>
          </div>

          <div className="relative grid gap-lg md:grid-cols-3">
            <div
              aria-hidden="true"
              className="absolute left-[15%] right-[15%] top-8 hidden h-px bg-outline-variant md:block"
            />

            {steps.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="relative flex flex-col items-center rounded-xl border border-outline-variant bg-surface p-lg text-center"
              >
                <div className="mb-lg flex size-16 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-surface-container-high text-primary shadow-sm">
                  <Icon className="size-7" aria-hidden="true" />
                </div>

                <h3 className="mb-2 font-display text-title-md font-bold text-on-surface">
                  {title}
                </h3>

                <p className="text-body-sm text-on-surface-variant">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badge system */}
      <section className="py-xl">
        <div className="mx-auto max-w-container-max px-gutter">
          <div className="grid gap-xl md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="mb-2 font-display text-headline-lg font-bold text-on-surface">
                What each badge means
              </h2>

              <p className="text-body-lg text-on-surface-variant">
                We combine data straight from providers with data reported by
                the community, so every price on MediPrice carries one of
                these three trust levels.
              </p>
            </div>

            <div className="flex flex-col gap-md md:col-span-8">
              {trustTiers.map(({ status, title, description }) => (
                <div
                  key={status}
                  className="flex flex-col items-start gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md sm:flex-row sm:items-center"
                >
                  <div className="shrink-0">
                    <TrustBadge status={status} />
                  </div>

                  <p className="text-body-sm text-on-surface">
                    <strong className="font-semibold text-on-background">
                      {title}:
                    </strong>{" "}
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
