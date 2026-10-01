import { useParams } from "react-router-dom";
import ItemDetail, { ItemDetailError, ItemDetailSkeleton } from "../components/ItemDetail";
import NotFound from "./NotFound";
import useApiFetch from "@/hooks/useApiFetch";
import { getService } from "@/services/catalog";

const ServiceDetail = () => {
  const { id } = useParams();
  const { data, status, error, reload } = useApiFetch(() => getService(id), [id]);

  if (status === "loading") return <ItemDetailSkeleton />;

  if (status === "error") {
    return error.status === 404 ? (
      <NotFound
        title="We couldn't find that test or service"
        message="It may have been removed, or the link may be wrong. Search lab tests and services instead."
        linkTo="/labs-services"
        linkLabel="Browse lab tests and services"
      />
    ) : (
      <ItemDetailError message={error.message} onRetry={reload} />
    );
  }

  return <ItemDetail key={data.key} item={data} backTo="/labs-services" backLabel="All lab tests and services" />;
};

export default ServiceDetail;
