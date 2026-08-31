import MedicationCard from "../components/MedicationCard";
import medications from "../data/medications";

const Catalogue = () => {
  return (
    <main className="w-full px-4 py-6">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold">
          Medication Catalogue
        </h1>

        {medications.length === 0 ? (
          <div
            className="rounded-lg border p-6 text-center"
            role="status"
          >
            <h2 className="text-lg font-semibold">
              No medications available
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              There are currently no medications to display.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {medications.map((medication) => (
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