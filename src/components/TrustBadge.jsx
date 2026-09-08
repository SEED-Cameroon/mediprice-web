const TrustBadge = ({ status }) => {
  const badgeStyles = {
    "SEED-verified":
      "border-green-600 text-green-700 bg-green-50",

    "Provider-verified":
      "border-blue-600 text-blue-700 bg-blue-50",

    "Community-reported":
      "border-orange-600 text-orange-700 bg-orange-50",
  };

  const style =
    badgeStyles[status] ||
    "border-gray-500 text-gray-700 bg-gray-50";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
      aria-label={`Trust status: ${status || "Not verified"}`}
    >
      {status || "Not verified"}
    </span>
  );
};

export default TrustBadge;