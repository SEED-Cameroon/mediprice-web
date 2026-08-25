export default function FilterBar({ category, setCategory }) {
  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="rounded-lg border p-3"
    >
      <option value="all">All</option>
      <option value="medication">Medication</option>
      <option value="service">Service</option>
    </select>
  );
}