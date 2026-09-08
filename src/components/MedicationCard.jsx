import { Link } from "react-router-dom";
import TrustBadge from "./TrustBadge";

const MedicationCard = ({ medication }) => {
  if (!medication) {
    return (
      <div className="rounded-lg border border-outline-variant p-4">
        <p>Medication information unavailable.</p>
      </div>
    );
  }

  return (
    <article className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="break-words text-lg font-semibold text-on-surface">
            {medication.name}
          </h2>

          {medication.description && (
            <p className="mt-1 break-words text-sm text-on-surface-variant">
              {medication.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-on-surface">
            {medication.price ?? "Price unavailable"}
          </span>

          <TrustBadge status={medication.trust} />
        </div>

        <Link
          to={`/medication/${medication.id}`}
          className="block w-full rounded-md bg-primary px-4 py-2 text-center text-on-primary transition hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          View details
        </Link>
      </div>
    </article>
  );
};

export default MedicationCard;