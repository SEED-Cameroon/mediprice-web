function TrustBadge({ trust }) {
  const badgeStyles = {
    "SEED Verified": "bg-emerald-50 text-emerald-700",
    "Provider Verified": "bg-blue-50 text-blue-700",
    "Community Reported": "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
        badgeStyles[trust] || "bg-slate-100 text-slate-700"
      }`}
    >
      <span aria-hidden="true">●</span>
      {trust}
    </span>
  );
}

export default TrustBadge;