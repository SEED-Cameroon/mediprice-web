import { getTrustLevel } from "@/lib/trust";

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
