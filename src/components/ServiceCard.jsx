import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiCheckCircle,
  FiMapPin,
  FiShield,
} from 'react-icons/fi'

export default function ServiceCard({ service }) {
  const formattedPrice = service.price
    ? `FCFA ${service.price.toLocaleString()}`
    : 'Price unavailable'

  const verificationStyles = {
    'Seed Verified': {
      icon: FiShield,
      className: 'text-emerald-700',
    },
    'Provider Verified': {
      icon: FiCheckCircle,
      className: 'text-blue-600',
    },
    'Community Reported': {
      icon: FiCheckCircle,
      className: 'text-amber-600',
    },
  }

  const verification =
    verificationStyles[service.verification] ||
    verificationStyles['Provider Verified']

  const VerificationIcon = verification.icon

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}
      <Link
        to={`/service/${service.id}`}
        className="relative block overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-inset"
      >
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
  {service.image ? (
    <img
      src={service.image}
      alt={service.name}
      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display = 'none'
        event.currentTarget.nextElementSibling.style.display = 'flex'
      }}
    />
  ) : null}

  <div
    className={`h-full items-center justify-center bg-gradient-to-br from-emerald-50 via-gray-100 to-emerald-100 ${
      service.image ? 'hidden' : 'flex'
    }`}
  >
    <div className="text-center">
      <FiShield className="mx-auto h-8 w-8 text-emerald-700" />

      <p className="mt-2 text-xs font-medium text-gray-500">
        MediPrice Service
      </p>
    </div>
  </div>
</div>

        {/* Popular badge */}
        {service.popularity && (
          <span className="absolute left-3 top-3 rounded-sm bg-emerald-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {service.popularity}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category + Price */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              {service.category}
            </p>

            <Link
              to={`/service/${service.id}`}
              className="mt-1 block focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <h2 className="text-sm font-semibold leading-5 text-gray-900 transition group-hover:text-emerald-700">
                {service.name}
              </h2>
            </Link>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-gray-900">
              {formattedPrice}
            </p>

            {service.unit && (
              <p className="mt-0.5 text-[9px] text-gray-400">
                {service.unit}
              </p>
            )}
          </div>
        </div>

        {/* Provider */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
          <FiMapPin
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />

          <span className="truncate">
            {service.provider || 'Provider information unavailable'}
          </span>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200" />

        {/* Verification + Compare */}
        <div className="flex items-center justify-between gap-3">
          <div
            className={`flex min-w-0 items-center gap-1.5 text-[10px] font-semibold ${verification.className}`}
          >
            <VerificationIcon
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />

            <span className="truncate">
              {service.verification || 'Provider Verified'}
            </span>
          </div>

          <Link
            to={`/service/${service.id}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
          >
            Compare

            <FiArrowRight
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  )
}