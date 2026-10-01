import { useParams } from "react-router-dom";
import ItemDetail from "../components/ItemDetail";
import catalog from "../data/catalog";
import NotFound from "./NotFound";

const ServiceDetail = () => {
  const { id } = useParams();
  const service = catalog.find((item) => item.key === `service-${id}`);

  if (!service) {
    return (
      <NotFound
        title="We couldn't find that service"
        message="It may have been removed, or the link may be wrong. Search lab tests and services instead."
        linkTo="/services"
        linkLabel="Browse lab tests and services"
      />
    );
  }

  return <ItemDetail key={service.key} item={service} backTo="/services" backLabel="All lab tests and services" />;
};

export default ServiceDetail;
