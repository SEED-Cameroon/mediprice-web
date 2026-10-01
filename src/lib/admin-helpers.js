/** Trust badge options for admins. Providers can't choose: theirs is always "Confirmed by provider". */
export const BADGE_OPTIONS = [
  { value: "seed_verified", label: "Checked by SEED" },
  { value: "provider_verified", label: "Confirmed by provider" },
  { value: "community_reported", label: "Reported by a patient" },
];

/** Maps API badge values to the keys the public TrustBadge uses. */
export const badgeKey = (value) =>
  ({ seed_verified: "SEED-verified", provider_verified: "Provider-verified", community_reported: "Community-reported" })[value] ?? value;

/** Today's date as yyyy-mm-dd, for date inputs. */
export const todayIso = () => new Date().toISOString().slice(0, 10);
