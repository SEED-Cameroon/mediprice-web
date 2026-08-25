function DetailHeader({ medication }) {
  return (
    <section className="mb-8">

      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-slate-500">
        <span>Medications</span>
        <span className="mx-2">›</span>
        <span>{medication.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {medication.name}
          </h1>

          <p className="mt-2 text-sm text-emerald-700">
            {medication.category} • {medication.type}
          </p>
        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
          {medication.verification}
        </div>

      </div>

    </section>
  );
}

export default DetailHeader;