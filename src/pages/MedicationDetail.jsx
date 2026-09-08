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
        <div className="mx-auto max-w-xl rounded-xl border bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold">
            Medication not found
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            We couldn't find the medication you requested.
          </p>

          <Link
            to="/catalogue"
            className="
               inline-flex
               items-center
               gap-2
               rounded-lg
               border
               border-blue-600
               bg-blue-600
               px-4
               py-2
               text-sm
               font-semibold
               text-white
               shadow-sm
               transition
               duration-200
               hover: bg-blue-700
               hover: border-blue-700
               focus: outline-none
               focus: ring-2
               focus: ring-blue-500
               focus: ring-offset-2
               active: scale-95
              "
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
          className="inline-flex items-center rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ← Back to catalogue
        </Link>

        {/* Medication information */}
        <section className="mt-5 rounded-xl border bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6">

            <div>
              <p className="text-sm font-medium text-gray-500">
                {medication.category}
              </p>

              <h1 className="mt-2 break-words text-2xl font-bold text-gray-900 sm:text-4xl">
                {medication.name}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
                {medication.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Starting price
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {medication.price}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
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
              className="text-xl font-bold sm:text-2xl"
            >
              Compare prices
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Compare prices from different healthcare providers.
            </p>
          </div>

          <ComparisonTable
            providers={medication.providers}
          />
        </section>

        {/* Important information */}
        <section className="mt-8 rounded-xl border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">
            Price information
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Prices may change. Always confirm the current price
            with the healthcare provider before making a purchase.
          </p>
        </section>

      </div>
    </main>
  );
};

export default MedicationDetail;