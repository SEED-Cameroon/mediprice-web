import { Clock, TriangleAlert } from "lucide-react";
import { formatDate } from "@/lib/format";
import { freshness } from "@/lib/pricing";

/**
 * How recently a price was checked, with a warning once it may be out of date.
 */
const Freshness = ({ date, className = "" }) => {
  const { label, stale } = freshness(date);
  const Icon = stale ? TriangleAlert : Clock;

  return (
    <span
      className={`inline-flex items-start gap-1.5 ${/\btext-(xs|sm|base|lg)\b/.test(className) ? "" : "text-sm"} ${stale ? "text-tertiary" : "text-on-surface-variant"} ${className}`}
      title={date ? formatDate(date) : undefined}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        {label}
        {stale && <span className="font-medium">. May be out of date</span>}
      </span>
    </span>
  );
};

export default Freshness;
