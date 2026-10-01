import BrowsePage from "../components/BrowsePage";
import images from "../data/images";
import useApiFetch from "@/hooks/useApiFetch";
import { listMedications } from "@/services/catalog";
import usePageMeta from "@/hooks/usePageMeta";

const filters = [{ param: "category", label: "Category", getValue: (item) => item.category }];

const Catalogue = () => {
  usePageMeta({
    title: "Medicine prices in Bamenda",
    description: "Compare what pharmacies in Bamenda charge for common medicines, and see who checked each price.",
    canonicalPath: "/medications",
  });
  const { data, status, error, reload } = useApiFetch(() => listMedications(), []);

  return (
    <BrowsePage
      title="Medication prices in Bamenda"
      intro="The lowest price we've found for each medicine, and where to get it. Open a medicine to compare every pharmacy."
      searchLabel="Search medicines"
      searchPlaceholder="Search a medicine"
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
