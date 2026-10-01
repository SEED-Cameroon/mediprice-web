import BrowsePage from "../components/BrowsePage";
import images from "../data/images";
import useApiFetch from "@/hooks/useApiFetch";
import { listMedications } from "@/services/catalog";

const filters = [{ param: "category", label: "Category", getValue: (item) => item.category }];

const Catalogue = () => {
  const { data, status, error, reload } = useApiFetch(() => listMedications(), []);

  return (
    <BrowsePage
      title="Medication prices in Bamenda"
      intro="The lowest price we've found for each medicine, and where to get it. Open a medicine to compare every pharmacy."
      searchLabel="Search medicines"
      searchPlaceholder="Medicine name, e.g. paracetamol or Coartem"
      items={data ?? []}
      filters={filters}
      noun="medicines"
      image={images.Medication}
      crossLink={{ label: "Search lab tests and services instead", to: "/labs-services" }}
      status={status}
      errorMessage={error?.message}
      onRetry={reload}
    />
  );
};

export default Catalogue;
