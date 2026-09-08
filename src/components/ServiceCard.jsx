import { Link } from 'react-router-dom'

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/service/${service.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {service.name}
      </h2>

      {service.type && (
        <p className="mt-2 text-sm text-gray-500">
          {service.type}
        </p>
      )}

      {service.category && (
        <p className="mt-1 text-sm text-gray-500">
          Category: {service.category}
        </p>
      )}
    </Link>
  )
}