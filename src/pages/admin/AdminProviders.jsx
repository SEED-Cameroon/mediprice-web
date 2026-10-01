import CollectionEditor from "../../components/admin/CollectionEditor";
import { PageHeader } from "../../components/admin/ui";
import { providersApi } from "@/services/admin";

const typeLabels = { pharmacy: "Pharmacy", lab: "Laboratory", hospital: "Hospital" };

/** Fields shared with the provider portal's "My details" form. */
// eslint-disable-next-line react-refresh/only-export-components
export const contactFields = [
  { name: "phone", label: "Phone number", required: true, type: "tel", inputMode: "tel", hint: "e.g. +237 6XX XXX XXX" },
  { name: "quarter", label: "Area / quarter", hint: "e.g. Nkwen" },
  { name: "address", label: "Address or directions", wide: true, hint: "e.g. Opposite Nkwen market, first floor" },
  { name: "lat", label: "Map latitude", type: "number", step: "any", hint: "Optional. From Google Maps.", get: (r) => r.location?.lat, set: () => ({}) },
  {
    name: "lng",
    label: "Map longitude",
    type: "number",
    step: "any",
    hint: "Optional. Gives exact directions.",
    get: (r) => r.location?.lng,
    set: (value, values) =>
      values.lat !== "" && value !== "" ? { location: { lat: Number(values.lat), lng: Number(value) } } : {},
  },
];

const providerFields = [
  { name: "name", label: "Name", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    default: "pharmacy",
    options: Object.entries(typeLabels).map(([value, label]) => ({ value, label })),
  },
  ...contactFields,
];

const AdminProviders = () => (
  <div className="space-y-6">
    <PageHeader
      title="Providers"
      intro="Pharmacies, labs and hospitals. Deleting one also removes its prices and unlinks its accounts."
    />
    <CollectionEditor
      api={providersApi}
      fields={providerFields}
      noun="provider"
      plural="providers"
      deleteWarning="Yes, delete it and its prices"
      describe={(record) => [typeLabels[record.type], record.quarter, record.phone].filter(Boolean).join(". ")}
    />
  </div>
);

export default AdminProviders;
