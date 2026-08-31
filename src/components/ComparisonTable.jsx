const ComparisonTable = ({ providers = [] }) => {
  if (providers.length === 0) {
    return (
      <div
        className="rounded-lg border bg-white p-6 text-center"
        role="status"
      >
        <h2 className="font-semibold">
          No price comparisons available
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          There are currently no provider prices to compare.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="overflow-x-auto rounded-lg border bg-white"
        tabIndex="0"
        aria-label="Scrollable price comparison table"
      >
        <table className="w-full min-w-[600px] border-collapse text-left">
          <caption className="sr-only">
            Healthcare provider price comparison
          </caption>

          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-sm font-semibold"
              >
                Provider
              </th>

              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-sm font-semibold"
              >
                Price
              </th>

              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-sm font-semibold"
              >
                Trust
              </th>

              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-sm font-semibold"
              >
                Updated
              </th>
            </tr>
          </thead>

          <tbody>
            {providers.map((provider, index) => (
              <tr
                key={provider.id ?? index}
                className="border-t"
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  {provider.name ?? "Unknown provider"}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                  {provider.price ?? "Price unavailable"}
                </td>

                <td className="px-4 py-3 text-sm">
                  <span className="rounded-full border px-2 py-1 text-xs font-medium">
                    {provider.trust ?? "Not verified"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  {provider.updatedAt ?? "Not available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-gray-500 sm:hidden">
        Swipe left or right to view the full comparison table.
      </p>
    </div>
  );
};

export default ComparisonTable;