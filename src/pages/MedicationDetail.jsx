import { Link, useParams } from "react-router-dom";
import ComparisonTable from "../components/ComparisonTable";
import TrustBadge from "../components/TrustBadge";
import medications from "../data/Medications";

const MedicationDetail = () => {
  const { id } = useParams();

  const medication = medications.find(
    (item) => item.id === Number(id)
  );

  if (!medication) {
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-96 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-on-surface">
            Medication not found
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            We couldn't find the medication you requested.
          </p>

          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition duration-200 hover:bg-on-primary-fixed-variant hover:border-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
          >
            <span aria-hidden="true">⬅️</span>
            Back to catalogue
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">

        {/* Back link */}
        <Link
          to="/catalogue"
          className="inline-flex items-center rounded-md px-2 py-1 text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          ← Back to catalogue
        </Link>

        {/* Medication information */}
        <section className="mt-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6">

            <div>
              <p className="text-sm font-medium text-on-surface-variant">
                {medication.category}
              </p>

              <h1 className="mt-2 break-words text-2xl font-bold text-on-surface sm:text-4xl">
                {medication.name}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-on-surface-variant sm:text-base">
                {medication.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-outline-variant pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-on-surface-variant">
                  Starting price
                </p>

                <p className="mt-1 text-2xl font-bold text-on-surface">
                  {medication.price}
                </p>
              </div>

              <div>
                <p className="text-sm text-on-surface-variant">
                  Trust status
                </p>

                <div className="mt-1">
                  <TrustBadge status={medication.trust} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price comparison */}
        <section
          className="mt-8"
          aria-labelledby="price-comparison"
        >
          <div className="mb-4">
            <h2
              id="price-comparison"
              className="text-xl font-bold text-on-surface sm:text-2xl"
            >
              Compare prices
            </h2>

            <p className="mt-1 text-sm text-on-surface-variant">
              Compare prices from different healthcare providers.
            </p>
          </div>

          <ComparisonTable
            providers={medication.providers}
          />
        </section>

        {/* Important information */}
        <section className="mt-8 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-on-surface">
            Price information
          </h2>

          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Prices may change. Always confirm the current price
            with the healthcare provider before making a purchase.
          </p>
        </section>

      </div>
    </main>
  );
};

export default MedicationDetail;