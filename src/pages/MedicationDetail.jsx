import { useParams } from "react-router-dom";
import DetailHeader from "../components/detail/DetailHeader";
import ComparisonTable from "../components/detail/ComparisonTable";
import ProviderLocations from "../components/detail/ProviderLocations.jsx";

function MedicationDetail() {
  const { id } = useParams();

  const medication = {
    id,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    type: "Generic Tablet, 10 pack",
    verification: "Prices last verified in Bamenda area",
  };

  const providers = [
    {
      name: "Mile 2 Health Center",
      location: "Mile 2, Bamenda II",
      price: 450,
      trust: "Community Reported",
      updated: "1 week ago",
    },
    {
      name: "Bamenda Regional Hospital",
      location: "Commercial Avenue, City Center",
      price: 500,
      trust: "SEED Verified",
      updated: "2 days ago",
    },
    {
      name: "Pharmacy de la Paix",
      location: "Nkwen Street, Bamenda",
      price: 650,
      trust: "Provider Verified",
      updated: "1 day ago",
    },
    {
      name: "Holy Family Clinic",
      location: "Akum Village Exit",
      price: 700,
      trust: "Community Reported",
      updated: "4 hours ago",
    },
    {
      name: "Alpha Pharmacy",
      location: "Commercial Avenue",
      price: 1200,
      trust: "Provider Verified",
      updated: "3 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-8">

        <DetailHeader medication={medication} />

        <ComparisonTable providers={providers} />

        <ProviderLocations />
        
      </main>
    </div>
  );
}

export default MedicationDetail;