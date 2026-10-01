import medications from './Medications'
import services from './services'

/**
 * Every priced item in one list, with the fields shared pages need.
 * Replace with API calls once the backend is wired.
 */
const catalog = [
  ...medications.map((item) => ({
    ...item,
    key: `medication-${item.id}`,
    kind: 'Medication',
    href: `/medication/${item.id}`,
    priceFor: item.form,
  })),
  ...services.map((item) => ({
    ...item,
    key: `service-${item.id}`,
    kind: item.type === 'Lab' ? 'Lab test' : 'Care service',
    href: `/service/${item.id}`,
    priceFor: item.type === 'Lab' ? 'One test' : 'One visit',
  })),
]

/** Every provider that appears in the catalogue, de-duplicated by name. */
export const providers = [
  ...new Map(
    catalog
      .flatMap((item) => item.providers)
      .map((provider) => [provider.name, { name: provider.name, type: provider.type, area: provider.area }]),
  ).values(),
].sort((a, b) => a.name.localeCompare(b.name))

export default catalog
