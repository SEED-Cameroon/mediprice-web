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
