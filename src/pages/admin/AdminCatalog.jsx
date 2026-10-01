import { useState } from "react";
import CollectionEditor from "../../components/admin/CollectionEditor";
import { PageHeader } from "../../components/admin/ui";
import { medicationsApi, servicesApi } from "@/services/admin";

const medicationFields = [
  { name: "name", label: "Name, with strength", required: true, hint: "e.g. Paracetamol 500mg" },
  { name: "genericName", label: "Generic name", hint: "e.g. Paracetamol" },
  { name: "category", label: "Category", required: true, hint: "e.g. Pain relief" },
  { name: "form", label: "What one price is for", hint: "e.g. Tablets, pack of 10" },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "requiresPrescription", label: "Needs a prescription", type: "checkbox" },
];

const serviceFields = [
  { name: "name", label: "Name", required: true, hint: "e.g. Full blood count" },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    default: "lab",
    options: [
      { value: "lab", label: "Lab test" },
      { value: "care", label: "Care service" },
    ],
  },
  { name: "category", label: "Category", required: true, hint: "e.g. Blood tests" },
  { name: "description", label: "Description", type: "textarea", required: true },
];

const tabs = [
  { value: "medication", label: "Medicines" },
  { value: "service", label: "Tests and services" },
];

const AdminCatalog = () => {
  const [tab, setTab] = useState("medication");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medicines, tests and services"
        intro="What people can search for. Deleting one also removes its prices (their history is kept)."
      />
      <div role="group" aria-label="Show" className="inline-flex rounded-xl bg-surface-container-low p-1">
        {tabs.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={tab === option.value}
            onClick={() => setTab(option.value)}
            className={`h-11 rounded-lg px-4 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              tab === option.value ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {tab === "medication" ? (
        <CollectionEditor
          key="medication"
          api={medicationsApi}
          fields={medicationFields}
          noun="medicine"
          plural="medicines"
          deleteWarning="Yes, delete it and its prices"
          describe={(record) =>
            [record.category, record.form, record.requiresPrescription && "Prescription needed", `${record.prices?.length ?? 0} prices`]
              .filter(Boolean)
              .join(". ")
          }
        />
      ) : (
        <CollectionEditor
          key="service"
          api={servicesApi}
          fields={serviceFields}
          noun="test or service"
          plural="tests and services"
          deleteWarning="Yes, delete it and its prices"
          describe={(record) =>
            [record.type === "lab" ? "Lab test" : "Care service", record.category, `${record.prices?.length ?? 0} prices`].join(". ")
          }
        />
      )}
    </div>
  );
};

export default AdminCatalog;
