import { BookOpen, ExternalLink } from "lucide-react";
import { formatFCFAExact } from "@/lib/format";

/**
 * Published survey prices for an item ("typical price in Cameroon").
 * Always shows the source, year and region, and says plainly that this is
 * not what a specific Bamenda provider charges.
 */
const ReferencePrices = ({ references = [], compact = false }) => {
  if (references.length === 0) return null;

  return (
    <section
      aria-labelledby="reference-heading"
      className="rounded-2xl bg-secondary/[0.06] p-5 ring-1 ring-secondary/25 sm:p-6"
    >
      <h2 id="reference-heading" className="flex items-center gap-2 text-lg font-bold text-on-surface">
        <BookOpen className="size-5 text-secondary" aria-hidden="true" />
        Typical price in Cameroon
      </h2>
      <p className="mt-1 text-base text-on-surface-variant">
        From published surveys. This is not the price at a specific Bamenda provider.
      </p>

      <ul className="mt-4 space-y-4">
        {references.map((ref, index) => (
          <li key={index} className={index > 0 ? "border-t border-secondary/20 pt-4" : ""}>
            <p className="text-on-surface">
              <span className="tabular text-2xl font-extrabold tracking-tight">{formatFCFAExact(ref.amount)}</span>{" "}
              <span className="text-base text-on-surface-variant">{ref.unit}</span>
            </p>
            <p className="mt-1 text-base text-on-surface">
              {ref.sector}. {ref.region}, {ref.year}.
            </p>
            {!compact && ref.note && <p className="mt-1 text-sm text-on-surface-variant">{ref.note}</p>}
            <a
              href={ref.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-secondary underline underline-offset-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Source: {ref.sourceTitle}
              <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReferencePrices;
