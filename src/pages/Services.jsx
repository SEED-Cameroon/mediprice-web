import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import ServiceCard from '../components/ServiceCard'

const demoServices = [
  {
    id: '1',
    name: 'Complete Blood Count',
    type: 'Lab',
    category: 'Laboratory',
  },
  {
    id: '2',
    name: 'Malaria Test',
    type: 'Lab',
    category: 'Laboratory',
  },
  {
    id: '3',
    name: 'General Consultation',
    type: 'Care',
    category: 'Consultation',
  },
]

export default function Services() {
  const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const type = searchParams.get('type') || 'all'
  const category = searchParams.get('category') || 'all'

  const updateSearchParams = (key, value) => {
    const nextParams = new URLSearchParams(searchParams)

    if (!value || value === 'all') {
      nextParams.delete(key)
    } else {
      nextParams.set(key, value)
    }

    setSearchParams(nextParams)
  }

  const filteredServices = useMemo(() => {
    return demoServices.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesType =
        type === 'all' || service.type === type

      const matchesCategory =
        category === 'all' || service.category === category

      return matchesSearch && matchesType && matchesCategory
    })
  }, [search, type, category])

  return (
    <section className="mx-auto max-w-7xl">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Labs & Services
        </h1>

        <p className="mt-2 text-gray-600">
          Find and compare laboratory tests and healthcare services.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {/* Search */}
        <input
          type="search"
          value={search}
          onChange={(event) =>
            updateSearchParams('search', event.target.value)
          }
          placeholder="Search services..."
          aria-label="Search services"
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />

        {/* Service type */}
        <select
          value={type}
          onChange={(event) =>
            updateSearchParams('type', event.target.value)
          }
          aria-label="Filter by service type"
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-600"
        >
          <option value="all">All service types</option>
          <option value="Lab">Lab</option>
          <option value="Care">Care</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(event) =>
            updateSearchParams('category', event.target.value)
          }
          aria-label="Filter by category"
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-600"
        >
          <option value="all">All categories</option>
          <option value="Laboratory">Laboratory</option>
          <option value="Consultation">Consultation</option>
        </select>
        <button
  type="button"
  onClick={() => setSearchParams({})}
  className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 md:col-span-3"
>
  Clear filters
</button>
      </div>

    
      
      {/* Results */}
{/* Results */}
{loading ? (
  <div
    className="rounded-xl border border-gray-200 p-10 text-center"
    role="status"
    aria-live="polite"
  >
    <p className="text-gray-600">
      Loading services...
    </p>
  </div>
) : error ? (
  <div
    className="rounded-xl border border-red-200 p-10 text-center"
    role="alert"
  >
    <h2 className="text-lg font-semibold text-gray-900">
      Unable to load services
    </h2>

    <p className="mt-2 text-gray-600">
      {error}
    </p>

    <button
      type="button"
      onClick={() => setError('')}
      className="mt-4 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
    >
      Try again
    </button>
  </div>
) : filteredServices.length === 0 ? (
  <div
    className="rounded-xl border border-gray-200 p-10 text-center"
    role="status"
  >
    <h2 className="text-lg font-semibold text-gray-900">
      No services found
    </h2>

    <p className="mt-2 text-gray-600">
      Try changing your search or filters.
    </p>
  </div>
) : (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {filteredServices.map((service) => (
      <ServiceCard
        key={service.id}
        service={service}
      />
    ))}
  </div>
)}
    </section>
  )
}