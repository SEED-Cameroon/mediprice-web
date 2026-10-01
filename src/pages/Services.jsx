import BrowsePage from '../components/BrowsePage'
import images from '../data/images'
import useApiFetch from '@/hooks/useApiFetch'
import { listServices } from '@/services/catalog'
import usePageMeta from '@/hooks/usePageMeta'

const filters = [
  { param: 'type', label: 'Type', getValue: (item) => item.kind },
  { param: 'category', label: 'Category', getValue: (item) => item.category },
]

export default function Services() {
  usePageMeta({
    title: 'Lab test and care prices in Bamenda',
    description: 'Compare what hospitals, health centres and labs in Bamenda charge for tests, scans and consultations.',
    canonicalPath: '/labs-services',
  })
  const { data, status, error, reload } = useApiFetch(() => listServices(), [])

  return (
    <BrowsePage
      title="Lab test and care prices in Bamenda"
      intro="What hospitals, health centres and labs charge for tests, scans and consultations. Open one to compare every provider."
      searchLabel="Search lab tests and services"
      searchPlaceholder="Search a test or service"
      items={data ?? []}
      filters={filters}
      noun="services"
      showKind
      image={images['Lab test']}
      crossLink={{ label: 'Search medicines instead', to: '/medications' }}
      status={status}
      errorMessage={error?.message}
      onRetry={reload}
    />
  )
}
