export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search medications or services..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-lg border p-3"
    />
  );
}