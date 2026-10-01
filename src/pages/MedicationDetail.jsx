import { useParams } from "react-router-dom";
import ItemDetail, { ItemDetailError, ItemDetailSkeleton } from "../components/ItemDetail";
import NotFound from "./NotFound";
import useApiFetch from "@/hooks/useApiFetch";
import { getMedication } from "@/services/catalog";

const MedicationDetail = () => {
  const { id } = useParams();
  const { data, status, error, reload } = useApiFetch(() => getMedication(id), [id]);

  if (status === "loading") return <ItemDetailSkeleton />;

  if (status === "error") {
    return error.status === 404 ? (
      <NotFound
        title="We couldn't find that medicine"
        message="It may have been removed, or the link may be wrong. Search the medicine list instead."
        linkTo="/medications"
        linkLabel="Browse medicines"
      />
    ) : (
      <ItemDetailError message={error.message} onRetry={reload} />
    );
  }

  return <ItemDetail key={data.key} item={data} backTo="/medications" backLabel="All medicines" />;
};

export default MedicationDetail;
