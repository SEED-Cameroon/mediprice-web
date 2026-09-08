import { useParams } from "react-router-dom";
import ComparisonTable from "../components/ComparisonTable";

const ServiceDetail = () => {
  const { id } = useParams();

  const service = {
    id,
    name: "Malaria Test",
    description:
      "A laboratory test used to check for malaria infection.",
    category: "Laboratory Test",
  };

  const providers = [
    {
      id: 1,
      name: "Provider A",
      price: "2,000 FCFA",
      trust: "SEED-verified",
      updatedAt: "Today",
    },
    {
      id: 2,
      name: "Provider B",
      price: "2,500 FCFA",
      trust: "Provider-verified",
      updatedAt: "Yesterday",
    },
    {
      id: 3,
      name: "Provider C",
      price: "1,800 FCFA",
      trust: "Community-reported",
      updatedAt: "2 days ago",
    },
  ];

  return (
    <main className="w-full px-4 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <p className="text-sm text-on-surface-variant">
            Service ID: {id}
          </p>

          <h1 className="mt-1 break-words text-2xl font-bold text-on-surface sm:text-3xl">
            {service.name}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant sm:text-base">
            {service.description}
          </p>
        </div>

        <section
          className="mb-8 rounded-lg border border-outline-variant bg-surface-container-lowest p-4 sm:p-6"
          aria-labelledby="service-information"
        >
          <h2
            id="service-information"
            className="text-lg font-semibold text-on-surface"
          >
            Service information
          </h2>

          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-on-surface-variant">
                Category
              </dt>

              <dd className="mt-1 text-sm text-on-surface">
                {service.category}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-on-surface-variant">
                Service
              </dt>

              <dd className="mt-1 break-words text-sm text-on-surface">
                {service.name}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="service-price-comparison">
          <h2
            id="service-price-comparison"
            className="mb-4 text-xl font-semibold text-on-surface"
          >
            Compare prices
          </h2>

          <ComparisonTable providers={providers} />
        </section>
      </div>
    </main>
  );
};

export default ServiceDetail;