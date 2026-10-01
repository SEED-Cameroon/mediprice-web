import PricesManager from "../../components/admin/PricesManager";
import { PageHeader } from "../../components/admin/ui";

const AdminPrices = () => (
  <div className="space-y-6">
    <PageHeader
      title="Prices"
      intro="Every price on MediPrice. Change a price, mark it as checked again, or see who changed it and when."
    />
    <PricesManager isAdmin />
  </div>
);

export default AdminPrices;
