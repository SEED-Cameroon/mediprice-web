import BrowsePage from "../components/BrowsePage";
import catalog from "../data/catalog";
import images from "../data/images";

const medications = catalog.filter((item) => item.kind === "Medication");

const filters = [{ param: "category", label: "Category", getValue: (item) => item.category }];

const Catalogue = () => (
  <BrowsePage
    title="Medication prices in Bamenda"
    intro="The lowest price we've found for each medicine, and where to get it. Open a medication to compare every pharmacy."
    searchLabel="Search medications"
    searchPlaceholder="Medicine name, e.g. paracetamol or Coartem"
    items={medications}
    filters={filters}
    noun="medications"
    image={images.Medication}
    crossLink={{ label: "Search lab tests and services instead", to: "/services" }}
  />
);

export default Catalogue;
