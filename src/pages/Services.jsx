import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard'

const demoServices = [
  {
    id: '1',
    name: 'Malaria RDT (Rapid)',
    type: 'Lab',
    category: 'Infectious Disease',
    provider: 'Regional Hospital Bamenda',
    price: 1500,
    unit: 'avg. price',
    verification: 'Seed Verified',
    popularity: 'Most Popular',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    name: 'Obstetric Ultrasound',
    type: 'Lab',
    category: 'Imaging',
    provider: "St. Mary's Soledad",
    price: 10000,
    unit: 'starting from',
    verification: 'Provider Verified',
    image:
      'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    name: 'Full Blood Count',
    type: 'Lab',
    category: 'Hematology',
    provider: 'Mbingo Baptist Hospital',
    price: 4500,
    unit: 'market price',
    verification: 'Community Reported',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    name: 'H. Pylori Test',
    type: 'Lab',
    category: 'Gastroenterology',
    provider: 'Bingo Health Center',
    price: 5000,
    unit: 'avg. price',
    verification: 'Seed Verified',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '5',
    name: 'Antenatal Profile',
    type: 'Care',
    category: 'Maternity',
    provider: 'Banso Baptist Hospital',
    price: 25000,
    unit: 'bundle price',
    verification: 'Provider Verified',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '6',
    name: 'Emergency Consultation',
    type: 'Care',
    category: 'Emergency',
    provider: 'Regional Hospital Bamenda',
    price: 5000,
    unit: 'starting from',
    verification: 'Provider Verified',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
  },
]

const categories = [
  'All Tests',
  'Blood Tests',
  'Imaging',
  'Maternity',
  'Emergency',
]

const categoryMap = {
  'Blood Tests': 'Hematology',
  Imaging: 'Imaging',
  Maternity: 'Maternity',
  Emergency: 'Emergency',
}

export default function Services() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const type = searchParams.get('type') || 'all'
  const category = searchParams.get('category') || 'all'
  const page = Number(searchParams.get('page')) || 1

  const updateSearchParams = (key, value) => {
    const nextParams = new URLSearchParams(searchParams)

    if (!value || value === 'all') {
      nextParams.delete(key)
    } else {
      nextParams.set(key, value)
    }

    if (key !== 'page') {
      nextParams.delete('page')
    }

    setSearchParams(nextParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const filteredServices = useMemo(() => {
    return demoServices.filter((service) => {
      const searchText = search.toLowerCase().trim()

      const matchesSearch =
        !searchText ||
        service.name.toLowerCase().includes(searchText) ||
        service.category.toLowerCase().includes(searchText) ||
        service.provider.toLowerCase().includes(searchText)

      const matchesType =
        type === 'all' ||
        service.type.toLowerCase() === type.toLowerCase()

      const matchesCategory =
        category === 'all' ||
        service.category === categoryMap[category] ||
        service.category === category

      return matchesSearch && matchesType && matchesCategory
    })
  }, [search, type, category])

  const ITEMS_PER_PAGE = 5

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / ITEMS_PER_PAGE)
  )

  const currentPage = Math.min(page, totalPages)

  const visibleServices = filteredServices.slice(
    0,
    currentPage * ITEMS_PER_PAGE
  )

  const selectCategory = (item) => {
    if (item === 'All Tests') {
      updateSearchParams('category', '')
      return
    }

    updateSearchParams('category', item)
  }

  const loadMore = () => {
    if (currentPage < totalPages) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.set('page', String(currentPage + 1))
      setSearchParams(nextParams)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Search */}
      <div className="mb-4">
        <label htmlFor="service-search" className="sr-only">
          Search services
        </label>

        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700"
            aria-hidden="true"
          >
            ⌕
          </span>

          <input
            id="service-search"
            type="search"
            value={search}
            onChange={(event) =>
              updateSearchParams('search', event.target.value)
            }
            placeholder="Search labs, tests or services..."
            aria-label="Search services"
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => updateSearchParams('search', '')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main service tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => updateSearchParams('type', 'Lab')}
            className={`border-b-2 pb-3 text-xs font-semibold uppercase tracking-wide ${
              type === 'Lab'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-gray-500'
            }`}
          >
            Lab Tests
          </button>

          <button
            type="button"
            onClick={() => updateSearchParams('type', 'Care')}
            className={`border-b-2 pb-3 text-xs font-semibold uppercase tracking-wide ${
              type === 'Care'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-gray-500'
            }`}
          >
            Care Services
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-3 py-4">
        {categories.map((item) => {
          const active =
            item === 'All Tests'
              ? category === 'all'
              : category === item

          return (
            <button
              key={item}
              type="button"
              onClick={() => selectCategory(item)}
              className={`rounded-lg border px-4 py-2 text-xs font-medium transition ${
                active
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-emerald-600 hover:text-emerald-700'
              }`}
            >
              {item}

              {item !== 'All Tests' && (
                <span className="ml-2 text-[10px]">⌄</span>
              )}
            </button>
          )
        })}

        {(search || type !== 'all' || category !== 'all') && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-900"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="status"
          aria-live="polite"
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-[380px] animate-pulse rounded-xl border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-10 text-center"
          role="alert"
        >
          <h2 className="text-lg font-semibold text-red-900">
            Unable to load services
          </h2>

          <p className="mt-2 text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => setError('')}
            className="mt-5 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      ) : filteredServices.length === 0 ? (
        <div
          className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center"
          role="status"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            No services found
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>

          {/* Load more */}
          {currentPage < totalPages && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-emerald-600 hover:text-emerald-700"
              >
                Load more services
                <span className="ml-2">⌄</span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}