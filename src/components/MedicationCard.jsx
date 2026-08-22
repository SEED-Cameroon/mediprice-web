export default function MedicationCard({ medication }) {
  return (
    <article
      tabIndex="0"
      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      <h2 className="font-semibold text-gray-900">
        {medication.name}
      </h2>

      <p className="mt-2 text-gray-600">
        {medication.description}
      </p>

      <div className="mt-4">
        <span className="text-sm font-medium text-gray-700">
          Trust status:
        </span>

        <span className="ml-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
          {medication.trust}
        </span>
      </div>
    </article>
  )
}