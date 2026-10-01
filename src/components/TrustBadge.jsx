import { Building2, CircleHelp, ShieldCheck, Users } from "lucide-react";

/**
 * The three trust levels a price can carry.
 *
 * Each level has a distinct icon shape AND a plain-language label, so it
 * reads without relying on color, and without needing to know what
 * "verified" means. Colors come from the palette's primary / secondary /
 * tertiary roles.
 */
export const trustLevels = {
  "SEED-verified": {
    label: "Checked by SEED",
    icon: ShieldCheck,
    circle: "bg-primary",
    dot: "bg-primary",
    summary: "Our team checked this price in person.",
    strength: "Most reliable",
  },
  "Provider-verified": {
    label: "Confirmed by provider",
    icon: Building2,
    circle: "bg-secondary",
    dot: "bg-secondary",
    summary: "The pharmacy or hospital told us this price.",
    strength: "Reliable",
  },
  "Community-reported": {
    label: "Reported by a patient",
    icon: Users,
    circle: "bg-tertiary-container",
    dot: "bg-tertiary-container",
    summary: "A patient shared this price from their receipt. Not yet checked.",
    strength: "Estimate",
  },
};

const unknownLevel = {
  label: "Not checked",
  icon: CircleHelp,
  circle: "bg-outline",
  dot: "bg-outline",
  summary: "We don't know where this price came from.",
  strength: "Unknown",
};

export const getTrustLevel = (status) => trustLevels[status] ?? unknownLevel;

/**
 * Trust status: a solid colored icon followed by a dark text label.
 * `showSummary` adds a one-line explanation underneath.
 */
const TrustBadge = ({ status, size = "md", showSummary = false }) => {
  const level = getTrustLevel(status);
  const Icon = level.icon;
  const small = size === "sm";

  return (
    <span className="inline-flex items-start gap-2">
      <span
        className={`flex shrink-0 items-center justify-center rounded-full text-white ${level.circle} ${small ? "size-5" : "size-6"}`}
        aria-hidden="true"
      >
        <Icon className={small ? "size-3" : "size-3.5"} strokeWidth={2.5} />
      </span>
      <span className="min-w-0">
        <span
          className={`block whitespace-nowrap font-semibold text-on-surface ${small ? "text-sm leading-5" : "text-[0.9375rem] leading-6"}`}
        >
          {level.label}
        </span>
        {showSummary && (
          <span className="block text-sm leading-5 text-on-surface-variant">{level.summary}</span>
        )}
      </span>
    </span>
  );
};

export default TrustBadge;
