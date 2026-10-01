import BrowsePage from "../components/BrowsePage";
import catalog from "../data/catalog";
import images from "../data/images";

const filters = [
  {
    param: "type",
    label: "Type",
    getValue: (item) => (item.kind === "Medication" ? "Medications" : item.kind === "Lab test" ? "Lab tests" : "Care services"),
  },
];

const Search = () => (
  <BrowsePage
    title="Search prices"
    intro="Medications, lab tests and care services from providers across Bamenda."
    searchLabel="Search medications, tests and services"
    searchPlaceholder="What do you need? e.g. amoxicillin or blood count"
    items={catalog}
    filters={filters}
    noun="results"
    image={images.hero}
    showKind
  />
);

export default Search;
