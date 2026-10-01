import { ArrowDown, ArrowUp, Equal } from "lucide-react";
import { formatFCFA } from "@/lib/format";

const styles = {
  below: { icon: ArrowDown, className: "text-primary" },
  typical: { icon: Equal, className: "text-on-surface-variant" },
  above: { icon: ArrowUp, className: "text-error" },
};

/**
 * Says in words how a price compares with the typical price.
 * Icon + text, so it never relies on color alone.
 */
const FairPriceTag = ({ level, difference }) => {
  const { icon: Icon, className } = styles[level];

  const label =
    level === "typical"
      ? "Typical price"
      : `${formatFCFA(Math.abs(difference))} ${level === "below" ? "below" : "above"} typical`;

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${className}`}>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
};

export default FairPriceTag;
