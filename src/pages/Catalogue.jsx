import { useEffect, useState } from 'react'
import MedicationCard from '../components/MedicationCard'

export default function Catalogue() {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const medications = [
        {
            id: 1,
            name: 'Paracetamol',
            description: 'Used to relieve pain and reduce fever.',
            trust: 'SEED-verified',
        },
        {
            id: 2,
            name: 'Amoxicillin',
            description: 'An antibiotic used to treat bacterial infections.',
            trust: 'Provider-verified',
        },
        {
            id: 3,
            name: 'Ibuprofen',
            description: 'Used to relieve pain, inflammation and fever.',
            trust: 'Community-reported',
        },
    ]

    const itemsPerPage = 6

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const filteredMedications = medications.filter((medication) =>
        medication.name.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.ceil(
        filteredMedications.length / itemsPerPage
    )

    const startIndex = (currentPage - 1) * itemsPerPage

    const currentMedications = filteredMedications.slice(
        startIndex,
        startIndex + itemsPerPage
    )

    const handleSearch = (event) => {
        setSearch(event.target.value)
        setCurrentPage(1)
    }

    const handleRetry = () => {
        setError(false)
        setLoading(true)

        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

    return (
        <section className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Medication Catalogue
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
                    Search and compare medication prices across Bamenda.
                </p>
            </div>

            <div className="mb-6">
                <label
                    htmlFor="medication-search"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Search medications
                </label>

                <input
                    id="medication-search"
                    type="search"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search for a medication..."
                    className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:px-4 sm:text-base"
                />
            </div>

            {loading ? (
                <div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    role="status"
                    aria-live="polite"
                    aria-label="Loading medications"
                >
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-lg border border-gray-200 bg-white p-5"
                        >
                            <div className="h-5 w-2/3 rounded bg-gray-200" />

                            <div className="mt-4 h-4 w-full rounded bg-gray-200" />

                            <div className="mt-2 h-4 w-5/6 rounded bg-gray-200" />

                            <div className="mt-5 h-7 w-32 rounded-full bg-gray-200" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div
                    className="rounded-lg border border-red-200 p-6 text-center sm:p-8"
                    role="alert"
                >
                    <p className="font-medium text-red-700">
                        Unable to load medications.
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                        Please try again.
                    </p>

                    <button
                        type="button"
                        onClick={handleRetry}
                        className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        Try again
                    </button>
                </div>
            ) : filteredMedications.length === 0 ? (
                <div
                    className="rounded-lg border border-gray-200 p-6 text-center sm:p-8"
                    role="status"
                >
                    <p className="font-medium text-gray-900">
                        No medications found.
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                        We couldn't find a medication matching "{search}".
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch('')
                            setCurrentPage(1)
                        }}
                        className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {currentMedications.map((medication) => (
                            <MedicationCard
                                key={medication.id}
                                medication={medication}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <nav
                            className="mt-8 flex items-center justify-center gap-2"
                            aria-label="Medication catalogue pagination"
                        >
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                Previous
                            </button>

                            <span
                                className="px-3 text-sm text-gray-700"
                                aria-live="polite"
                            >
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </>
            )}
        </section>
    )
}