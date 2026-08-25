import { Link, useSearchParams } from "react-router-dom";

function Medications() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const medications = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      description: "Used for pain and fever relief.",
      price: 450,
    },
    {
      id: 2,
      name: "Ibuprofen 400mg",
      category: "Pain Relief",
      description: "Used for pain, inflammation and fever.",
      price: 700,
    },
    {
      id: 3,
      name: "Amoxicillin 500mg",
      category: "Antibiotics",
      description: "An antibiotic medication.",
      price: 1200,
    },
    {
      id: 4,
      name: "Artemether 20mg",
      category: "Antimalarial",
      description: "Used in the treatment of malaria.",
      price: 1500,
    },
  ];

  const filteredMedications = medications.filter((medication) =>
    medication.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-8">

          <p className="text-sm font-medium text-emerald-600">
            MediPrice
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Medications
          </h1>

          <p className="mt-2 text-slate-600">
            Find and compare medication prices from healthcare providers.
          </p>

        </div>
      </section>

      {/* Search */}
      <section className="mx-auto max-w-6xl px-6 py-8">

        <div className="rounded-xl bg-white p-5 shadow-sm">

          <label
            htmlFor="medication-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Search medications
          </label>

          <input
            id="medication-search"
            type="text"
            defaultValue={search}
            placeholder="Search for a medication..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

        </div>

        {/* Results */}
        <div className="mt-8">

          {search && (
            <p className="mb-5 text-slate-600">
              Results for{" "}
              <span className="font-semibold text-slate-900">
                "{search}"
              </span>
            </p>
          )}

          {filteredMedications.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                No medications found
              </h2>

              <p className="mt-2 text-slate-500">
                Try searching for another medication.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">

              {filteredMedications.map((medication) => (
                <div
                  key={medication.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {medication.name}
                      </h2>

                      <p className="mt-1 text-sm text-emerald-600">
                        {medication.category}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Available
                    </span>

                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {medication.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">

                    <div>
                      <p className="text-xs text-slate-500">
                        Lowest available price
                      </p>

                      <p className="text-lg font-bold text-emerald-600">
                        {medication.price.toLocaleString()} FCFA
                      </p>
                    </div>

                    <Link
                      to={`/medications/${medication.id}`}
                      className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
                    >
                      View Details
                    </Link>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </section>

    </div>
  );
}

export default Medications;