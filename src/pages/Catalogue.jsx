import { useSearchParams } from "react-router-dom";
import MedicationCard from "../components/MedicationCard";
import medications from "../data/Medications";

const Catalogue = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";

  const filteredMedications = search
    ? medications.filter((medication) => {
        const term = search.toLowerCase();
        return (
          medication.name.toLowerCase().includes(term) ||
          medication.category?.toLowerCase().includes(term)
        );
      })
    : medications;

  return (
    <main className="w-full px-4 py-6">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold">
          Medication Catalogue
        </h1>

        {search && (
          <p className="mb-4 text-sm text-on-surface-variant">
            {filteredMedications.length > 0
              ? `${filteredMedications.length} result${filteredMedications.length === 1 ? "" : "s"} for "${search}"`
              : `No results for "${search}"`}
          </p>
        )}

        {filteredMedications.length === 0 ? (
          <div
            className="rounded-lg border p-6 text-center"
            role="status"
          >
            <h2 className="text-lg font-semibold">
              {search ? "No matching medications" : "No medications available"}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {search
                ? "Try a different name or category."
                : "There are currently no medications to display."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMedications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Catalogue;