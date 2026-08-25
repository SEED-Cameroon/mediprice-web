import TrustBadge from "./TrustBadge";

function ProviderRow({ provider }) {
  return (
    <div className="grid grid-cols-1 gap-3 border-t border-slate-200 px-5 py-4 md:grid-cols-5 md:items-center md:gap-4">

      {/* Provider */}
      <div>
        <p className="font-semibold text-slate-800">
          {provider.name}
        </p>

        <p className="text-xs text-slate-500">
          {provider.location}
        </p>
      </div>

      {/* Price */}
      <div className="font-semibold text-emerald-700">
        {provider.price.toLocaleString()} FCFA
      </div>

      {/* Trust */}
      <div>
        <TrustBadge trust={provider.trust} />
      </div>

      {/* Updated */}
      <div className="text-sm text-slate-500">
        {provider.updated}
      </div>

      {/* Add */}
      <div>
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer"
          aria-label={`Add ${provider.name} to comparison`}
        />
      </div>

    </div>
  );
}

export default ProviderRow;