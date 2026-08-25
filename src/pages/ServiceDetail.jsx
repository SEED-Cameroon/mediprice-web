import { useParams } from "react-router-dom";
import DetailHeader from "../components/detail/DetailHeader";
import ComparisonTable from "../components/detail/ComparisonTable";
import ProviderLocations from "../components/detail/ProviderLocations.jsx";

function ServiceDetail() {
  const { id } = useParams();

  const service = {
    id,
    name: "Complete Blood Count",
    category: "Diagnostics",
    type: "Lab Test",
    verification: "Prices last verified in Bamenda area",
  };

  const providers = [
    {
      name: "Bamenda Regional Hospital",
      location: "Commercial Avenue, City Center",
      price: 4000,
      trust: "SEED Verified",
      updated: "2 days ago",
    },
    {
      name: "Mile 2 Health Center",
      location: "Mile 2, Bamenda II",
      price: 4500,
      trust: "Provider Verified",
      updated: "1 week ago",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-8">

        <DetailHeader medication={service} />

        <ComparisonTable providers={providers} />

        <ProviderLocations />

      </main>
    </div>
  );
}

export default ServiceDetail;