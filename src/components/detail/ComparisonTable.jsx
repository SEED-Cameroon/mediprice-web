import ProviderRow from "./ProviderRow";

function ComparisonTable({ providers }) {
  return (
    <section className="mb-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* Table header */}
      <div className="hidden grid-cols-5 gap-4 bg-slate-100 px-5 py-4 text-xs font-semibold uppercase text-slate-600 md:grid">
        <span>Provider</span>
        <span>Price (FCFA)</span>
        <span>Trust Badge</span>
        <span>Updated</span>
        <span>Add</span>
      </div>

      {/* Provider rows */}
      <div>
        {providers.map((provider) => (
          <ProviderRow
            key={provider.name}
            provider={provider}
          />
        ))}
      </div>

    </section>
  );
}

export default ComparisonTable;