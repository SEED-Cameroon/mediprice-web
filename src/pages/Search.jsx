import BrowsePage from "../components/BrowsePage";
import images from "../data/images";
import useApiFetch from "@/hooks/useApiFetch";
import { listAll } from "@/services/catalog";
import usePageMeta from "@/hooks/usePageMeta";

const filters = [
  {
    param: "type",
    label: "Type",
    getValue: (item) => (item.kind === "Medication" ? "Medicines" : item.kind === "Lab test" ? "Lab tests" : "Care services"),
  },
];

const Search = () => {
  usePageMeta({ title: "Search prices", noindex: true });
  const { data, status, error, reload } = useApiFetch(() => listAll(), []);

  return (
    <BrowsePage
      title="Search prices"
      intro="Medicines, lab tests and care services from providers across Bamenda."
      searchLabel="Search medicines, tests and services"
      searchPlaceholder="Search a medicine or test"
      items={data ?? []}
      filters={filters}
      noun="results"
      showKind
      image={images.hero}
      autoFocusSearch
      status={status}
      errorMessage={error?.message}
      onRetry={reload}
    />
  );
};

export default Search;
