import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/catalog/SearchBar";
import FilterBar from "../components/catalog/FilterBar";
import CatalogCard from "../components/catalog/CatalogCard";

const items = [
  {
    id: 1,
    name: "Paracetamol",
    category: "medication",
    location: "Bamenda",
    price: 500,
  },
  {
    id: 2,
    name: "Blood Test",
    category: "service",
    location: "Bamenda",
    price: 3000,
  },
  {
    id: 3,
    name: "Amoxicillin",
    category: "medication",
    location: "Bamenda",
    price: 1500,
  },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";

  const setSearch = (value) => {
    setSearchParams({
      search: value,
      category,
    });
  };

  const setCategory = (value) => {
    setSearchParams({
      search,
      category: value,
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-6 text-3xl font-bold">
        MediPrice Cameroon
      </h1>

      <div className="mb-6 flex gap-4">
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <FilterBar
          category={category}
          setCategory={setCategory}
        />
      </div>

      <div className="grid gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <CatalogCard
              key={item.id}
              item={item}
            />
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}