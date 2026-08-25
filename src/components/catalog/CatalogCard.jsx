export default function CatalogCard({ item }) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{item.name}</h2>
      <p className="text-gray-600">{item.category}</p>
      <p className="mt-2">{item.location}</p>
      <p className="mt-2 font-medium">{item.price} FCFA</p>
    </div>
  );
}