import BrowsePage from '../components/BrowsePage'
import catalog from '../data/catalog'
import images from '../data/images'

const services = catalog.filter((item) => item.kind !== 'Medication')

const filters = [
  { param: 'type', label: 'Type', getValue: (item) => item.kind },
  { param: 'category', label: 'Category', getValue: (item) => item.category },
]

export default function Services() {
  return (
    <BrowsePage
      title="Lab test and care prices in Bamenda"
      intro="What hospitals, health centres and labs charge for tests, scans and consultations. Open one to compare every provider."
      searchLabel="Search lab tests and services"
      searchPlaceholder="Test or service, e.g. malaria test or ultrasound"
      items={services}
      filters={filters}
      noun="services"
      image={images["Lab test"]}
      showKind
      crossLink={{ label: 'Search medications instead', to: '/catalogue' }}
    />
  )
}
