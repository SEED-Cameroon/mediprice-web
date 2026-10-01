import BrowsePage from "../components/BrowsePage";
import images from "../data/images";
import useApiFetch from "@/hooks/useApiFetch";
import { listAll } from "@/services/catalog";

const filters = [
  {
    param: "type",
    label: "Type",
    getValue: (item) => (item.kind === "Medication" ? "Medicines" : item.kind === "Lab test" ? "Lab tests" : "Care services"),
  },
];

const Search = () => {
  const { data, status, error, reload } = useApiFetch(() => listAll(), []);

  return (
    <BrowsePage
      title="Search prices"
      intro="Medicines, lab tests and care services from providers across Bamenda."
      searchLabel="Search medicines, tests and services"
      searchPlaceholder="What do you need? e.g. amoxicillin or blood count"
      items={data ?? []}
      filters={filters}
      noun="results"
      showKind
      image={images.hero}
      status={status}
      errorMessage={error?.message}
      onRetry={reload}
    />
  );
};

export default Search;
