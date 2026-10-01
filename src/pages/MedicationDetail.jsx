import { useParams } from "react-router-dom";
import ItemDetail from "../components/ItemDetail";
import catalog from "../data/catalog";
import NotFound from "./NotFound";

const MedicationDetail = () => {
  const { id } = useParams();
  const medication = catalog.find((item) => item.key === `medication-${id}`);

  if (!medication) {
    return (
      <NotFound
        title="We couldn't find that medication"
        message="It may have been removed, or the link may be wrong. Search the medication list instead."
        linkTo="/catalogue"
        linkLabel="Browse medications"
      />
    );
  }

  return <ItemDetail key={medication.key} item={medication} backTo="/catalogue" backLabel="All medications" />;
};

export default MedicationDetail;
